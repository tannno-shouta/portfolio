import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { works } from "@/data/works";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return works.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const work = works.find((w) => w.slug === slug);
  if (!work) return {};
  return { title: `${work.title} — 丹野 勝太` };
}

export default async function WorkPage({ params }: Props) {
  const { slug } = await params;
  const work = works.find((w) => w.slug === slug);
  if (!work) notFound();

  return (
    <main className="min-h-screen px-8 pb-32 pt-32">
      <div className="mx-auto max-w-4xl">
        {/* 戻るリンク */}
        <Link
          href="/#works"
          className="font-[family-name:var(--font-inter)] text-xs tracking-[0.3em] uppercase text-white/40 transition-colors hover:text-[#b8a2ff]"
          data-cursor="link"
        >
          ← 制作実績一覧
        </Link>

        {/* ヘッダー情報 */}
        <div className="mt-10">
          <p className="font-[family-name:var(--font-inter)] text-xs tracking-[0.4em] uppercase text-[#b8a2ff]">
            {work.category} — {work.year}
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-zen-kaku)] text-[clamp(2rem,6vw,4rem)] font-black leading-tight text-white">
            {work.title}
          </h1>
        </div>

        {/* カバー画像 */}
        <div className="relative mt-10 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-white/5">
          <Image
            src={work.cover}
            alt={work.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* 説明 */}
        <p className="mt-10 max-w-2xl font-[family-name:var(--font-noto-sans-jp)] text-base leading-relaxed text-white/70">
          {work.description}
        </p>

        {/* タグ */}
        <div className="mt-6 flex flex-wrap gap-2">
          {work.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 px-4 py-1 font-[family-name:var(--font-inter)] text-xs text-white/50"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* 外部リンク */}
        {work.url && (
          <a
            href={work.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex items-center gap-2 rounded-full border border-[#b8a2ff]/40 px-6 py-3 font-[family-name:var(--font-inter)] text-sm text-[#b8a2ff] transition-colors hover:bg-[#b8a2ff]/10"
            data-cursor="link"
          >
            サイトを見る →
          </a>
        )}
      </div>
    </main>
  );
}
