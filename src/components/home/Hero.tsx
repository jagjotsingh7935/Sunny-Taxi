import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ArrowRight, BadgeCheck, PlaneTakeoff, ShieldCheck } from 'lucide-react';
import { QuickBookWidget } from './QuickBookWidget';
import { BRAND } from '@/data/brand';

const trustPoints = [
  { icon: BadgeCheck, text: 'Fixed upfront fares, agreed before pickup' },
  { icon: PlaneTakeoff, text: 'Melbourne & Avalon Airport pre-booked transfers' },
  { icon: ShieldCheck, text: 'CPVV accredited driver, punctual & courteous service' },
];

export function Hero() {
  const scope = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .from('[data-hero-eyebrow]', { y: 18, opacity: 0, duration: 0.55 })
        .from('[data-hero-line]', { y: 38, opacity: 0, duration: 0.85, stagger: 0.1 }, '-=0.28')
        .from('[data-hero-copy]', { y: 22, opacity: 0, duration: 0.65 }, '-=0.5')
        .from('[data-hero-trust]', { y: 16, opacity: 0, duration: 0.55, stagger: 0.08 }, '-=0.4')
        .from('[data-hero-widget]', { y: 40, opacity: 0, duration: 0.9 }, '-=0.75');
    }, scope);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={scope}
      className="band-dark on-dark relative overflow-hidden pb-14 pt-24 sm:pb-20 sm:pt-32 lg:pb-24"
    >
      <div className="shell relative grid gap-10 lg:grid-cols-[1fr_min(440px,42%)] lg:gap-12 xl:gap-16">
        {/* Copy */}
        <div className="max-w-2xl">
          <span data-hero-eyebrow className="chip-gold">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold" />
            </span>
            Available 24/7 across metropolitan Melbourne &amp; regional Victoria
          </span>

          <h1 className="mt-5 text-fluid-h1 font-extrabold sm:mt-6 tracking-tight">
            <span data-hero-line className="block text-platinum">
              Reliable, professional
            </span>
            <span data-hero-line className="block gold-text">
              taxi &amp; passenger transport
            </span>
            <span data-hero-line className="block text-platinum">
              across Melbourne
            </span>
          </h1>

          <p
            data-hero-copy
            className="mt-5 max-w-prose text-fluid-base leading-relaxed text-white/70 sm:mt-6"
          >
            Safe, punctual and personalised transportation by Gagandeep Singh. Airport transfers,
            sedan taxis, 7-seater SUVs, and maxi vans — fixed upfront pricing with zero surprises.
          </p>

          <div className="mt-7 flex flex-col gap-3 xs:flex-row sm:mt-8">
            <Link to="/booking" className="btn-gold">
              Book a ride <ArrowRight className="h-4 w-4" />
            </Link>
            <a href={`tel:${BRAND.dispatchPhoneDial}`} className="btn-ghost">
              Call {BRAND.dispatchPhone}
            </a>
          </div>

          <ul className="mt-8 space-y-3 sm:mt-10">
            {trustPoints.map(({ icon: Icon, text }) => (
              <li
                key={text}
                data-hero-trust
                className="flex items-center gap-3 text-fluid-sm text-white/70"
              >
                <Icon className="h-4 w-4 shrink-0 text-gold" />
                {text}
              </li>
            ))}
          </ul>
        </div>

        {/* Quick booking widget — a light card deliberately lifted off the dark band */}
        <div data-hero-widget className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border border-line bg-white p-5 shadow-lift sm:p-6 text-slate-900">
            <div className="mb-5">
              <p className="eyebrow">Instant booking</p>
              <p className="mt-1.5 text-fluid-sm text-slate-600 font-medium">
                Pick a published route or map your own. Either way you see the price first.
              </p>
            </div>
            <QuickBookWidget />
          </div>
        </div>
      </div>
    </section>
  );
}
