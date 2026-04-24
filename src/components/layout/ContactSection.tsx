"use client";

import { Reveal } from "@/components/motion/Reveal";
import { Marquee } from "@/components/motion/Marquee";

export function ContactSection() {
  return (
    <section id="contact" className="relative overflow-hidden py-32">
      <Marquee text="Let's Work Together —" className="mb-16" />

      <div className="mx-auto max-w-5xl px-8">
        <Reveal>
          <p className="font-[family-name:var(--font-inter)] text-xs tracking-[0.4em] uppercase text-[#b8a2ff]">
            Contact
          </p>
          <h2 className="mt-4 font-[family-name:var(--font-zen-kaku)] text-[clamp(2rem,6vw,4rem)] font-black text-white">
            お仕事のご相談はこちら
          </h2>
        </Reveal>

        <Reveal delay={0.15}>
          <p className="mt-6 max-w-xl font-[family-name:var(--font-noto-sans-jp)] text-base leading-relaxed text-white/60">
            フロントエンド開発・生成 AI 活用・ファッションブランディングなど、
            お気軽にご連絡ください。
          </p>
        </Reveal>

        <Reveal delay={0.25}>
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="mailto:pannya6978@gmail.com"
              className="inline-flex items-center gap-2 rounded-full bg-[#b8a2ff] px-8 py-4 font-[family-name:var(--font-inter)] text-sm font-medium text-black transition-opacity hover:opacity-80"
              data-cursor="link"
            >
              メールで連絡する →
            </a>
            <a
              href="https://www.instagram.com/yuuki69783/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-8 py-4 font-[family-name:var(--font-inter)] text-sm text-white transition-colors hover:border-[#b8a2ff]/60 hover:text-[#b8a2ff]"
              data-cursor="link"
            >
              Instagram DM →
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
