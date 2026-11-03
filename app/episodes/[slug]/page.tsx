import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AudioPlayer } from "@/components/episode/AudioPlayer";
import { EpisodeTabs } from "@/components/episode/EpisodeTabs";
import { SeekButton } from "@/components/episode/SeekButton";
import { Arrow, ShareButton } from "@/components/episode/ShareButton";
import { site } from "@/data/site";
import showArt from "@/public/images/show-art.jpg";
import { categories } from "@/lib/categories";
import { clock, displayTitle, durationLabel, getEpisode, getEpisodes, type Episode } from "@/lib/episodes";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  const { all } = await getEpisodes();
  return all.map((ep) => ({ slug: ep.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const ep = await getEpisode((await params).slug);
  if (!ep) return {};
  const title = `${displayTitle(ep)} | ${site.name} Podcast`;
  return {
    title,
    description: ep.summary,
    openGraph: { title, description: ep.summary, type: "article", images: [ep.cover ?? showArt.src] },
  };
}

/** "Episode 01", "Trailer" or "Bonus", and the short form for the player. */
function labels(ep: Episode) {
  if (ep.kind === "trailer") return { long: "Trailer", short: "Trailer" };
  if (ep.kind === "bonus") return { long: "Bonus episode", short: "Bonus" };
  const n = ep.number ? String(ep.number).padStart(2, "0") : null;
  return { long: n ? `Episode ${n}` : "Episode", short: n ? `Ep. ${n}` : "Episode" };
}

const categoryDot: Record<string, string> = {
  business: "bg-category-business",
  law: "bg-category-law",
  risk: "bg-category-risk",
  other: "bg-category-other",
};

export default async function EpisodePage({ params }: Params) {
  const ep = await getEpisode((await params).slug);
  if (!ep) notFound();

  const title = displayTitle(ep);
  const { long, short } = labels(ep);
  const length = durationLabel(ep.durationSeconds);
  const also = [
    { label: "YouTube", href: ep.links.youtube },
    { label: "Spotify", href: ep.links.spotify },
    { label: "Apple Podcasts", href: ep.links.apple },
  ];
  const hasChapters = ep.chapters.length > 0;

  return (
    <>
      <SiteHeader onHome={false} />
      <main id="main" className="bg-text-primary text-background-primary">
        <div className="container-page pb-20 pt-10 md:pt-14">
          <Link href="/#episodes" className="label group inline-flex items-center gap-2.5 text-[0.85rem] hover:text-ink-secondary">
            <span aria-hidden="true" className="transition-transform group-hover:-translate-x-1">←</span>
            All episodes
          </Link>

          {/* Title and cover */}
          <div className="mt-10 grid items-start gap-12 md:mt-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-20">
            <div className="min-w-0">
              <p className="label flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.85rem]">
                <span>{long}</span>
                {ep.category && (
                  <span className="inline-flex items-center gap-3">
                    <span aria-hidden="true" className={`size-2.5 rounded-full ${categoryDot[ep.category]}`} />
                    {categories[ep.category].label}
                  </span>
                )}
                {length && <span>{length}</span>}
              </p>
              <h1 className="mt-7 text-balance font-serif text-[clamp(3rem,8vw,6.5rem)] font-medium leading-[0.98] tracking-[-0.02em] [font-variation-settings:'opsz'_72]">
                {title}
              </h1>
              {ep.summary && (
                <p className="mt-8 max-w-[44ch] font-display text-[clamp(1.15rem,1.6vw,1.45rem)] leading-normal text-ink-secondary">
                  {ep.summary}
                </p>
              )}
              <p className="mt-8 font-display text-[1.05rem]">
                With <strong className="font-semibold">{site.hosts[0]}</strong> &amp;{" "}
                <strong className="font-semibold">{site.hosts[1]}</strong>
              </p>
            </div>

            <div className="relative mx-auto w-full max-w-[20rem] sm:max-w-[28rem] lg:mx-0 lg:ml-auto">
                <span aria-hidden="true" className="absolute inset-0 translate-x-3 translate-y-3 bg-brand-lime sm:translate-x-4 sm:translate-y-4" />
                <Image
                  src={ep.cover ?? showArt}
                  alt={`${site.name} podcast cover art`}
                  width={1200}
                  height={1200}
                  priority
                  sizes="(min-width: 1024px) 28rem, 90vw"
                  className="relative aspect-square w-full border border-background-primary object-cover"
                />
              </div>
          </div>

          {/* Player */}
          <div id="player" className="mt-16 md:mt-20">
            {ep.audioUrl ? (
              <AudioPlayer src={ep.audioUrl} duration={ep.durationSeconds} label={short} title={title} />
            ) : (
              <p className="bg-background-primary px-8 py-8 text-text-primary">Audio for this episode is coming soon.</p>
            )}
          </div>

          {/* Also on, and share */}
          <div className="mt-7 flex flex-wrap items-center justify-between gap-6">
            <div className="flex flex-wrap items-center gap-x-10 gap-y-3">
              <span className="font-display text-[0.95rem] uppercase tracking-wide text-ink-secondary">Also on</span>
              <ul className="flex flex-wrap gap-x-10 gap-y-3">
                {also.map((p) => (
                  <li key={p.label}>
                    <a href={p.href} className="group inline-flex items-center gap-2 font-display text-[1.05rem] hover:text-ink-secondary">
                      {p.label}
                      <Arrow />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <ShareButton title={`${title} | ${site.name}`} />
          </div>

          <hr className="mt-12 border-rule-ink" />

          {/* Notes, transcript and chapters */}
          <div className={`mt-14 grid gap-14 ${hasChapters ? "lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)] lg:gap-0" : ""}`}>
            <div className={hasChapters ? "lg:pr-20" : "max-w-[62rem]"}>
              <EpisodeTabs
                notes={
                  <>
                    {ep.notesHeading && (
                      <h2 className="mb-8 whitespace-pre-line text-balance font-serif text-[clamp(2.25rem,4vw,3.4rem)] leading-[1.08]">
                        {ep.notesHeading}
                      </h2>
                    )}
                    {ep.notesHtml ? (
                      <div className="prose-notes max-w-[62ch] font-display" dangerouslySetInnerHTML={{ __html: ep.notesHtml }} />
                    ) : (
                      <p className="text-ink-secondary">Show notes are coming soon.</p>
                    )}
                  </>
                }
                transcript={<Transcript ep={ep} />}
              />
            </div>

            {hasChapters && (
              <aside aria-labelledby="chapters-title" className="min-w-0 lg:border-l lg:border-rule-ink lg:pl-12">
                <h2 id="chapters-title" className="label pt-1 text-[0.9rem] font-semibold">Skip to the good part</h2>
                <ol className="mt-8 border-t border-rule-ink">
                  {ep.chapters.map((c) => (
                    <li key={`${c.start}-${c.title}`} className="border-b border-rule-ink">
                      <SeekButton
                        to={c.start}
                        label={`Play from ${clock(c.start)}: ${c.title}`}
                        className="group grid w-full grid-cols-[4.5rem_minmax(0,1fr)_auto] items-center gap-4 py-7 text-left"
                      >
                        <span className="font-mono text-[0.95rem] text-ink-secondary">{clock(c.start)}</span>
                        <span className="font-display text-[1.15rem] leading-snug group-hover:underline group-hover:underline-offset-4">{c.title}</span>
                        <Arrow className="size-5" />
                      </SeekButton>
                    </li>
                  ))}
                </ol>
              </aside>
            )}
          </div>
        </div>
      </main>
      <div className="bg-background-primary">
        <SiteFooter />
      </div>
    </>
  );
}

function Transcript({ ep }: { ep: Episode }) {
  if (!ep.transcript.length) {
    return <p className="font-display text-[1.15rem] text-ink-secondary">The transcript for this episode isn’t up yet.</p>;
  }
  return (
    <ol className="grid max-w-[66ch] gap-7 font-display">
      {ep.transcript.map((line, i) => (
        <li key={i} className="grid gap-1.5">
          {(line.speaker || line.start != null) && (
            <p className="label flex items-center gap-3 text-[0.75rem]">
              {line.speaker && <span>{line.speaker}</span>}
              {line.start != null && (
                <SeekButton to={line.start} label={`Play from ${clock(line.start)}`} className="font-mono tracking-normal text-ink-secondary hover:text-background-primary">
                  {clock(line.start)}
                </SeekButton>
              )}
            </p>
          )}
          <p className="text-[1.1rem] leading-relaxed text-ink-secondary">{line.text}</p>
        </li>
      ))}
    </ol>
  );
}
