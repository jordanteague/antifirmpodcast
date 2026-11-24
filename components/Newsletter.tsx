"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/data/site";
import { asset } from "@/lib/assets";
import { Button } from "@/components/Button";

const subscribeUrl = `${site.newsletter.archiveUrl}/subscribe`;

/**
 * beehiiv embed for the Builders, Not Billers email list.
 * beehiiv hides its form for a browser that has already subscribed (it marks the script
 * data-bhv-suppressed), and blockers can stop it loading, so we show a message or a link instead of a gap.
 */
function SignupForm() {
  const ref = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "form" | "subscribed" | "fallback">("loading");
  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    const check = () => {
      if (host.querySelector("iframe")) setStatus("form");
      else if (host.querySelector("script[data-bhv-suppressed]")) setStatus("subscribed");
    };
    const observer = new MutationObserver(check);
    observer.observe(host, { childList: true, subtree: true, attributes: true });
    if (!host.querySelector("script")) {
      const s = document.createElement("script");
      s.async = true;
      s.src = "https://subscribe-forms.beehiiv.com/v3/loader.js";
      s.dataset.beehiivForm = site.newsletter.beehiivFormId;
      s.onerror = () => setStatus("fallback");
      host.appendChild(s);
    }
    check();
    const timer = window.setTimeout(() => setStatus((st) => (st === "loading" ? "fallback" : st)), 6000);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, []);
  return (
    <>
      {/* Matches the 408px form width set in beehiiv, so the iframe has no empty white area beside it. */}
      <div ref={ref} className={status === "loading" || status === "form" ? "min-h-[3.5rem] w-full max-w-[408px]" : "hidden"} />
      {status === "subscribed" && (
        <p className="text-[1.15rem] leading-normal">
          <span className="text-brand-lime">You&rsquo;re on the list.</span> The next issue comes straight to your inbox.
        </p>
      )}
      {status === "fallback" && (
        <Button href={subscribeUrl} target="_blank" rel="noopener">
          Subscribe by email <span aria-hidden="true">→</span>
        </Button>
      )}
    </>
  );
}

export function Newsletter({ archiveLink = false }: { archiveLink?: boolean }) {
  return (
    <section id="newsletter" aria-labelledby="newsletter-title" className="border-b border-rule">
      <div className="container-page grid gap-4 py-14 md:grid-cols-[13rem_minmax(0,1fr)] md:gap-10 md:py-16">
        <h2 id="newsletter-title" className="label text-brand-lime">Newsletter</h2>
        <div>
          <p className="font-display text-[clamp(2.5rem,6vw,4.5rem)] font-black uppercase leading-[0.9] [font-stretch:68%]">
            Builders, <span className="text-brand-lime">not billers.</span>
          </p>
          <p className="mt-6 max-w-[60ch] text-[1.15rem] leading-normal">
            Once a month, the ideas worth keeping from our latest episodes, for founders, business owners and
            investors.
          </p>
          <div className="mt-8">
            <SignupForm />
          </div>
          <p className="mt-4 max-w-[60ch] text-sm text-text-secondary">
            We&rsquo;ll only use your email to send the newsletter. Unsubscribe any time with one click.
          </p>
          {archiveLink && (
            <a href={asset("/newsletter/")} className="label mt-8 inline-flex items-center gap-2.5 text-brand-lime hover:underline">
              Read past issues <span aria-hidden="true">→</span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
