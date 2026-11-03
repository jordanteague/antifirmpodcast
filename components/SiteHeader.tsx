"use client";

import { useEffect, useState } from "react";
import { site } from "@/data/site";
import Image from "next/image";
import logo from "@/public/images/logo.png";
import { PlatformIcon } from "./icons";
import { asset } from "@/lib/assets";

// Links point at the home page so they also work from episode pages.
const nav = [
  { href: asset("/#episodes"), label: "Episodes" },
  { href: asset("/#about"), label: "About" },
  { href: asset("/#hosts"), label: "Hosts" },
  { href: asset("/#subscribe"), label: "Subscribe" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // Solid, blurred bar once the hero starts scrolling away.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled || open ? "border-b border-rule bg-background-primary/85 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <div className="container-page flex items-center gap-8 py-5 lg:gap-14 lg:py-6">
        <a href={asset("/")} className="shrink-0" aria-label={`${site.name} podcast home`}>
          {/* Placeholder logo cut from the mockup. Swap public/images/logo.png for the hi-res file. */}
          <Image src={logo} alt="" priority className="h-auto w-28 lg:w-[8.5rem]" />
        </a>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex gap-8 lg:gap-11">
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="label transition-colors hover:text-brand-lime">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <ul className="ml-auto hidden items-center gap-5 sm:flex md:hidden lg:flex" aria-label={`Follow ${site.name}`}>
          {site.social.map((s) => (
            <li key={s.id}>
              <a href={s.href} aria-label={s.label} className="block transition-colors hover:text-brand-lime">
                <PlatformIcon id={s.id} className="size-[1.3rem]" />
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="label ml-auto flex items-center gap-3 sm:ml-6 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
          <span aria-hidden="true" className="relative block h-3 w-5">
            <span className={`absolute left-0 h-0.5 w-5 bg-brand-lime transition-transform duration-300 ${open ? "top-[5px] rotate-45" : "top-0"}`} />
            <span className={`absolute left-0 h-0.5 w-5 bg-brand-lime transition-transform duration-300 ${open ? "top-[5px] -rotate-45" : "top-2.5"}`} />
          </span>
        </button>
      </div>

      <div id="mobile-menu" hidden={!open} className="container-page pb-8 md:hidden">
        <ul className="grid gap-1 border-t border-rule pt-4">
          {nav.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={() => setOpen(false)}
                className="block py-2 font-display text-4xl font-black uppercase [font-stretch:68%] hover:text-brand-lime"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <ul className="mt-6 flex gap-6 sm:hidden" aria-label={`Follow ${site.name}`}>
          {site.social.map((s) => (
            <li key={s.id}>
              <a href={s.href} aria-label={s.label} className="block hover:text-brand-lime">
                <PlatformIcon id={s.id} className="size-6" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
