import React from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { ContinueLearningBlock } from "@/components/home/ContinueLearningBlock";
import { FeaturesBlock } from "@/components/home/FeaturesBlock";
import { RoadmapSummaryBlock } from "@/components/home/RoadmapSummaryBlock";
import { JungHyeonTreeBlock } from "@/components/home/JungHyeonTreeBlock";
import { TestimonialsBlock } from "@/components/home/TestimonialsBlock";
import { PricingPreviewBlock } from "@/components/home/PricingPreviewBlock";
import { FaqBlock } from "@/components/home/FaqBlock";
import { QuickConsultationBlock } from "@/components/home/QuickConsultationBlock";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-brand-bg transition-colors">
      {/* 1. Hero Section: Big Navy headline, primary & secondary CTAs, Mascot Honey, ScrollHintButton, and StatBand */}
      <HeroSection />

      {/* 2. Tiếp tục học dở (cho học viên đang học) */}
      <ContinueLearningBlock />

      {/* 3. Exclusive Features: SectionHeading + UnderlineTabs (Speaking, Writing, Honey AI, SRS Lessons) + FeaturePanel + MockupFrame */}
      <FeaturesBlock />

      {/* 4. Roadmap Preview: Sơ cấp, Trung cấp, Cao cấp */}
      <RoadmapSummaryBlock />

      {/* 5. Cây JungHyeon: Gamified XP growth tree */}
      <JungHyeonTreeBlock />

      {/* 6. Testimonials: White cards, 5 gold stars, learner achievements */}
      <TestimonialsBlock />

      {/* 7. Pricing Preview: Free plan vs Lifetime VIP plan (Price component, ProBadge, coral CTA) */}
      <PricingPreviewBlock />

      {/* 8. FAQ Accordion: Clean white cards with expand/collapse */}
      <FaqBlock />

      {/* 9. Quick Consultation Form */}
      <QuickConsultationBlock />
    </div>
  );
}
