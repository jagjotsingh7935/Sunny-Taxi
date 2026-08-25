import { Link } from 'react-router-dom';
import {
  Accessibility,
  ArrowRight,
  Briefcase,
  CalendarCheck,
  Compass,
  HeartHandshake,
  MapPin,
  Plane,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';

const services = [
  {
    icon: Plane,
    title: 'Melbourne Airport Transfers',
    description:
      'Punctual fixed-price transfers to & from Tullamarine (MEL) and Avalon (AVV) Airports with free waiting time and flight monitoring.',
    tag: 'Fixed Fare',
  },
  {
    icon: CalendarCheck,
    title: 'Pre-Booked Taxi Services',
    description:
      'Guaranteed on-time arrivals for early morning flights, medical appointments, functions, and time-critical commitments.',
    tag: '24/7 Available',
  },
  {
    icon: Compass,
    title: 'Regular Daily Transport',
    description:
      'Daily scheduled transport for commuters, students, aged-care clients, and community organisations with transparent rates.',
    tag: 'Daily Commutes',
  },
  {
    icon: Accessibility,
    title: 'Wheelchair & Passenger Assistance',
    description:
      'Caring, patient passenger assistance for elderly riders, clients with mobility aids, and medical travel (where suitable).',
    tag: 'Accessible Care',
  },
  {
    icon: Briefcase,
    title: 'Corporate & Business Travel',
    description:
      'Executive passenger transport for business meetings, corporate accounts, VIP clients, and seamless monthly business invoicing.',
    tag: 'Corporate Accounts',
  },
  {
    icon: MapPin,
    title: 'Long-Distance & Regional Trips',
    description:
      'Comfortable regional transfers across Victoria including Geelong, Ballarat, Bendigo, Mornington Peninsula, and Yarra Valley.',
    tag: 'All Victoria',
  },
  {
    icon: Users,
    title: 'Group & Family Transport',
    description:
      'Spacious 7-seater SUVs and maxi vans with ample luggage capacity and complimentary fitted baby capsules / booster seats.',
    tag: 'Up to 11 Seats',
  },
  {
    icon: ShieldCheck,
    title: 'Reliable Pickup & Drop-Off',
    description:
      'Door-to-door coverage across every suburb of metropolitan Melbourne — from Deanside and the West to the CBD and Bayside.',
    tag: 'All Suburbs',
  },
  {
    icon: Sparkles,
    title: 'Professional & Personalised Service',
    description:
      'Friendly, accredited driver Gagandeep Singh delivering safe, comfortable, and tailored customer service on every journey.',
    tag: 'CPVV Accredited',
  },
];

export function ServicesGrid() {
  return (
    <section className="shell section-y">
      <SectionHeading
        eyebrow="Our complete service offering"
        title="Tailored passenger transport for every Melbourne journey"
        description="From daily airport transfers and regular business accounts to family maxi vans and aged-care community travel, we deliver fixed upfront pricing with complete peace of mind."
      />

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => {
          const Icon = s.icon;
          return (
            <article
              key={s.title}
              data-reveal
              className="card group flex flex-col justify-between p-6 sm:p-7 transition-all duration-300 hover:border-gold-deep/50 hover:shadow-gold"
            >
              <div>
                <div className="flex items-center justify-between gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gold-deep/30 bg-gold/10 text-gold-deep transition-colors group-hover:bg-gold-gradient group-hover:text-obsidian shadow-sm">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="chip text-[0.68rem] font-bold">{s.tag}</span>
                </div>

                <h3 className="mt-5 text-fluid-base font-bold text-slate-900 leading-snug">
                  {s.title}
                </h3>
                <p className="mt-2 text-xs sm:text-fluid-xs text-slate-600 leading-relaxed font-medium">
                  {s.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  to="/booking"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-gold-ink group-hover:text-amber-950 transition-colors"
                >
                  <span>Book this service</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      {/* Community & Business Commitment Banner */}
      <div
        data-reveal
        className="mt-8 rounded-3xl border-2 border-gold-deep/30 bg-gradient-to-r from-amber-50 via-white to-gold/10 p-6 sm:p-8 lg:p-10 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-6"
      >
        <div className="space-y-2 max-w-2xl text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/20 text-gold-ink text-xs font-bold">
            <HeartHandshake className="h-4 w-4" />
            <span>Aged-Care, Community &amp; Corporate Partnerships</span>
          </div>
          <h4 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
            Daily Fixed Routes &amp; Dedicated Client Accounts
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
            We provide regular transport contracts for medical appointments, aged-care clients, schools, and business teams. Fares are quoted upfront based on route distance, schedule, and passenger requirements with weekly or monthly billing options.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
          <Link to="/booking" className="btn-gold text-center text-xs sm:text-sm font-bold">
            Get an instant quote <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/contact" className="btn-ghost text-center text-xs sm:text-sm font-bold">
            Inquire for business / daily accounts
          </Link>
        </div>
      </div>
    </section>
  );
}
