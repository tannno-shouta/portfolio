"use client";

import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { nowPlaying, currentlyReading } from "@/data/now";

export function NowSection() {
  return (
    <section id="now" className="relative px-8 py-24">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <p className="font-[family-name:var(--font-inter)] text-xs tracking-[0.4em] uppercase text-[#b8a2ff]">
            Now
          </p>
          <h2 className="mt-4 font-[family-name:var(--font-zen-kaku)] text-[clamp(1.8rem,5vw,3.5rem)] font-black text-white">
            今、わたしは
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Now Playing */}
          <Reveal delay={0.1}>
            <div className="group flex gap-5 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-colors hover:border-[#b8a2ff]/40">
              <div className="relative size-20 shrink-0 overflow-hidden rounded-xl">
                <Image
                  src={nowPlaying.cover}
                  alt={nowPlaying.title}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-[#1a1a2e] text-3xl">
                  🎧
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <span className="font-[family-name:var(--font-inter)] text-[10px] tracking-[0.3em] uppercase text-[#b8a2ff]">
                  Now Playing
                </span>
                <p className="mt-1 font-[family-name:var(--font-noto-sans-jp)] text-base font-medium text-white">
                  {nowPlaying.title}
                </p>
                <p className="font-[family-name:var(--font-noto-sans-jp)] text-sm text-white/50">
                  {nowPlaying.artist}
                </p>
              </div>
            </div>
          </Reveal>

          {/* Currently Reading */}
          <Reveal delay={0.2}>
            <div className="group flex gap-5 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-colors hover:border-[#b8a2ff]/40">
              <div className="relative size-20 shrink-0 overflow-hidden rounded-xl">
                <Image
                  src={currentlyReading.cover}
                  alt={currentlyReading.title}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-[#1a1a2e] text-3xl">
                  📖
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <span className="font-[family-name:var(--font-inter)] text-[10px] tracking-[0.3em] uppercase text-[#b8a2ff]">
                  Currently Reading
                </span>
                <p className="mt-1 font-[family-name:var(--font-noto-sans-jp)] text-base font-medium text-white">
                  {currentlyReading.title}
                </p>
                <p className="font-[family-name:var(--font-noto-sans-jp)] text-sm text-white/50">
                  {currentlyReading.author}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
