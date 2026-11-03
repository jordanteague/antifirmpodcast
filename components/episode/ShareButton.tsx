"use client";

import { useState } from "react";

export function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        const url = window.location.href.split("#")[0];
        if (navigator.share) {
          try {
            await navigator.share({ title, url });
          } catch {}
          return;
        }
        await navigator.clipboard?.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="inline-flex items-center gap-2 font-display transition-colors hover:text-olive"
    >
      {copied ? "Link copied" : "Share"} <Arrow />
    </button>
  );
}

export function Arrow({ className = "size-[0.95em]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" aria-hidden="true" className={`fill-none stroke-current stroke-[1.4] ${className}`}>
      <path d="M2 10L10 2M4 2h6v6" />
    </svg>
  );
}
