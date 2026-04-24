"use client";

import { useRef } from "react";
import { useGSAP, gsap, ScrollTrigger } from "@/lib/gsap";
import { SplitText } from "@/components/motion/SplitText";

const titles = [
  "Front Engineer",
  "Generative AI Consulting",
  "Fashion Consulting",
];

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReducedMotion) return;

      // スクロールで Y 移動 + opacity 減衰
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          if (!nameRef.current) return;
          gsap.set(nameRef.current, {
            yPercent: self.progress * 30,
            opacity: 1 - self.progress * 1.2,
          });
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-8"
    >
      {/* 背景グラデオーバーレイ */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0a]" />

      <div ref={nameRef} className="relative z-10 text-center">
        {/* 氏名 */}
        <SplitText
          text="丹野 勝太"
          as="h1"
          className="font-[family-name:var(--font-zen-kaku)] text-[clamp(3rem,12vw,10rem)] font-black leading-none tracking-[-0.02em] text-white"
          delay={0.2}
          stagger={0.05}
        />
        <SplitText
          text="Shota Tanno"
          as="p"
          className="mt-2 font-[family-name:var(--font-inter)] text-[clamp(0.9rem,3vw,1.5rem)] font-light tracking-[0.35em] uppercase text-white/40"
          delay={0.5}
          stagger={0.03}
        />

        {/* 肩書 3 並列 */}
        <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2">
          {titles.map((title, i) => (
            <span
              key={title}
              className="font-[family-name:var(--font-inter)] text-[clamp(0.65rem,1.4vw,0.9rem)] font-medium uppercase tracking-[0.25em] text-[#b8a2ff]"
              style={{ animationDelay: `${0.9 + i * 0.15}s` }}
            >
              {title}
            </span>
          ))}
        </div>

        {/* Based in */}
        <p className="mt-6 font-[family-name:var(--font-inter)] text-xs tracking-[0.4em] uppercase text-white/25">
          Based in Fukuoka
        </p>
      </div>

      {/* スクロール促進 */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
        <span className="font-[family-name:var(--font-inter)] text-[10px] tracking-[0.3em] uppercase text-white">
          Scroll
        </span>
        <span className="block h-12 w-px bg-gradient-to-b from-white to-transparent" />
      </div>
    </section>
  );
}
