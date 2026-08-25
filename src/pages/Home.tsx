import { Hero } from '@/components/home/Hero';
import { RouteTeaser } from '@/components/home/RouteTeaser';
import { FleetShowcase } from '@/components/home/FleetShowcase';
import { PopularRoutes } from '@/components/home/PopularRoutes';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { Testimonials } from '@/components/home/Testimonials';
import { useScrollReveal } from '@/hooks/useScrollReveal';

/**
 * Surface rhythm: dark hero -> light route preview -> light fleet -> tinted routes
 * -> dark trust band -> light testimonials -> dark footer. The dark bands bracket
 * the page and mark the two moments that are about persuasion rather than browsing.
 */
export default function Home() {
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <div ref={ref}>
      <Hero />
      <RouteTeaser />
      <FleetShowcase />
      <PopularRoutes />
      <WhyChooseUs />
      <Testimonials />
    </div>
  );
}
