"use client";

import { useRef } from "react";
import { useGSAP, gsap } from "@/lib/gsap";

interface MarqueeProps {
  text: string;
  speed?: number;
  className?: string;
}

export function Marquee({ text, speed = 40, className }: MarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReducedMotion) return;

      const track = trackRef.current!;
      const totalWidth = track.scrollWidth / 2;
      gsap.to(track, {
        x: -totalWidth,
        duration: totalWidth / speed,
        ease: "none",
        repeat: -1,
      });
    },
    { scope: trackRef }
  );

  const repeated = Array(6).fill(text);

  return (
    <div className={`overflow-hidden ${className ?? ""}`}>
      <div ref={trackRef} className="flex whitespace-nowrap">
        {[...repeated, ...repeated].map((t, i) => (
          <span
            key={i}
            className="mx-8 font-[family-name:var(--font-zen-kaku)] text-[clamp(2rem,6vw,5rem)] font-black text-white/10"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
