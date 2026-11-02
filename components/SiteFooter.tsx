import { site } from "@/data/site";

export function SiteFooter() {
  return (
    <footer className="container-page flex flex-wrap justify-between gap-3 py-8 text-text-secondary">
      <p className="label text-[0.7rem]">© {new Date().getFullYear()} {site.name} Podcast</p>
      <p className="label text-[0.7rem]">Nothing on this show is legal advice. Obviously.</p>
    </footer>
  );
}
