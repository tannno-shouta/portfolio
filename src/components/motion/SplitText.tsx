"use client";

import { useRef, useEffect } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: keyof React.JSX.IntrinsicElements;
}

function segmentText(text: string): string[] {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const seg = new Intl.Segmenter("ja", { granularity: "grapheme" });
    return Array.from(seg.segment(text), (s) => s.segment);
  }
  return Array.from(text);
}

export function SplitText({
  text,
  className,
  delay = 0,
  stagger = 0.04,
  as: Tag = "span",
}: SplitTextProps) {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const chars = containerRef.current?.querySelectorAll("[data-char]");
      if (!chars) return;
      gsap.fromTo(
        chars,
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          stagger,
          delay,
          duration: 0.8,
          ease: "power3.out",
        }
      );
    },
    { scope: containerRef }
  );

  const chars = segmentText(text);

  return (
    // @ts-expect-error dynamic tag
    <Tag ref={containerRef} className={className} aria-label={text}>
      <span className="inline-block overflow-hidden">
        {chars.map((char, i) => (
          <span
            key={i}
            data-char
            className="inline-block will-change-transform"
            style={{ whiteSpace: char === " " ? "pre" : undefined }}
          >
            {char}
          </span>
        ))}
      </span>
    </Tag>
  );
}
