"use client";

import { usePlayer } from "./PlayerContext";

/**
 * The episode's YouTube player, shown right away so it reads as a video. Until someone jumps to a
 * chapter or transcript line it loads paused at the start; after that it reloads at that moment and plays.
 * youtube-nocookie keeps YouTube from setting cookies until the viewer presses play.
 */
export function VideoEmbed({ id, title }: { id: string; title: string }) {
  const { video, videoRef } = usePlayer();
  const params = new URLSearchParams({
    enablejsapi: "1",
    rel: "0",
    playsinline: "1",
    ...(video ? { autoplay: "1", start: String(video.start) } : {}),
  });

  return (
    <iframe
      ref={videoRef}
      src={`https://www.youtube-nocookie.com/embed/${id}?${params}`}
      title={`${title} (video)`}
      allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
      loading="lazy"
      className="relative block aspect-video h-auto w-full border border-ink-rule bg-ink"
    />
  );
}
