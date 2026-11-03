"use client";

import type { ReactNode } from "react";
import { SEEK_EVENT } from "./AudioPlayer";

/** Jumps the page's player to `to` seconds and starts playback. */
export function SeekButton({ to, className = "", label, children }: {
  to: number;
  className?: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className={className}
      onClick={() => {
        window.dispatchEvent(new CustomEvent(SEEK_EVENT, { detail: to }));
        document.getElementById("player")?.scrollIntoView({ behavior: "smooth", block: "center" });
      }}
    >
      {children}
    </button>
  );
}
