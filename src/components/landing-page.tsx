'use client';

import { CtaSection } from './landing/cta-section';
import { FeaturesSection } from './landing/features-section';
import { FlowSection } from './landing/flow-section';
import { FooterSection } from './landing/footer-section';
import { HeroSection } from './landing/hero-section';
import { PromptsSection } from './landing/prompts-section';
import { TopNav } from './landing/top-nav';

export function LandingPage() {
  return (
    <div className="relative w-full overflow-x-clip bg-background text-foreground">
      <div className="landing-gradient-bg pointer-events-none" />
      <div className="landing-gradient-orb landing-gradient-orb-left pointer-events-none" />
      <div className="landing-gradient-orb landing-gradient-orb-right pointer-events-none" />

      <TopNav />
      <HeroSection />
      <FeaturesSection />
      <FlowSection />
      <PromptsSection />
      <CtaSection />
      <FooterSection />
    </div>
  );
}
