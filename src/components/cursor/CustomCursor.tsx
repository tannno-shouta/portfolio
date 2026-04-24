"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isPointerFine = window.matchMedia("(pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!isPointerFine || prefersReducedMotion) return;

    const dot = dotRef.current!;
    const ring = ringRef.current!;

    dot.style.opacity = "1";
    ring.style.opacity = "1";

    const xDot = gsap.quickTo(dot, "x", { duration: 0.15, ease: "power3.out" });
    const yDot = gsap.quickTo(dot, "y", { duration: 0.15, ease: "power3.out" });
    const xRing = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3.out" });
    const yRing = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      xDot(e.clientX);
      yDot(e.clientY);
      xRing(e.clientX);
      yRing(e.clientY);
    };

    const onEnterLink = () => {
      gsap.to(ring, { scale: 2, duration: 0.3 });
    };
    const onLeaveLink = () => {
      gsap.to(ring, { scale: 1, duration: 0.3 });
    };

    window.addEventListener("mousemove", onMove);

    const links = document.querySelectorAll("a, button, [data-cursor='link']");
    links.forEach((el) => {
      el.addEventListener("mouseenter", onEnterLink);
      el.addEventListener("mouseleave", onLeaveLink);
    });

    return () => {
      window.removeEventListener("mousemove", onMove);
      links.forEach((el) => {
        el.removeEventListener("mouseenter", onEnterLink);
        el.removeEventListener("mouseleave", onLeaveLink);
      });
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[--color-accent] opacity-0"
        aria-hidden
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[9998] size-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[--color-accent] opacity-0"
        aria-hidden
      />
    </>
  );
}
