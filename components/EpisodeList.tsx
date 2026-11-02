import Image from "next/image";
import { site } from "@/data/site";
import { categoryStyle } from "@/lib/categories";
import { episodeLabel, formatDate, type Episode } from "@/lib/episodes";

export function EpisodeList({ episodes }: { episodes: Episode[] }) {
  return (
    <aside aria-labelledby="all-episodes" className="min-w-0 border-t border-rule pt-6 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
      <h2 id="all-episodes" className="label mb-4 text-brand-blue">
        All episodes
      </h2>
      {episodes.length > 1 ? (
        <ol className="grid gap-2.5">
          {episodes.map((ep) => {
            const category = categoryStyle(ep.category);
            return (
              <li key={ep.id}>
                <a
                  href={ep.links.watch}
                  className="group grid grid-cols-[4.8rem_minmax(0,1fr)_auto] items-center gap-4 transition-colors"
                >
                  <span className={`relative block border border-rule border-b-2 transition-colors ${category.rule} ${category.hoverBorder}`}>
                    <Image
                      src={ep.artwork}
                      alt=""
                      width={77}
                      height={66}
                      className={`aspect-[77/66] w-full object-cover`}
                    />
                    {category.overlay && (
                      <span
                        aria-hidden="true"
                        className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${category.overlay}`}
                      />
                    )}
                  </span>
                  <span className="grid gap-1.5">
                    {category.label && (
                      <span className={`label text-[0.68rem] tracking-[0.14em] ${category.text}`}>{category.label}</span>
                    )}
                    <span className={`leading-tight transition-colors ${category.hoverText}`}>{ep.title}</span>
                    <span className="label text-[0.68rem] tracking-[0.14em] text-text-secondary">
                      {episodeLabel(ep)}
                      <span aria-hidden="true"> · </span>
                      <time dateTime={ep.publishedAt}>{formatDate(ep.publishedAt)}</time>
                    </span>
                  </span>
                  <span aria-hidden="true" className="pr-2 text-2xl text-text-secondary transition-transform group-hover:translate-x-1 group-hover:text-brand-lime">
                    ›
                  </span>
                </a>
              </li>
            );
          })}
        </ol>
      ) : (
        <div className="grid gap-3">
          <p className="text-[1.15rem] leading-snug">The first full episode is on its way.</p>
          <p className="text-text-secondary">
            Follow the show on{" "}
            <a href={site.links.spotify} className="text-text-primary underline decoration-rule underline-offset-4 hover:text-brand-lime">
              Spotify
            </a>{" "}
            or{" "}
            <a href={site.links.apple} className="text-text-primary underline decoration-rule underline-offset-4 hover:text-brand-lime">
              Apple Podcasts
            </a>{" "}
            to get it the day it drops.
          </p>
        </div>
      )}
    </aside>
  );
}
