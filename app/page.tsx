import { SiteHeader } from "@/components/SiteHeader";
import { Hero } from "@/components/Hero";
import { FeaturedEpisode } from "@/components/FeaturedEpisode";
import { EpisodeList } from "@/components/EpisodeList";
import { About } from "@/components/About";
import { Subscribe } from "@/components/Subscribe";
import { SiteFooter } from "@/components/SiteFooter";
import { site } from "@/data/site";
import { getEpisodes } from "@/lib/episodes";

export default async function HomePage() {
  const { all, featured, trailer } = await getEpisodes();
  const trailerHref = site.trailerUrl || trailer?.links.youtube || site.links.youtube;

  return (
    <>
      <SiteHeader />
      <main id="main">
        <Hero trailerHref={trailerHref} />
        <section id="episodes" aria-label="Episodes" className="border-y border-rule bg-background-latest">
          <div className="container-page grid gap-10 py-8 lg:grid-cols-[minmax(0,1fr)_21rem] lg:gap-14">
            {featured && <FeaturedEpisode episode={featured} />}
            <EpisodeList episodes={all} />
          </div>
        </section>
        <About />
        <Subscribe />
      </main>
      <SiteFooter />
    </>
  );
}
