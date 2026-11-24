import type { Metadata } from "next";
import Image from "next/image";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Newsletter } from "@/components/Newsletter";
import { asset } from "@/lib/assets";
import { issueDate, issueLabel, liveIssues } from "@/data/newsletter";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: `Builders, Not Billers · Newsletter · ${site.name}`,
  description:
    "Once a month, the ideas worth keeping from the latest ANTIFIRM episodes, for founders, business owners and investors.",
};

export default function NewsletterPage() {
  const list = liveIssues();
  return (
    <>
      <SiteHeader />
      <main id="main">
        <Newsletter />
        <section aria-labelledby="issues-title" className="border-b border-rule">
          <div className="container-page grid gap-4 py-14 md:grid-cols-[13rem_minmax(0,1fr)] md:gap-10 md:py-16">
            <h2 id="issues-title" className="label text-brand-lime">Issues</h2>
            {list.length === 0 ? (
              <p className="max-w-[60ch] text-[1.15rem] leading-normal text-text-secondary">
                The first issue comes out December 1. Sign up above to get it by email.
              </p>
            ) : (
              <ul className="grid gap-12">
                {list.map((issue) => (
                  <li key={issue.slug}>
                    <a href={asset(`/newsletter/${issue.slug}/`)} className="group grid gap-6 sm:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] sm:items-center sm:gap-10">
                      <Image
                        src={asset(issue.cover)}
                        alt=""
                        width={1920}
                        height={1080}
                        sizes="(min-width: 640px) 22rem, 90vw"
                        className="aspect-video h-auto w-full border border-rule object-cover"
                      />
                      <div>
                        <p className="label text-text-secondary">
                          {issueLabel(issue)} · {issueDate(issue)}
                        </p>
                        <h3 className="mt-3 font-display text-[clamp(1.75rem,3.5vw,2.6rem)] font-black uppercase leading-[0.95] [font-stretch:75%] group-hover:text-brand-lime">
                          {issue.title}
                        </h3>
                        <p className="mt-3 max-w-[52ch] text-text-secondary">{issue.dek}</p>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
