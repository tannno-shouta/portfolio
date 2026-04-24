import type { Metadata } from "next";
import { Noto_Sans_JP, Zen_Kaku_Gothic_New, Inter } from "next/font/google";
import "./globals.css";
import { LenisProvider } from "@/components/scroll/LenisProvider";
import { CustomCursor } from "@/components/cursor/CustomCursor";
import { Scene } from "@/components/canvas/Scene";
import { Header } from "@/components/layout/Header";
import { PageTransitionOverlay } from "@/components/motion/PageTransition";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const zenKakuGothicNew = Zen_Kaku_Gothic_New({
  variable: "--font-zen-kaku",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "丹野 勝太 / Shota Tanno",
  description:
    "Front Engineer / Generative AI Consulting / Fashion Consulting — Based in Fukuoka",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body
        className={`${notoSansJP.variable} ${zenKakuGothicNew.variable} ${inter.variable} cursor-none bg-[#0a0a0a]`}
      >
        <LenisProvider>
          <CustomCursor />
          <Scene />
          <Header />
          <PageTransitionOverlay />
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
