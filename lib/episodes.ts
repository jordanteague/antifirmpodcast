import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { XMLParser } from "fast-xml-parser";
import meta from "@/data/episode-meta.json";
import { site } from "@/data/site";
import type { CategoryId } from "./categories";

export type Chapter = { start: number; title: string };
export type TranscriptLine = { speaker: string; start: number | null; text: string };

export type Episode = {
  id: string;
  /** URL segment for the episode page: /episodes/<slug>/ */
  slug: string;
  title: string;
  kind: "full" | "trailer" | "bonus";
  number: number | null;
  category: CategoryId | null;
  /** Plain-text description. */
  description: string;
  /** First paragraph of the description, used as the page's standfirst. */
  summary: string;
  /** The feed's show notes as a small, safe subset of HTML. */
  notesHtml: string;
  /** Optional heading above the show notes (episode-meta.json). */
  notesHeading: string | null;
  chapters: Chapter[];
  transcript: TranscriptLine[];
  /** ISO timestamp. */
  publishedAt: string;
  /** "m:ss" or "h:mm:ss", or null if the feed doesn't say. */
  duration: string | null;
  durationSeconds: number | null;
  /** The feed's square cover art for the episode (or the show). */
  cover: string;
  /** YouTube thumbnail when the episode has a YouTube link, otherwise the feed's artwork. */
  artwork: string;
  audioUrl: string | null;
  links: { watch: string; youtube: string; spotify: string; apple: string };
};

type Meta = {
  category?: CategoryId | null;
  youtubeId?: string | null;
  slug?: string;
  notesHeading?: string;
  chapters?: { start: string; title: string }[];
};

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

/** "1:05", "01:02:03" or "44" to seconds. */
export function toSeconds(raw: unknown): number | null {
  if (raw == null || raw === "") return null;
  const parts = String(raw).trim().split(":").map(Number);
  if (parts.some((n) => !Number.isFinite(n))) return null;
  return parts.reduce((acc, n) => acc * 60 + n, 0);
}

/** Clock time for players and chapter lists: 0:44, 06:42 style with padded minutes. */
export function clock(seconds: number, padMinutes = true) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const ss = String(s).padStart(2, "0");
  if (h) return `${h}:${String(m).padStart(2, "0")}:${ss}`;
  return `${padMinutes ? String(m).padStart(2, "0") : m}:${ss}`;
}

/** "48 min", or "44 sec" for anything under a minute. */
export function durationLabel(seconds: number | null) {
  if (seconds == null) return null;
  return seconds < 60 ? `${Math.round(seconds)} sec` : `${Math.round(seconds / 60)} min`;
}

/** itunes:duration can be seconds ("44") or clock time ("00:00:44"). */
function formatDuration(raw: unknown): string | null {
  const total = toSeconds(raw);
  if (total == null) return null;
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = Math.round(total % 60);
  const ss = String(s).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${ss}` : `${m}:${ss}`;
}

export function slugify(s: string) {
  return s
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const allowedTags = new Set(["p", "br", "a", "strong", "b", "em", "i", "ul", "ol", "li", "blockquote", "h3", "h4"]);

/** Keep a small set of formatting tags from the feed's HTML and drop everything else, including all attributes but a safe href. */
function sanitizeHtml(html: string) {
  return html
    .replace(/<(script|style|iframe|object)[\s\S]*?<\/\1>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(\/?)([a-z0-9]+)([^>]*)>/gi, (_m, close: string, tag: string, attrs: string) => {
      const t = tag.toLowerCase();
      if (!allowedTags.has(t)) return "";
      if (close) return `</${t}>`;
      if (t === "a") {
        const href = /href\s*=\s*("([^"]*)"|'([^']*)')/i.exec(attrs);
        const url = href ? (href[2] ?? href[3] ?? "") : "";
        return /^(https?:|mailto:)/i.test(url)
          ? `<a href="${url.replace(/"/g, "&quot;")}" rel="noopener noreferrer">`
          : "<a>";
      }
      return `<${t}>`;
    })
    .trim();
}

/** The first paragraph of the feed's HTML, as plain text. */
function firstParagraph(html: string) {
  const m = /<p[^>]*>([\s\S]*?)<\/p>/i.exec(html);
  return toPlainText(m ? m[1] : html);
}

/**
 * Transcripts live in data/transcripts/<slug>.txt, in the format Riverside exports:
 * a "Speaker (m:ss)" line, then what they said, with a blank line between turns.
 */
async function loadTranscript(slug: string): Promise<TranscriptLine[]> {
  const file = path.join(process.cwd(), "data", "transcripts", `${slug}.txt`);
  if (!existsSync(file)) return [];
  const raw = await readFile(file, "utf8");
  return raw
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const [head, ...rest] = block.split("\n");
      const m = /^(.+?)\s*\((\d+:\d+(?::\d+)?)(?:\.\d+)?\)\s*$/.exec(head.trim());
      if (!m) return { speaker: "", start: null, text: block };
      return { speaker: m[1], start: toSeconds(m[2]), text: rest.join(" ").trim() };
    });
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
      const title = text(item["itunes:title"]) || text(item.title);
      const html = text(item["content:encoded"]) || text(item.description) || text(item["itunes:summary"]);
      const seconds = toSeconds(text(item["itunes:duration"]));
      return {
        id,
        slug: m.slug || slugify(title) || slugify(id),
        title,
        kind: type === "trailer" ? "trailer" : type === "bonus" ? "bonus" : "full",
        number: Number.isFinite(number) && number > 0 ? number : null,
        category: m.category ?? null,
        description: toPlainText(text(item.description) || text(item["itunes:summary"])),
        summary: firstParagraph(html),
        // The first paragraph already sits under the title, so the notes start after it.
        notesHtml: sanitizeHtml(html.replace(/^\s*<p[^>]*>[\s\S]*?<\/p>/i, "")) || sanitizeHtml(html),
        notesHeading: m.notesHeading ?? null,
        chapters: (m.chapters ?? [])
          .map((c) => ({ start: toSeconds(c.start) ?? 0, title: c.title }))
          .sort((a, b) => a.start - b.start),
        transcript: [],
        publishedAt: new Date(text(item.pubDate)).toISOString(),
        duration: formatDuration(text(item["itunes:duration"])),
        durationSeconds: seconds,
        cover: itemArt,
        artwork: m.youtubeId ? `https://i.ytimg.com/vi/${m.youtubeId}/hqdefault.jpg` : itemArt,
        audioUrl: item.enclosure?.["@url"] ?? null,
        links: { watch: youtube, youtube, spotify: site.links.spotify, apple: site.links.apple },
      };
    })
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

let cache: Promise<Episode[]> | null = null;

async function loadAll() {
  cache ??= (async () => {
    const all = parseFeed(await loadFeedXml());
    const seen = new Set<string>();
    for (const ep of all) {
      // Two episodes with the same title still get their own pages.
      let slug = ep.slug;
      for (let i = 2; seen.has(slug); i++) slug = `${ep.slug}-${i}`;
      seen.add(slug);
      ep.slug = slug;
      ep.transcript = await loadTranscript(slug);
    }
    return all;
  })();
  return cache;
}

export async function getEpisode(slug: string) {
  return (await loadAll()).find((e) => e.slug === slug) ?? null;
}

/** Path of an episode's page, without the base path (next/link adds it). */
export function episodeHref(ep: Episode) {
  return `/episodes/${ep.slug}/`;
}

/** The trailer's title without its "| Trailer" suffix, since the page labels it already. */
export function displayTitle(ep: Episode) {
  return ep.kind === "trailer" ? ep.title.replace(/\s*[|:–—-]\s*trailer\s*$/i, "") : ep.title;
}

export async function getEpisodes() {
  const all = await loadAll();
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
