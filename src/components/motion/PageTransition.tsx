"use client";

import { useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "@/lib/gsap";

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 9990,
  background: "#0a0a0a",
  clipPath: "inset(100% 0 0 0)",
  pointerEvents: "none",
};

let overlayEl: HTMLDivElement | null = null;

export function PageTransitionOverlay() {
  const ref = useRef<HTMLDivElement>(null);

  // expose to navigate helper
  if (ref.current) overlayEl = ref.current;

  return <div ref={ref} style={overlayStyle} aria-hidden />;
}

export function usePageTransition() {
  const router = useRouter();

  const navigate = useCallback(
    (href: string) => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion || !overlayEl) {
        router.push(href);
        return;
      }

      gsap.to(overlayEl, {
        clipPath: "inset(0% 0 0 0)",
        duration: 0.55,
        ease: "power3.inOut",
        onComplete: () => {
          router.push(href);
          // 遷移後にリセット（非表示状態に戻す）
          gsap.set(overlayEl, { clipPath: "inset(100% 0 0 0)" });
        },
      });
    },
    [router]
  );

  return navigate;
}
