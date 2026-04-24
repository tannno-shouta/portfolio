export type Work = {
  slug: string;
  title: string;
  titleEn: string;
  year: string;
  category: string;
  cover: string; // public/works/ 以下
  url?: string;
  description: string;
  tags: string[];
};

export const works: Work[] = [
  {
    slug: "matching-photo-lp",
    title: "マッチングフォト LP",
    titleEn: "Matching Photo LP",
    year: "2024",
    category: "Front-end / Design",
    cover: "/works/matching-photo-lp.jpg",
    url: "https://matching-photo-lp.vercel.app/",
    description:
      "マッチングアプリ向け写真撮影サービスのランディングページ。Next.js + Tailwind で設計・実装。",
    tags: ["Next.js", "Tailwind CSS", "TypeScript"],
  },
];
