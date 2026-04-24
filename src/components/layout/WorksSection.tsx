"use client";

import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { works } from "@/data/works";

export function WorksSection() {
  return (
    <section id="works" className="relative px-8 py-24">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <p className="font-[family-name:var(--font-inter)] text-xs tracking-[0.4em] uppercase text-[#b8a2ff]">
            Works
          </p>
          <h2 className="mt-4 font-[family-name:var(--font-zen-kaku)] text-[clamp(1.8rem,5vw,3.5rem)] font-black text-white">
            制作実績
          </h2>
        </Reveal>

        <ul className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2">
          {works.map((work, i) => (
            <Reveal key={work.slug} delay={i * 0.1}>
              <li>
                <Link
                  href={`/works/${work.slug}`}
                  className="group block"
                  data-cursor="link"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-white/5">
                    <Image
                      src={work.cover}
                      alt={work.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.opacity =
                          "0";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  </div>
                  <div className="mt-4 flex items-start justify-between">
                    <div>
                      <p className="font-[family-name:var(--font-noto-sans-jp)] text-lg font-medium text-white">
                        {work.title}
                      </p>
                      <p className="mt-1 font-[family-name:var(--font-inter)] text-xs text-white/40">
                        {work.category} — {work.year}
                      </p>
                    </div>
                    <span className="mt-1 font-[family-name:var(--font-inter)] text-sm text-white/25 transition-colors group-hover:text-[#b8a2ff]">
                      →
                    </span>
                  </div>
                </Link>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
