import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import Stats from "@/components/landing/Stats";
import PreviewGrid from "@/components/landing/PreviewGrid";
import ClosingCTA from "@/components/landing/ClosingCTA";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Stats />
      <PreviewGrid />
      <ClosingCTA />
    </>
  );
}
