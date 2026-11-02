import { readFile } from "node:fs/promises";
import { XMLParser } from "fast-xml-parser";
import meta from "@/data/episode-meta.json";
import { site } from "@/data/site";
import type { CategoryId } from "./categories";

export type Episode = {
  id: string;
  title: string;
  kind: "full" | "trailer" | "bonus";
  number: number | null;
  category: CategoryId | null;
  /** Plain-text description. */
  description: string;
  /** ISO timestamp. */
  publishedAt: string;
  /** "m:ss" or "h:mm:ss", or null if the feed doesn't say. */
  duration: string | null;
  /** YouTube thumbnail when the episode has a YouTube link, otherwise the feed's artwork. */
  artwork: string;
  audioUrl: string | null;
  links: { watch: string; youtube: string; spotify: string; apple: string };
};

type Meta = { category?: CategoryId | null; youtubeId?: string | null };

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prefix a public/ path with the deploy base path (needed on GitHub Pages project sites). */
export function asset(path: string) {
  return path.startsWith("/") ? `${basePath}${path}` : path;
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}

/**
 * The feed is read once, at build time. FEED_FILE points at a local copy for offline work
 * (data/feed.sample.xml); otherwise FEED_URL, defaulting to the Riverside feed. A failed fetch
 * fails the build, so a deploy never replaces the live site with an empty episode list.
 */
async function loadFeedXml(): Promise<string> {
  if (process.env.FEED_FILE) return readFile(process.env.FEED_FILE, "utf8");
  const url = process.env.FEED_URL ?? site.feedUrl;
  const res = await fetch(url, { cache: "force-cache" });
  if (!res.ok) throw new Error(`Could not load the podcast feed (${res.status}) from ${url}`);
  return res.text();
}

const htmlEntities: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };

function toPlainText(html: string) {
  return html
    .replace(/<\/p>\s*<p>|<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (m, code: string) => {
      if (code[0] === "#") {
        const n = code[1].toLowerCase() === "x" ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
        return Number.isFinite(n) ? String.fromCodePoint(n) : m;
      }
      return htmlEntities[code.toLowerCase()] ?? m;
    })
    .trim();
}

/** itunes:duration can be seconds ("44") or clock time ("00:00:44"). */
function formatDuration(raw: unknown): string | null {
  if (raw == null || raw === "") return null;
  const parts = String(raw).split(":").map(Number);
  if (parts.some((n) => !Number.isFinite(n))) return null;
  const total = parts.reduce((acc, n) => acc * 60 + n, 0);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = Math.round(total % 60);
  const ss = String(s).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${ss}` : `${m}:${ss}`;
}

const text = (v: unknown) => (v == null ? "" : typeof v === "object" ? String((v as { "#text"?: unknown })["#text"] ?? "") : String(v));

function parseFeed(xml: string): Episode[] {
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@", cdataPropName: false });
  const channel = parser.parse(xml)?.rss?.channel;
  if (!channel) throw new Error("The podcast feed has no <channel>.");
  const cover = channel["itunes:image"]?.["@href"] ?? "";
  const items = [channel.item ?? []].flat();
  const extra = meta.episodes as Record<string, Meta>;

  return items
    .map((item): Episode => {
      const id = text(item.guid) || text(item.link) || text(item.title);
      const m = extra[id] ?? {};
      const youtube = m.youtubeId ? `https://www.youtube.com/watch?v=${m.youtubeId}` : site.links.youtube;
      const type = text(item["itunes:episodeType"]).toLowerCase();
      const number = Number(text(item["itunes:episode"]));
      const itemArt = item["itunes:image"]?.["@href"] ?? cover;
      return {
        id,
        title: text(item["itunes:title"]) || text(item.title),
        kind: type === "trailer" ? "trailer" : type === "bonus" ? "bonus" : "full",
        number: Number.isFinite(number) && number > 0 ? number : null,
        category: m.category ?? null,
        description: toPlainText(text(item.description) || text(item["itunes:summary"])),
        publishedAt: new Date(text(item.pubDate)).toISOString(),
        duration: formatDuration(text(item["itunes:duration"])),
        artwork: m.youtubeId ? `https://i.ytimg.com/vi/${m.youtubeId}/hqdefault.jpg` : itemArt,
        audioUrl: item.enclosure?.["@url"] ?? null,
        links: { watch: youtube, youtube, spotify: site.links.spotify, apple: site.links.apple },
      };
    })
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export async function getEpisodes() {
  const all = parseFeed(await loadFeedXml());
  const trailer = all.find((e) => e.kind === "trailer") ?? null;
  // Feature the newest real episode; before the first one ships, feature the trailer.
  const featured = all.find((e) => e.kind !== "trailer") ?? trailer;
  return { all, featured, trailer };
}

export function episodeLabel(ep: Episode) {
  if (ep.kind === "trailer") return "Trailer";
  if (ep.kind === "bonus") return "Bonus";
  return ep.number ? `Episode ${ep.number}` : "Episode";
}
