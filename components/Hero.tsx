import { Fragment } from "react";
import { site } from "@/data/site";
import { Button } from "./Button";
import { HeroArt } from "./HeroArt";
import { PlayIcon } from "./icons";

// Two lines on wider screens; on phones each phrase gets its own line.
const lines = [["Business.", "Law."], ["Other things"]];

export function Hero({ trailerHref }: { trailerHref: string }) {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden md:-mt-24">
      <div className="container-page grid items-end md:grid-cols-[minmax(0,1.08fr)_minmax(0,1fr)]">
        <div className="relative z-10 -mt-12 pb-12 md:mt-0 md:pb-14 md:pt-32">
          <h1
            id="hero-title"
            className="grid whitespace-nowrap font-serif text-[clamp(3rem,14vw,5rem)] font-medium leading-[0.92] tracking-[-0.025em] text-text-primary [font-variation-settings:'opsz'_72] [text-shadow:0_2px_28px_var(--color-background-primary)] md:[text-shadow:none] md:text-[clamp(3.5rem,6.6vw,7rem)]"
          >
            {lines.map((phrases, i) => (
              <span
                key={phrases.join(" ")}
                className="anim-rise block"
                style={{ "--delay": `${120 + i * 110}ms` } as React.CSSProperties}
              >
                {phrases.map((phrase, j) => (
                  <Fragment key={phrase}>
                    {j > 0 && " "}
                    <span className="block md:inline">
                      {phrase}
                      {i === lines.length - 1 && <span className="text-brand-lime">.</span>}
                    </span>
                  </Fragment>
                ))}
              </span>
            ))}
          </h1>
          <p
            className="anim-rise mt-6 max-w-[40ch] font-display text-[clamp(1.05rem,1.45vw,1.3rem)] leading-snug md:mt-8"
            style={{ "--delay": "480ms" } as React.CSSProperties}
          >
            {site.description}
          </p>
          <div className="anim-rise mt-8 flex flex-wrap gap-4 md:gap-7" style={{ "--delay": "580ms" } as React.CSSProperties}>
            <Button href={trailerHref}>
              <PlayIcon />
              Watch the trailer
            </Button>
            <Button href="#episodes" variant="outline">
              Explore episodes <span aria-hidden="true">→</span>
            </Button>
          </div>
        </div>

        <HeroArt />
      </div>
    </section>
  );
}
