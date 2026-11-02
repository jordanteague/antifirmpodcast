"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import ladyJustice from "@/public/images/lady-justice.jpg";

/** Lady Justice. The statue drifts slightly with the pointer. */
export function HeroArt() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || still) return;

    let frame = 0;
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };

    const tick = () => {
      current.x += (target.x - current.x) * 0.06;
      current.y += (target.y - current.y) * 0.06;
      el.style.setProperty("--px", current.x.toFixed(4));
      el.style.setProperty("--py", current.y.toFixed(4));
      if (Math.abs(target.x - current.x) + Math.abs(target.y - current.y) > 0.0005) {
        frame = requestAnimationFrame(tick);
      } else {
        frame = 0;
      }
    };
    const onMove = (e: PointerEvent) => {
      target.x = e.clientX / window.innerWidth - 0.5;
      target.y = e.clientY / window.innerHeight - 0.5;
      if (!frame) frame = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="relative -mx-4 -order-1 self-stretch md:order-none md:mx-0 md:-ml-[12%] md:flex md:items-end"
    >
      <div
        className="anim-fade relative ml-auto mix-blend-lighten w-[82%] md:w-full [transform:translate3d(calc(var(--px,0)*-14px),calc(var(--py,0)*-10px),0)] will-change-transform"
        style={{ "--delay": "100ms" } as React.CSSProperties}
      >
        {/* Placeholder artwork cut from the mockup. Swap public/images/lady-justice.jpg for the hi-res file. */}
        <Image
          src={ladyJustice}
          alt="Blindfolded statue of Lady Justice"
          priority
          sizes="(min-width: 768px) 50vw, 82vw"
          className="h-auto w-full [mask-composite:intersect] [mask-image:linear-gradient(to_right,transparent,#000_16%,#000_84%,transparent),linear-gradient(to_bottom,transparent,#000_14%,#000_88%,transparent)] md:[mask-image:linear-gradient(to_right,transparent,#000_16%,#000_84%,transparent),linear-gradient(to_bottom,transparent,#000_14%)]"
        />
      </div>

    </div>
  );
}
