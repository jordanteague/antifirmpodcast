"use client";

import { usePlayer } from "./PlayerContext";

/**
 * The episode's YouTube video. Shows the thumbnail until clicked, so YouTube
 * loads nothing (no cookies, no scripts) for visitors who only read or listen.
 */
export function VideoEmbed({ id, title }: { id: string; title: string }) {
  const { video, startVideo, videoRef } = usePlayer();

  if (video) {
    const params = new URLSearchParams({ autoplay: "1", enablejsapi: "1", rel: "0", playsinline: "1", start: String(video.start) });
    return (
      <iframe
        ref={videoRef}
        src={`https://www.youtube-nocookie.com/embed/${id}?${params}`}
        title={`${title} (video)`}
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
        className="relative block aspect-video h-auto w-full border border-ink-rule bg-ink"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => startVideo()}
      aria-label={`Watch ${title}`}
      className="group relative block aspect-video w-full overflow-hidden border border-ink-rule bg-ink"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`}
        onError={(e) => {
          const img = e.currentTarget;
          if (!img.src.endsWith("/hqdefault.jpg")) img.src = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
        }}
        alt=""
        className="absolute inset-0 size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
      />
      {/* Kept in the corner so it doesn't cover the words in the YouTube thumbnail. */}
      <span className="label absolute bottom-3 left-3 flex items-center gap-3 bg-brand-lime py-2.5 pl-3 pr-4 text-[0.7rem] font-semibold text-ink transition-colors group-hover:bg-text-primary sm:bottom-4 sm:left-4 sm:py-3 sm:pl-4 sm:pr-5 sm:text-[0.8rem]">
        <svg viewBox="0 0 14 16" aria-hidden="true" className="h-3.5 w-3 fill-current sm:h-4 sm:w-3.5">
          <path d="M1 1l12 7-12 7z" strokeLinejoin="round" />
        </svg>
        Watch the episode
      </span>
    </button>
  );
}
