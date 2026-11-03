"use client";

import { useState } from "react";

/** Show notes / Transcript tabs. Both panels are in the HTML (for search engines); only one shows. */
export function EpisodeTabs({ notes, transcript }: { notes: React.ReactNode; transcript: React.ReactNode | null }) {
  const [tab, setTab] = useState<"notes" | "transcript">("notes");
  const tabs = [
    { id: "notes" as const, label: "Show notes" },
    ...(transcript ? [{ id: "transcript" as const, label: "Transcript" }] : []),
  ];
  return (
    <div>
      <div role="tablist" aria-label="Episode details" className="mb-8 flex gap-8 border-b border-ink-rule sm:mb-10 sm:gap-11">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls={`panel-${t.id}`}
            onClick={() => setTab(t.id)}
            className={`label -mb-px border-b-[3px] pb-4 transition-colors ${
              tab === t.id ? "border-ink text-ink" : "border-transparent text-ink-secondary hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" id="panel-notes" aria-labelledby="tab-notes" hidden={tab !== "notes"}>
        {notes}
      </div>
      {transcript && (
        <div role="tabpanel" id="panel-transcript" aria-labelledby="tab-transcript" hidden={tab !== "transcript"}>
          {transcript}
        </div>
      )}
    </div>
  );
}
