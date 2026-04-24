"use client";

import { useRef } from "react";
import { useGSAP, gsap, ScrollTrigger } from "@/lib/gsap";

export function Footer() {
  const textRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReducedMotion) return;

      gsap.fromTo(
        textRef.current,
        { yPercent: 30 },
        {
          yPercent: 0,
          ease: "none",
          scrollTrigger: {
            trigger: textRef.current,
            start: "top bottom",
            end: "bottom bottom",
            scrub: true,
          },
        }
      );
    },
    { scope: textRef }
  );

  return (
    <footer className="relative overflow-hidden border-t border-white/5 pb-8 pt-20">
      <div ref={textRef} className="overflow-hidden">
        <p className="select-none font-[family-name:var(--font-zen-kaku)] text-[clamp(3rem,15vw,14rem)] font-black leading-none text-white/5">
          Shota Tanno
        </p>
      </div>
      <div className="mx-auto mt-10 flex max-w-5xl items-center justify-between px-8">
        <p className="font-[family-name:var(--font-inter)] text-xs text-white/20">
          © {new Date().getFullYear()} 丹野 勝太
        </p>
        <div className="flex gap-6">
          <a
            href="https://www.instagram.com/yuuki69783/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-[family-name:var(--font-inter)] text-xs text-white/30 transition-colors hover:text-white"
            data-cursor="link"
          >
            Instagram
          </a>
          <a
            href="mailto:pannya6978@gmail.com"
            className="font-[family-name:var(--font-inter)] text-xs text-white/30 transition-colors hover:text-white"
            data-cursor="link"
          >
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
