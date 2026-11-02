import { site } from "@/data/site";
import { PlatformIcon } from "./icons";

export function Subscribe() {
  return (
    <section id="subscribe" aria-labelledby="subscribe-title" className="border-b border-rule">
      <div className="container-page grid gap-4 py-14 md:grid-cols-[13rem_minmax(0,1fr)] md:gap-10 md:py-16">
        <h2 id="subscribe-title" className="label text-brand-lime">Subscribe</h2>
        <div>
          <p className="font-display text-[clamp(2.5rem,6vw,4.5rem)] font-black uppercase leading-[0.9] [font-stretch:68%]">
            Listen wherever <span className="text-brand-lime">you listen.</span>
          </p>
          <ul className="mt-8 flex flex-wrap gap-3">
            {site.subscribe.map((s) => (
              <li key={s.id}>
                <a
                  href={s.href}
                  className="label inline-flex items-center gap-3 border border-rule px-5 py-3.5 transition-colors hover:border-brand-blue hover:text-brand-blue"
                >
                  <PlatformIcon id={s.id} className="size-5" />
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
