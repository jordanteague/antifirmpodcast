import { site } from "@/data/site";

export function SiteFooter() {
  return (
    <footer className="container-page flex flex-wrap justify-between gap-3 py-8 text-text-secondary">
      <p className="label text-[0.7rem]">
        © {new Date().getFullYear()} {site.name} Podcast · Produced by{" "}
        <a href="https://campbellteague.com" target="_blank" rel="noopener" className="underline underline-offset-4 transition-colors hover:text-brand-lime">
          Campbell Teague
        </a>
      </p>
      <p className="label text-[0.7rem]">Nothing on this show is legal advice. Obviously.</p>
    </footer>
  );
}
