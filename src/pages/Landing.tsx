import { FinalCta } from '../components/landing/FinalCta';
import { Hero } from '../components/landing/Hero';
import { HowItWorks } from '../components/landing/HowItWorks';
import { ProjectsSection } from '../components/landing/ProjectsSection';
import { WhatYouWillLearn } from '../components/landing/WhatYouWillLearn';

export default function Landing() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <WhatYouWillLearn />
      <ProjectsSection />
      <FinalCta />
    </>
  );
}
