"use client";

import { formatClock } from "@/lib/time";
import { usePlayer } from "./PlayerContext";

export function EpisodePlayer({ label }: { label: string }) {
  const { playing, current, duration, rate, toggle, seek, cycleRate } = usePlayer();
  const pct = duration ? Math.min(100, (current / duration) * 100) : 0;

  return (
    <section aria-label="Episode player" className="flex items-center gap-4 bg-ink px-4 py-5 text-text-primary sm:gap-8 sm:px-10 sm:py-9">
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause" : "Play episode"}
        className="grid size-14 shrink-0 place-items-center bg-brand-lime text-ink transition-colors hover:bg-text-primary sm:size-[5.5rem]"
      >
        {playing ? (
          <svg viewBox="0 0 14 16" aria-hidden="true" className="h-5 w-4 fill-current sm:h-6 sm:w-5">
            <path d="M0 0h4.5v16H0zM9.5 0H14v16H9.5z" />
          </svg>
        ) : (
          <svg viewBox="0 0 14 16" aria-hidden="true" className="ml-1 h-5 w-4 fill-none stroke-current stroke-[1.6] sm:h-6 sm:w-5">
            <path d="M1 1l12 7-12 7z" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      <div className="min-w-0 flex-1">
        <div className="mb-3 flex items-baseline justify-between gap-4 sm:mb-4">
          <p className="label text-[0.7rem] sm:text-[0.8125rem]">Listen to the episode</p>
          <p className="label hidden text-[0.8125rem] sm:block">{label}</p>
        </div>
        <input
          type="range"
          min={0}
          max={Math.max(1, Math.floor(duration))}
          step={1}
          value={Math.floor(current)}
          onChange={(e) => seek(Number(e.target.value), playing)}
          aria-label="Seek"
          aria-valuetext={`${formatClock(current)} of ${formatClock(duration)}`}
          className="episode-range block w-full"
          style={{ "--pct": `${pct}%` } as React.CSSProperties}
        />
        <div className="mt-2 flex justify-between font-display text-[0.8rem] tabular-nums text-text-primary/70 sm:mt-3">
          <span>{formatClock(current)}</span>
          <span>{formatClock(duration)}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={cycleRate}
        aria-label={`Playback speed ${rate}×`}
        className="hidden size-12 shrink-0 place-items-center border border-text-primary/50 font-display text-sm transition-colors hover:border-brand-lime hover:text-brand-lime sm:grid sm:size-14"
      >
        {rate}×
      </button>
    </section>
  );
}

/** A timestamp that jumps the player there. Used by chapters and the transcript. */
export function SeekLink({ start, className = "", children }: { start: number; className?: string; children: React.ReactNode }) {
  const { seek } = usePlayer();
  return (
    <a
      href={`#t=${Math.floor(start)}`}
      onClick={(e) => {
        e.preventDefault();
        seek(start);
      }}
      className={className}
    >
      {children}
    </a>
  );
}
