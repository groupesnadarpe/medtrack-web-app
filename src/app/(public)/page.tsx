import { ActorsSection } from "@/features/marketing/ui/actors-section";
import { FeaturesSection } from "@/features/marketing/ui/features-section";
import { HeroSection } from "@/features/marketing/ui/hero-section";
import { ProcessSection } from "@/features/marketing/ui/process-section";
import { StatsSection } from "@/features/marketing/ui/stats-section";
import { TestimonialSection } from "@/features/marketing/ui/testimonial-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <ProcessSection />
      <ActorsSection />
      <FeaturesSection />
      <TestimonialSection />
    </>
  );
}
