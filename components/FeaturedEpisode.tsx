import Image from "next/image";
import { categoryStyle } from "@/lib/categories";
import { episodeHref, episodeLabel, type Episode } from "@/lib/episodes";
import { Button } from "./Button";
import { PlatformIcon, PlayIcon } from "./icons";

export function FeaturedEpisode({ episode }: { episode: Episode }) {
  const platforms = [
    { id: "youtube", label: "Watch on YouTube", href: episode.links.youtube },
    { id: "spotify", label: "Listen on Spotify", href: episode.links.spotify },
    { id: "apple", label: "Listen on Apple Podcasts", href: episode.links.apple },
  ] as const;
  const category = categoryStyle(episode.category);
  const page = episodeHref(episode);

  return (
    <article aria-labelledby="latest-title" className="min-w-0">
      <h2 className="label mb-4 text-brand-blue">Latest episode</h2>
      <div className="grid items-center gap-6 md:grid-cols-2 md:gap-8">
        <a
          href={page}
          className={`group relative block overflow-hidden border border-rule border-b-2 transition-colors ${category.rule} ${category.hoverBorder}`}
          aria-label={`${episode.title}: episode page`}
        >
          <Image
            src={episode.artwork}
            alt=""
            width={428}
            height={216}
            sizes="(min-width: 768px) 30vw, 100vw"
            className={`aspect-[428/216] h-auto w-full transition-transform object-cover duration-500 ease-out group-hover:scale-[1.03]`}
          />
          {category.overlay && (
            <span
              aria-hidden="true"
              className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${category.overlay}`}
            />
          )}
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-text-primary bg-background-primary/45 transition-colors group-hover:border-brand-lime group-hover:bg-brand-lime group-hover:text-background-primary"
          >
            <PlayIcon className="ml-1 h-[1.15rem] w-4" />
          </span>
          {episode.duration && (
            <span className="absolute bottom-2.5 right-3 font-display text-[0.8rem] tabular-nums tracking-wide">
              {episode.duration}
            </span>
          )}
        </a>

        <div className="min-w-0">
          <p className="label mb-1.5 text-xs">
            {episodeLabel(episode)}
            {category.label && (
              <>
                <span aria-hidden="true" className="text-text-secondary"> · </span>
                <span className={category.text}>{category.label}</span>
              </>
            )}
          </p>
          <h3 id="latest-title" className="mb-3.5 text-balance text-[clamp(1.75rem,2.5vw,2.4rem)] leading-[1.1]">
            <a href={page} className="transition-colors hover:text-brand-lime">
              {episode.title}
            </a>
          </h3>
          <p className="mb-6 line-clamp-3 max-w-[42ch] text-text-secondary">{episode.description}</p>
          <div className="flex flex-wrap items-center gap-6">
            <Button href={episode.links.watch}>Watch now</Button>
            <span aria-hidden="true" className="h-10 w-px bg-rule" />
            <ul className="flex items-center gap-6">
              {platforms.map((p) => (
                <li key={p.id}>
                  <a href={p.href} aria-label={p.label} className="block transition-colors hover:text-brand-lime">
                    <PlatformIcon id={p.id} className="size-6" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </article>
  );
}
