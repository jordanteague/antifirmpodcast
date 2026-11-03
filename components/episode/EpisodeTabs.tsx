"use client";

import { useRef, useState, type ReactNode, type KeyboardEvent } from "react";

const tabs = [
  { id: "notes", label: "Show notes" },
  { id: "transcript", label: "Transcript" },
] as const;

type TabId = (typeof tabs)[number]["id"];

/** Show notes and transcript as accessible tabs (arrow keys move between them). */
export function EpisodeTabs({ notes, transcript }: { notes: ReactNode; transcript: ReactNode }) {
  const [active, setActive] = useState<TabId>("notes");
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  const onKey = (e: KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const i = tabs.findIndex((t) => t.id === active);
    const next = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length].id;
    setActive(next);
    refs.current[next]?.focus();
  };

  return (
    <div className="min-w-0">
      <div role="tablist" aria-label="Episode details" className="flex gap-10 border-b border-rule-ink" onKeyDown={onKey}>
        {tabs.map((t) => {
          const selected = active === t.id;
          return (
            <button
              key={t.id}
              ref={(el) => {
                refs.current[t.id] = el;
              }}
              type="button"
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={selected}
              aria-controls={`panel-${t.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(t.id)}
              className={`label -mb-px border-b-[3px] pb-5 text-[0.9rem] transition-colors ${
                selected ? "border-background-primary text-background-primary" : "border-transparent text-ink-secondary hover:text-background-primary"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>
      <div role="tabpanel" id="panel-notes" aria-labelledby="tab-notes" hidden={active !== "notes"} className="pt-10">
        {notes}
      </div>
      <div role="tabpanel" id="panel-transcript" aria-labelledby="tab-transcript" hidden={active !== "transcript"} className="pt-10">
        {transcript}
      </div>
    </div>
  );
}
