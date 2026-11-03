"use client";

import { useState } from "react";

/** Native share sheet where there is one (phones), otherwise copy the link. */
export function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Share sheet dismissed, or clipboard blocked: nothing to do.
    }
  };

  return (
    <button type="button" onClick={share} className="group inline-flex items-center gap-2 font-display text-[1.05rem] transition-colors hover:text-ink-secondary">
      <span aria-live="polite">{copied ? "Link copied" : "Share"}</span>
      <Arrow />
    </button>
  );
}

export function Arrow({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={`${className} shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5`}>
      <path d="M4 12 12 4M5.5 4H12v6.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
