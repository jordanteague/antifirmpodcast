import { site } from "@/data/site";
import { PlatformIcon } from "./icons";

/** Launch-day feature: one video (the 8-bit billable hour music video) just below the episodes. Hidden until a YouTube ID is set in data/site.ts. */
export function WatchSection() {
  const v = site.featuredVideo;
  if (!v.youtubeId) return null;
  const youtube = `https://www.youtube.com/watch?v=${v.youtubeId}`;

  return (
    <section id="watch" aria-labelledby="watch-title" className="border-b border-rule">
      <div className="container-page grid gap-8 py-14 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:items-center md:gap-12 md:py-16">
        <div className="min-w-0">
          <h2 className="label mb-4 text-brand-lime">Watch</h2>
          <p id="watch-title" className="font-display text-[clamp(2.25rem,5vw,3.75rem)] font-black uppercase leading-[0.9] [font-stretch:68%]">
            {v.title}
          </p>
          {v.description && <p className="mt-5 max-w-[42ch] text-text-secondary">{v.description}</p>}
          <a href={youtube} className="label mt-7 inline-flex items-center gap-2 transition-colors hover:text-brand-lime">
            <PlatformIcon id="youtube" className="size-[1.1rem]" />
            Watch on YouTube
          </a>
        </div>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${v.youtubeId}?rel=0&playsinline=1`}
          title={v.title}
          allow="encrypted-media; picture-in-picture; fullscreen"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          loading="lazy"
          className="block aspect-video h-auto w-full min-w-0 border border-rule bg-black"
        />
      </div>
    </section>
  );
}
