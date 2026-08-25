import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Sparkles, Stethoscope, UserCheck } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Counter } from '@/components/ui/Counter';
import { BRAND } from '@/data/brand';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const standards = [
  {
    icon: UserCheck,
    title: 'Who drives you',
    body:
      'Every driver holds a Victorian Commercial Passenger Vehicle Driver Accreditation, passes rigorous police background checks, and possesses deep route knowledge of all Melbourne metropolitan suburbs and airport corridors.',
  },
  {
    icon: ShieldCheck,
    title: 'Safety and compliance',
    body:
      'Commercial passenger transport insurance, GPS-tracked journeys, punctual dispatching, and child restraint safety compliance across sedans, 7-seater SUVs, and maxi vans.',
  },
  {
    icon: Stethoscope,
    title: 'Cleanliness & comfort',
    body:
      'Vehicles are detailed regularly, sanitised, and strictly non-smoking with full climate control to guarantee a relaxing, comfortable ride every time.',
  },
  {
    icon: Sparkles,
    title: 'The upfront price promise',
    body:
      'Fares are quoted transparently based on distance, route, vehicle type, and passenger requirements. What is quoted is what you pay — with no hidden extras.',
  },
];

const milestones = [
  { year: '2015', text: 'One Camry, one chauffeur, working the Tullamarine run out of Essendon.' },
  { year: '2018', text: 'Corporate accounts open. The fleet reaches twelve cars and 24/7 dispatch.' },
  { year: '2021', text: 'European Premium and Prestige SUV classes join for executive travel.' },
  { year: '2024', text: 'Maxi vans added for groups. Yarra Valley and Peninsula touring launches.' },
  { year: '2026', text: 'Live map booking with fixed pricing rolls out across the whole fleet.' },
];

export default function About() {
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <div ref={ref} className="pt-24 sm:pt-28">
      <section className="shell">
        <div className="max-w-3xl">
          <span className="eyebrow">About {BRAND.name}</span>
          <h1 className="mt-4 text-fluid-h1">
            Safe, reliable and punctual passenger transport across Melbourne
          </h1>
          <p className="mt-6 text-fluid-base leading-relaxed text-ink-muted">
            {BRAND.fullName} provides dedicated taxi and passenger transport services across all
            suburbs and regions of metropolitan Melbourne. Headquartered at {BRAND.address}, our service
            is built around a simple principle: safe, comfortable, and reliable transportation with
            punctual pickups and friendly customer service.
          </p>
          <p className="mt-4 text-fluid-base leading-relaxed text-ink-muted">
            Whether you require a fixed-price airport transfer to Tullamarine or Avalon, daily regular
            transport for school, work, medical or aged-care appointments, a 7-seater SUV for family
            outings, or a maxi van with wheelchair assistance, we ensure transparent upfront fares and
            personalised care from start to finish.
          </p>
        </div>

        <div className="card mt-12 grid gap-8 p-8 sm:grid-cols-3 sm:p-10" data-reveal>
          {[
            { value: 11, suffix: ' years', label: 'Driving Melbourne' },
            { value: 15000, suffix: '+', label: 'Completed transfers' },
            { value: 38, suffix: '', label: 'Accredited chauffeurs' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-fluid-stat font-bold gold-text">
                <Counter value={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-2 text-fluid-xs text-ink-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="shell mt-16 sm:mt-20 lg:mt-24">
        <SectionHeading
          align="left"
          eyebrow="Our standards"
          title="What accreditation actually means here"
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {standards.map(({ icon: Icon, title, body }) => (
            <article key={title} data-reveal className="card p-7">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-gold-deep/30 bg-gold/10">
                <Icon className="h-5 w-5 text-gold-deep" />
              </span>
              <h3 className="mt-5 text-fluid-lg font-semibold text-ink">{title}</h3>
              <p className="mt-2.5 text-fluid-sm leading-relaxed text-ink-muted">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-3xl px-4 sm:mt-20 sm:px-6 lg:px-8">
        <SectionHeading align="left" eyebrow="How we got here" title="Eleven years, one rule" />
        <ol className="mt-10 space-y-0">
          {milestones.map((m, i) => (
            <li key={m.year} data-reveal className="flex gap-6">
              <div className="flex flex-col items-center">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold-deep/35 bg-gold/10 font-accent text-fluid-xs font-bold text-gold-ink">
                  {m.year}
                </span>
                {i < milestones.length - 1 && (
                  <span className="my-1 w-px flex-1 bg-gradient-to-b from-gold-deep/40 to-transparent" />
                )}
              </div>
              <p className="pb-10 pt-3 text-fluid-sm leading-relaxed text-ink-muted">{m.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="shell mt-8">
        <div className="card flex flex-col items-center gap-5 p-10 text-center" data-reveal>
          <h2 className="max-w-lg text-fluid-h2">
            Your next transfer, priced before you commit
          </h2>
          <p className="max-w-md text-fluid-sm text-ink-muted">
            Map the trip, see the fare and the travel time, then decide. {BRAND.hours}.
          </p>
          <Link to="/booking" className="btn-gold">
            Open the booking map <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
