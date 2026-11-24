import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Newsletter } from "@/components/Newsletter";
import { asset } from "@/lib/assets";
import { issueDate, issueLabel, liveIssues } from "@/data/newsletter";
import { site } from "@/data/site";

export const dynamicParams = false;

export function generateStaticParams() {
  const list = liveIssues();
  // Static export needs at least one path; a placeholder 404s until the first issue is live.
  return list.length ? list.map((i) => ({ slug: i.slug })) : [{ slug: "coming-soon" }];
}

type Props = { params: Promise<{ slug: string }> };

const find = async (params: Props["params"]) => {
  const slug = (await params).slug;
  return liveIssues().find((i) => i.slug === slug);
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const issue = await find(params);
  if (!issue) return {};
  const title = `${issue.title} · Builders, Not Billers · ${site.name}`;
  return {
    title,
    description: issue.dek,
    openGraph: { title, description: issue.dek, type: "article", images: [issue.cover] },
  };
}

/** Article typography for the hand-written issue HTML. */
const prose = [
  "max-w-[64ch] text-[1.15rem] leading-relaxed sm:text-[1.25rem]",
  "[&_p]:mt-5",
  "[&_h2]:mt-14 [&_h2]:font-display [&_h2]:text-[clamp(1.75rem,4vw,2.5rem)] [&_h2]:font-black [&_h2]:uppercase [&_h2]:leading-[0.95] [&_h2]:[font-stretch:75%]",
  "[&_h3]:mt-10 [&_h3]:font-display [&_h3]:text-[1.3rem] [&_h3]:font-bold [&_h3]:leading-snug sm:[&_h3]:text-[1.45rem]",
  "[&_h2+p]:mt-4 [&_h3+p]:mt-3",
  "[&_a]:underline [&_a]:decoration-olive [&_a]:decoration-2 [&_a]:underline-offset-4 hover:[&_a]:text-olive",
  "[&_blockquote]:my-12 [&_blockquote]:border-l-[6px] [&_blockquote]:border-brand-lime [&_blockquote]:pl-6 [&_blockquote]:font-display [&_blockquote]:text-[1.4rem] [&_blockquote]:font-semibold [&_blockquote]:leading-snug sm:[&_blockquote]:text-[1.65rem]",
  "[&_cite]:mt-3 [&_cite]:block [&_cite]:text-[1rem] [&_cite]:font-normal [&_cite]:not-italic [&_cite]:text-ink-secondary",
].join(" ");

export default async function IssuePage({ params }: Props) {
  const issue = await find(params);
  if (!issue) notFound();

  return (
    <>
      <SiteHeader />
      <main id="main">
        <article className="bg-paper text-ink">
          <div className="container-page pb-16 pt-8 sm:pb-24 sm:pt-12">
            <a href={asset("/newsletter/")} className="label inline-flex items-center gap-2.5 hover:text-olive">
              <span aria-hidden="true">←</span> All issues
            </a>
            <div className="mx-auto mt-10 max-w-[64ch] sm:mt-14">
              <p className="label flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.75rem] sm:text-[0.8125rem]">
                <span>Builders, Not Billers</span>
                <span aria-hidden="true" className="size-2 rounded-full bg-olive" />
                <span>{issueLabel(issue)}</span>
                <span>{issueDate(issue)}</span>
              </p>
              <h1 className="mt-5 text-balance text-[clamp(2.3rem,6vw,4rem)] leading-[1.04] tracking-[-0.02em] sm:mt-7">
                {issue.title}
              </h1>
              <p className="mt-6 font-display text-[1.2rem] leading-relaxed text-ink-secondary sm:text-[1.35rem]">
                {issue.dek}
              </p>
              <p className="mt-6 font-display text-[1rem]">
                By <strong className="font-semibold">Jordan Teague</strong> &amp;{" "}
                <strong className="font-semibold">George Campbell</strong>
              </p>
            </div>
            <div className="relative mx-auto mt-10 max-w-4xl sm:mt-14">
              <div aria-hidden="true" className="absolute inset-0 translate-x-3 translate-y-3 bg-ink sm:translate-x-4 sm:translate-y-4" />
              <Image
                src={asset(issue.cover)}
                alt={issue.coverAlt}
                width={1920}
                height={1080}
                priority
                sizes="(min-width: 896px) 56rem, 92vw"
                className="relative aspect-video h-auto w-full border border-ink-rule object-cover"
              />
            </div>
            <div className={`mx-auto mt-12 sm:mt-16 ${prose}`} dangerouslySetInnerHTML={{ __html: issue.html }} />
            <p className="mx-auto mt-14 max-w-[64ch] border-t border-ink-rule pt-6 text-[1rem] leading-relaxed text-ink-secondary">
              Builders, Not Billers is the written companion to ANTIFIRM, the podcast Jordan Teague and George Campbell
              host about business, law and other things that sound boring until they&rsquo;re your problem. New issue every
              month. Nothing here is legal advice for your situation.
            </p>
          </div>
        </article>
        <Newsletter />
      </main>
      <SiteFooter />
    </>
  );
}
