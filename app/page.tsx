import HeroSection from "@/components/sections/HeroSection";
import ProblemSection from "@/components/sections/ProblemSection";
import BigIdeaSection from "@/components/sections/BigIdeaSection";
import VowelsSection from "@/components/sections/VowelsSection";
import ConsonantRootsSection from "@/components/sections/ConsonantRootsSection";
import ThreeModesSection from "@/components/sections/ThreeModesSection";
import ConsonantTreeSection from "@/components/sections/ConsonantTreeSection";
import ConsonantSongSection from "@/components/sections/ConsonantSongSection";
import NumbersSection from "@/components/sections/NumbersSection";
import FounderSection from "@/components/sections/FounderSection";
import FooterSection from "@/components/sections/FooterSection";

export default function HomePage() {
  return (
    <>
      <main>
        <HeroSection />
        <ProblemSection />
        <BigIdeaSection />
        <VowelsSection />
        <ConsonantRootsSection />
        <ThreeModesSection />
        <ConsonantTreeSection />
        <ConsonantSongSection />
        <NumbersSection />
        <FounderSection />
      </main>
      <FooterSection />
    </>
  );
}
