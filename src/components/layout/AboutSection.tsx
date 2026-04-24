"use client";

import { Reveal } from "@/components/motion/Reveal";

export function AboutSection() {
  return (
    <section
      id="about"
      className="relative mx-auto max-w-5xl px-8 py-32"
    >
      <Reveal>
        <p className="font-[family-name:var(--font-inter)] text-xs tracking-[0.4em] uppercase text-[#b8a2ff]">
          About
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        <h2 className="mt-6 font-[family-name:var(--font-zen-kaku)] text-[clamp(2rem,6vw,4.5rem)] font-black leading-tight text-white">
          デザインとコードで、
          <br />
          世界をなめらかに。
        </h2>
      </Reveal>

      <Reveal delay={0.2}>
        <p className="mt-8 max-w-2xl font-[family-name:var(--font-noto-sans-jp)] text-base leading-relaxed text-white/60">
          福岡を拠点に、フロントエンドエンジニアリング・生成 AI コンサルティング・ファッションコンサルティングの3領域で活動。
          「動く」体験の細部にこだわり、触れた人が思わず前のめりになるインターフェースをつくります。
        </p>
      </Reveal>
    </section>
  );
}
