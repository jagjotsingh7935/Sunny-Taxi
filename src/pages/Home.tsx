import { Hero } from '@/components/home/Hero';
import { RouteTeaser } from '@/components/home/RouteTeaser';
import { ServicesGrid } from '@/components/home/ServicesGrid';
import { FleetShowcase } from '@/components/home/FleetShowcase';
import { PopularRoutes } from '@/components/home/PopularRoutes';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { Testimonials } from '@/components/home/Testimonials';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function Home() {
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <div ref={ref}>
      <Hero />
      <RouteTeaser />
      <ServicesGrid />
      <FleetShowcase />
      <PopularRoutes />
      <WhyChooseUs />
      <Testimonials />
    </div>
  );
}
