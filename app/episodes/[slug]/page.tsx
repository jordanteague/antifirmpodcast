import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PlayerProvider } from "@/components/episode/PlayerContext";
import { EpisodePlayer, SeekLink } from "@/components/episode/EpisodePlayer";
import { VideoEmbed } from "@/components/episode/VideoEmbed";
import { EpisodeTabs } from "@/components/episode/EpisodeTabs";
import { Arrow, ShareButton } from "@/components/episode/ShareButton";
import { categoryStyle } from "@/lib/categories";
import { asset, episodeLabel, formatClock, getEpisode, getEpisodes, parseClock } from "@/lib/episodes";
import { site } from "@/data/site";

export const dynamicParams = false;

export async function generateStaticParams() {
  const { all } = await getEpisodes();
  return all.map((ep) => ({ slug: ep.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const ep = await getEpisode((await params).slug);
  if (!ep) return {};
  const title = `${ep.title} · ${episodeLabel(ep)} · ${site.name}`;
  return {
    title,
    description: ep.description,
    openGraph: { title, description: ep.description, type: "article", images: ep.cover ? [ep.cover] : undefined },
  };
}

/**
 * Headline size steps down with title length so long titles stay within about three lines,
 * including in the narrower column beside a video. Class names are spelled out for Tailwind.
 */
function headlineSize(title: string) {
  const n = title.length;
  if (n <= 18) return "leading-[0.95] text-[clamp(3rem,8.5vw,6.5rem)] lg:text-[clamp(3.5rem,5.4vw,6rem)]";
  if (n <= 32) return "leading-[1] text-[clamp(2.6rem,7.5vw,5.25rem)] lg:text-[clamp(2.9rem,4.3vw,4.75rem)]";
  if (n <= 55) return "leading-[1.04] text-[clamp(2.3rem,6vw,4.25rem)] lg:text-[clamp(2.5rem,3.4vw,3.75rem)]";
  return "leading-[1.06] text-[clamp(2rem,5vw,3.5rem)] lg:text-[clamp(2.1rem,2.7vw,3rem)]";
}

export default async function EpisodePage({ params }: Props) {
  const ep = await getEpisode((await params).slug);
  if (!ep) notFound();

  const category = categoryStyle(ep.category);
  const minutes = ep.duration ? Math.round(parseClock(ep.duration) / 60) : null;
  const short = ep.number ? `EP. ${String(ep.number).padStart(2, "0")}` : episodeLabel(ep).toUpperCase();
  const label = ep.number ? `Episode ${String(ep.number).padStart(2, "0")}` : episodeLabel(ep);
  const also = [
    { label: "YouTube", href: ep.links.youtube },
    { label: "Spotify", href: ep.links.spotify },
    { label: "Apple Podcasts", href: ep.links.apple },
  ];

  const notes = (
    <div className="max-w-[62ch] space-y-5 text-[1.1rem] leading-relaxed text-ink-secondary sm:text-[1.2rem]">
      {(ep.showNotes.length ? ep.showNotes : [ep.description]).map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  );

  const transcript = ep.transcript && (
    <ol className="max-w-[68ch] space-y-6">
      {ep.transcript.map((line, i) => (
        <li key={i} className="grid gap-1 sm:grid-cols-[4.5rem_minmax(0,1fr)] sm:gap-5">
          <SeekLink start={line.start} className="font-mono text-[0.85rem] leading-7 text-ink-secondary hover:text-olive">
            {formatClock(line.start)}
          </SeekLink>
          <p className="text-[1.05rem] leading-relaxed">
            <span className="font-display font-semibold">{line.speaker}</span>
            <span className="sr-only">:</span> <span className="text-ink/85">{line.text}</span>
          </p>
        </li>
      ))}
    </ol>
  );

  return (
    <>
      <SiteHeader />
      <main id="main" className="bg-paper text-ink">
        <PlayerProvider src={ep.audioUrl} initialDuration={ep.duration ? parseClock(ep.duration) : 0}>
          <div className="container-page pb-16 pt-8 sm:pb-24 sm:pt-12">
            <a href={asset("/#episodes")} className="label inline-flex items-center gap-2.5 hover:text-olive">
              <span aria-hidden="true">←</span> All episodes
            </a>

            <div
              className={`mt-8 grid gap-10 sm:mt-14 lg:gap-16 ${ep.youtubeId ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,55%)]" : "lg:grid-cols-[minmax(0,1fr)_minmax(0,40%)]"}`}
            >
              <div className="min-w-0 self-center">
                <p className="label flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.75rem] sm:text-[0.8125rem]">
                  <span>{label}</span>
                  {category.label && (
                    <>
                      <span aria-hidden="true" className="size-2 rounded-full bg-olive" />
                      <span>{category.label}</span>
                    </>
                  )}
                  {minutes && <span>{minutes} min</span>}
                </p>
                <h1 className={`mt-5 text-balance tracking-[-0.02em] sm:mt-7 ${headlineSize(ep.title)}`}>{ep.title}</h1>
                {ep.description && (
                  <p className="mt-6 max-w-[40ch] font-display text-[1.15rem] leading-relaxed text-ink-secondary sm:mt-8 sm:text-[1.35rem]">
                    {ep.description}
                  </p>
                )}
                {ep.hosts.length > 0 && (
                  <p className="mt-6 font-display text-[1rem] sm:mt-8">
                    With{" "}
                    {ep.hosts.map((h, i) => (
                      <span key={h}>
                        {i > 0 && (i === ep.hosts.length - 1 ? " & " : ", ")}
                        <strong className="font-semibold">{h}</strong>
                      </span>
                    ))}
                  </p>
                )}
              </div>

              <div
                id={ep.youtubeId ? "watch" : undefined}
                className={`relative mx-auto w-full self-center scroll-mt-40 lg:max-w-none ${ep.youtubeId ? "max-w-3xl" : "max-w-md"}`}
              >
                <div aria-hidden="true" className="absolute inset-0 translate-x-3 translate-y-3 bg-ink sm:translate-x-4 sm:translate-y-4" />
                {ep.youtubeId ? (
                  <VideoEmbed id={ep.youtubeId} title={ep.title} />
                ) : (
                  <Image
                    src={ep.cover}
                    alt={`${ep.title} episode artwork`}
                    width={1200}
                    height={1200}
                    priority
                    sizes="(min-width: 1024px) 40vw, 90vw"
                    className="relative aspect-square h-auto w-full border border-ink-rule object-cover"
                  />
                )}
              </div>
            </div>

            <div className="mt-12 sm:mt-16">
              <EpisodePlayer label={short} />
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3 font-display sm:mt-8">
              <span className="label text-[0.75rem] tracking-[0.08em] text-ink-secondary">Also on</span>
              {also.map((p) => (
                <a key={p.label} href={p.href} className="inline-flex items-center gap-2 transition-colors hover:text-olive">
                  {p.label} <Arrow />
                </a>
              ))}
              <span className="ml-auto">
                <ShareButton title={`${ep.title} · ${site.name}`} />
              </span>
            </div>

            <div className="mt-10 grid gap-12 border-t border-ink-rule pt-10 sm:mt-14 sm:pt-14 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-0">
              <div className="min-w-0 lg:pr-12">
                <EpisodeTabs notes={notes} transcript={transcript} />
              </div>

              {ep.chapters.length > 0 && (
                <aside aria-labelledby="chapters" className="lg:border-l lg:border-ink-rule lg:pl-12">
                  <h2 id="chapters" className="label font-semibold">
                    Skip to the good part
                  </h2>
                  <ol className="mt-6 border-t border-ink-rule">
                    {ep.chapters.map((c) => (
                      <li key={c.start} className="border-b border-ink-rule">
                        <SeekLink
                          start={c.start}
                          className="group grid grid-cols-[4rem_minmax(0,1fr)_auto] items-center gap-4 py-5 transition-colors hover:text-olive"
                        >
                          <span className="font-mono text-[0.9rem] text-ink-secondary">{formatClock(c.start)}</span>
                          <span className="font-display leading-snug">{c.title}</span>
                          <Arrow className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </SeekLink>
                      </li>
                    ))}
                  </ol>
                </aside>
              )}
            </div>
          </div>
        </PlayerProvider>
      </main>
      <SiteFooter />
    </>
  );
}
