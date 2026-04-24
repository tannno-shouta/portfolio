import { HeroSection } from "@/components/layout/HeroSection";
import { AboutSection } from "@/components/layout/AboutSection";
import { NowSection } from "@/components/layout/NowSection";
import { WorksSection } from "@/components/layout/WorksSection";
import { ContactSection } from "@/components/layout/ContactSection";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <NowSection />
      <WorksSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
