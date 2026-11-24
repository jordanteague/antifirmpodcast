"use client";

import { useEffect, useRef } from "react";
import { site } from "@/data/site";
import { asset } from "@/lib/assets";

/** beehiiv embed for the Builders, Not Billers email list. */
function SignupForm() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const host = ref.current;
    if (!host || host.querySelector("script")) return;
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://subscribe-forms.beehiiv.com/v3/loader.js";
    s.dataset.beehiivForm = site.newsletter.beehiivFormId;
    host.appendChild(s);
  }, []);
  return <div ref={ref} className="min-h-[3.5rem] max-w-xl" />;
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
            We&rsquo;ll only use your email to send the newsletter. Unsubscribe any time with one click. Nothing
            here is legal advice for your situation.
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
