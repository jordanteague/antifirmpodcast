"use client";

import { useEffect, useRef, useState } from "react";
import { PlayIcon } from "../icons";

/** Other parts of the page (chapters, transcript) ask the player to jump with this event. */
export const SEEK_EVENT = "antifirm:seek";
export const TIME_EVENT = "antifirm:time";

const speeds = [1, 1.25, 1.5, 2];

function clock(seconds: number) {
  const s = Math.max(0, Math.floor(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = String(s % 60).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${ss}` : `${String(m).padStart(2, "0")}:${ss}`;
}

export function AudioPlayer({ src, duration: initialDuration, label, title }: {
  src: string;
  duration: number | null;
  label: string;
  title: string;
}) {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(initialDuration ?? 0);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    const onSeek = (e: Event) => {
      const el = audio.current;
      const to = (e as CustomEvent<number>).detail;
      if (!el || !Number.isFinite(to)) return;
      el.currentTime = to;
      setTime(to);
      void el.play();
    };
    window.addEventListener(SEEK_EVENT, onSeek);
    return () => window.removeEventListener(SEEK_EVENT, onSeek);
  }, []);

  const toggle = () => {
    const el = audio.current;
    if (!el) return;
    if (el.paused) void el.play();
    else el.pause();
  };

  const cycleSpeed = () => {
    const next = speeds[(speeds.indexOf(speed) + 1) % speeds.length];
    setSpeed(next);
    if (audio.current) audio.current.playbackRate = next;
  };

  const progress = duration ? Math.min(100, (time / duration) * 100) : 0;

  return (
    <section aria-label="Episode player" className="bg-background-primary px-5 py-6 text-text-primary sm:px-8 sm:py-8 md:px-11">
      <audio
        ref={audio}
        src={src}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onLoadedMetadata={(e) => Number.isFinite(e.currentTarget.duration) && setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => {
          const t = e.currentTarget.currentTime;
          setTime(t);
          window.dispatchEvent(new CustomEvent(TIME_EVENT, { detail: t }));
        }}
      />
      <div className="flex items-center gap-5 sm:gap-9">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? `Pause ${title}` : `Play ${title}`}
          className="grid size-16 shrink-0 place-items-center bg-brand-lime text-background-primary transition-colors hover:bg-text-primary sm:size-[5.5rem]"
        >
          {playing ? (
            <svg viewBox="0 0 24 24" aria-hidden="true" className="size-6 fill-current sm:size-7">
              <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
            </svg>
          ) : (
            <PlayIcon className="ml-1 h-6 w-5 sm:h-7 sm:w-6" />
          )}
        </button>

        <div className="min-w-0 flex-1">
          <div className="label mb-2 flex justify-between gap-4 text-[0.75rem] sm:text-[0.85rem]">
            <span>Listen to the episode</span>
            <span className="hidden sm:inline">{label}</span>
          </div>
          <input
            type="range"
            className="scrubber"
            min={0}
            max={duration || 0}
            step={1}
            value={Math.min(time, duration || 0)}
            style={{ "--progress": `${progress}%` } as React.CSSProperties}
            aria-label="Seek"
            aria-valuetext={`${clock(time)} of ${clock(duration)}`}
            onChange={(e) => {
              const t = Number(e.target.value);
              if (audio.current) audio.current.currentTime = t;
              setTime(t);
            }}
          />
          <div className="mt-1.5 flex justify-between font-display text-sm tabular-nums text-text-secondary">
            <span>{clock(time)}</span>
            <span>{clock(duration)}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={cycleSpeed}
          aria-label={`Playback speed ${speed}×. Change speed`}
          className="hidden size-14 shrink-0 place-items-center border border-text-secondary font-display text-sm tabular-nums transition-colors hover:border-brand-lime hover:text-brand-lime sm:grid"
        >
          {speed}×
        </button>
      </div>
    </section>
  );
}
