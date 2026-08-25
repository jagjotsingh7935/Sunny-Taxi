import { Baby, BadgeCheck, Clock, Wallet } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Counter } from '@/components/ui/Counter';

const reasons = [
  {
    icon: Wallet,
    title: '100% fixed upfront pricing',
    body:
      'The number you see at booking is the number on the receipt. No hidden meter fees, no surge rates, and complete transparency on every route.',
  },
  {
    icon: Clock,
    title: 'Punctual pre-booked pickups',
    body:
      'Pre-book your airport transfer, daily commute, or appointments with confidence. We arrive promptly with friendly, reliable door-to-door service.',
  },
  {
    icon: BadgeCheck,
    title: 'CPVV accredited & professional service',
    body:
      'Licensed, background-checked, and passenger-transport accredited in Victoria. Safe, clean, and comfortable vehicles driven with care.',
  },
  {
    icon: Baby,
    title: 'Versatile fleet & child seats',
    body:
      'Sedan taxis, 7-seater SUVs, maxi vans, and complimentary child restraints on quoted trips. Wheelchair and passenger assistance where suitable.',
  },
];

const stats = [
  { value: 15000, suffix: '+', label: 'Completed Melbourne rides', decimals: 0 },
  { value: 99.8, suffix: '%', label: 'On-time arrival rate', decimals: 1 },
  { value: 4.9, suffix: '\u2605', label: 'Average rider rating', decimals: 1 },
  { value: 24, suffix: '/7', label: 'Dispatch coverage, every day', decimals: 0 },
];

/**
 * The single dark band in the middle of the page: the four promises, then the
 * numbers that back them up. Keeping them together avoids two competing dark zones.
 */
export function WhyChooseUs() {
  return (
    <section className="band-dark on-dark section-y">
      <div className="shell">
        <SectionHeading
          eyebrow="Why Melbourne books us"
          title="The details that decide a transfer"
          description="Anyone can send a car. These are the four things riders tell us actually matter at 5am on the Tullamarine Freeway."
        />

        <div className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2">
          {reasons.map(({ icon: Icon, title, body }) => (
            <article
              key={title}
              data-reveal
              className="card-dark group p-6 transition-colors duration-500 hover:border-gold/40 sm:p-7"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-gold/25 bg-gold/10 transition-colors duration-500 group-hover:bg-gold/20">
                <Icon className="h-5 w-5 text-gold" />
              </span>
              <h3 className="mt-5 text-fluid-lg font-semibold text-platinum">{title}</h3>
              <p className="mt-2.5 text-fluid-sm leading-relaxed text-white/60">{body}</p>
            </article>
          ))}
        </div>

        <div
          className="mt-6 grid gap-8 rounded-2xl border border-white/12 bg-white/[0.04] p-7 sm:grid-cols-2 sm:p-9 lg:grid-cols-4"
          data-reveal
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-fluid-stat font-bold gold-text">
                <Counter value={stat.value} decimals={stat.decimals} suffix={stat.suffix} />
              </p>
              <p className="mt-2.5 text-fluid-xs leading-relaxed text-white/55">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
