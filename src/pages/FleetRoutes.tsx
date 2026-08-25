import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Baby, Briefcase, Search, Users, Wifi } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useAdminDataStore } from '@/store/adminDataStore';
import { currency } from '@/services/pricing';
import { useBookingStore } from '@/store/bookingStore';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import type { VehicleClassId } from '@/types';

const seatFilters = [
  { label: 'Any size', min: 0 },
  { label: '1–3 people', min: 3 },
  { label: '4–5 people', min: 5 },
  { label: '6+ people', min: 7 },
];

const bagFilters = [
  { label: 'Any luggage', min: 0 },
  { label: '2+ cases', min: 2 },
  { label: '4+ cases', min: 4 },
  { label: '6+ cases', min: 6 },
];

export default function FleetRoutes() {
  const ref = useScrollReveal<HTMLDivElement>();
  const navigate = useNavigate();
  const { applyRoute, setTab, setVehicle } = useBookingStore();
  const { vehicles, routes, suburbs: allSuburbs } = useAdminDataStore();

  const [seats, setSeats] = useState(0);
  const [bags, setBags] = useState(0);
  const [query, setQuery] = useState('');

  const fleet = useMemo(
    () => vehicles.filter((v) => v.passengers >= seats && v.largeSuitcases >= bags),
    [vehicles, seats, bags],
  );

  const suburbs = useMemo(() => {
    if (!query.trim()) return allSuburbs;
    const q = query.toLowerCase().trim();
    return allSuburbs.filter(
      (s) =>
        s.suburb.toLowerCase().includes(q) ||
        s.postcode.includes(q) ||
        s.region.toLowerCase().includes(q),
    );
  }, [allSuburbs, query]);

  const book = (routeId: string) => {
    setTab('fixed');
    applyRoute(routeId);
    navigate('/booking');
  };

  const bookVehicle = (id: VehicleClassId) => {
    setVehicle(id);
    setTab('fixed');
    navigate('/booking');
  };

  return (
    <div ref={ref} className="w-full min-w-0 max-w-full overflow-hidden pt-20 sm:pt-28 pb-16">
      {/* Fleet */}
      <section className="shell min-w-0 max-w-full">
        <SectionHeading
          align="left"
          eyebrow="Fleet catalogue"
          title="Filter our fleet by passengers and luggage"
          description="Choose from our sedan taxis, spacious SUV / 7-seaters, or maxi passenger vans. Fixed fares quoted upfront based on route, distance, and passenger requirements."
        />

        {/* Responsive filter bar */}
        <div className="mt-6 sm:mt-8 space-y-3" data-reveal>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <span className="text-[0.68rem] uppercase font-bold tracking-label text-ink-muted shrink-0">
              Passengers:
            </span>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {seatFilters.map((f) => (
                <button
                  key={f.label}
                  type="button"
                  onClick={() => setSeats(f.min)}
                  className={`rounded-full border px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-fluid-xs font-medium transition ${
                    seats === f.min
                      ? 'border-gold-deep bg-gold/12 text-gold-ink font-semibold shadow-sm'
                      : 'border-line bg-white text-ink-muted hover:border-gold-deep/35'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <span className="text-[0.68rem] uppercase font-bold tracking-label text-ink-muted shrink-0">
              Luggage:
            </span>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {bagFilters.map((f) => (
                <button
                  key={f.label}
                  type="button"
                  onClick={() => setBags(f.min)}
                  className={`rounded-full border px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-fluid-xs font-medium transition ${
                    bags === f.min
                      ? 'border-gold-deep bg-gold/12 text-gold-ink font-semibold shadow-sm'
                      : 'border-line bg-white text-ink-muted hover:border-gold-deep/35'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Vehicle cards */}
        <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
          {fleet.map((vehicle) => (
            <article
              key={vehicle.id}
              data-reveal
              className="card grid overflow-hidden md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr]"
            >
              <div className="relative aspect-[16/10] xs:aspect-[16/9] md:aspect-auto overflow-hidden bg-obsidian">
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
                {vehicle.badge && (
                  <span className="chip-gold absolute left-3 top-3 text-[0.68rem]">
                    {vehicle.badge}
                  </span>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian/60 via-transparent to-transparent md:hidden" />
              </div>

              <div className="p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-fluid-h3 font-bold text-ink">{vehicle.name}</h3>
                      <p className="mt-0.5 text-xs sm:text-fluid-xs text-ink-muted">{vehicle.tagline}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="block text-[0.62rem] uppercase tracking-label text-ink-muted">
                        From
                      </span>
                      <span className="text-lg sm:text-fluid-xl font-bold gold-text">
                        {currency(vehicle.minimumFare)}
                      </span>
                    </div>
                  </div>

                  <p className="mt-3 text-xs sm:text-fluid-sm leading-relaxed text-ink-soft">
                    {vehicle.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {vehicle.models.map((m) => (
                      <span key={m} className="chip text-[0.68rem] px-2.5 py-0.5">
                        {m}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 sm:mt-5 flex flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-2 text-xs sm:text-fluid-xs text-ink-muted">
                    <span className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-gold-deep" /> {vehicle.passengers} passengers
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Briefcase className="h-3.5 w-3.5 text-gold-deep" /> {vehicle.largeSuitcases} large ·{' '}
                      {vehicle.carryOn} carry-on
                    </span>
                    {vehicle.wifi && (
                      <span className="flex items-center gap-1.5">
                        <Wifi className="h-3.5 w-3.5 text-gold-deep" /> WiFi
                      </span>
                    )}
                    {vehicle.babySeatCompatible && (
                      <span className="flex items-center gap-1.5">
                        <Baby className="h-3.5 w-3.5 text-gold-deep" /> Child seats
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-line/60 flex sm:justify-start">
                  <button
                    onClick={() => bookVehicle(vehicle.id)}
                    className="btn-gold w-full sm:w-auto px-6 py-2.5 text-xs sm:text-fluid-sm"
                  >
                    Book the {vehicle.name} <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}

          {fleet.length === 0 && (
            <p className="card p-8 sm:p-10 text-center text-fluid-sm text-ink-muted">
              No vehicle in the standard fleet carries that combination. Call dispatch on our 24/7
              line and we will pair two cars on a single fare.
            </p>
          )}
        </div>
      </section>

      {/* Published routes */}
      <section className="shell mt-12 sm:mt-16 lg:mt-20">
        <SectionHeading
          align="left"
          eyebrow="Published routes"
          title="Every fixed-price corridor we run"
          description="Instant fixed fares for our most popular Melbourne travel corridors."
        />

        <div className="mt-6 sm:mt-8 grid gap-3 sm:grid-cols-2" data-reveal>
          {routes.map((route) => (
            <button
              key={route.id}
              type="button"
              onClick={() => book(route.id)}
              className="card flex items-center justify-between gap-3 p-3.5 sm:p-4 text-left transition hover:border-gold-deep/40 active:scale-[0.99]"
            >
              <span className="min-w-0 flex-1">
                <span className="block text-xs sm:text-fluid-sm font-semibold text-ink leading-tight line-clamp-1">
                  {route.label}
                </span>
                <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[0.68rem] sm:text-fluid-xs text-ink-muted">
                  <span>{route.distanceKm} km</span>
                  <span>·</span>
                  <span>{route.durationMins} min</span>
                  <span>·</span>
                  <span className="capitalize">{route.category}</span>
                </span>
              </span>
              <span className="shrink-0 text-base sm:text-fluid-lg font-bold gold-text pl-1">
                {currency(route.fixedPrice)}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Suburb fare table */}
      <section className="shell mt-12 sm:mt-16 lg:mt-20">
        <SectionHeading
          align="left"
          eyebrow="Suburban fare finder"
          title="Search your suburb, see the fare"
          description="Sedan Taxi prices to the CBD and to Melbourne Airport. SUV / 7-seater and maxi van options apply a fixed multiplier — shown live in the booking wizard."
        />

        <div className="relative mt-6 sm:mt-8 max-w-md" data-reveal>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gold-deep" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search suburb (e.g. Deanside, Brighton, 3336)"
            className="w-full pl-10 text-xs sm:text-fluid-sm"
            aria-label="Search suburbs"
          />
        </div>

        <div
          className="card mt-4 sm:mt-6 w-full min-w-0 max-w-full overflow-x-auto scrollbar-thin scrollbar-thumb-line scrollbar-track-transparent"
          data-reveal
        >
          <table className="w-full min-w-[540px] text-left text-xs sm:text-fluid-sm">
            <thead>
              <tr className="border-b border-line text-[0.62rem] sm:text-[0.68rem] uppercase tracking-label text-ink-muted bg-paper-alt/40">
                <th className="px-4 py-3 sm:px-6 sm:py-3.5 font-semibold">Suburb</th>
                <th className="px-3 py-3 sm:px-4 sm:py-3.5 font-semibold">Postcode</th>
                <th className="px-3 py-3 sm:px-4 sm:py-3.5 font-semibold">Region</th>
                <th className="px-4 py-3 sm:px-6 sm:py-3.5 text-right font-semibold">To CBD</th>
                <th className="px-4 py-3 sm:px-6 sm:py-3.5 text-right font-semibold">To MEL Airport</th>
              </tr>
            </thead>
            <tbody>
              {suburbs.map((s) => (
                <tr
                  key={`${s.suburb}-${s.postcode}`}
                  className="border-b border-line/60 transition hover:bg-gold/6"
                >
                  <td className="px-4 py-2.5 sm:px-6 sm:py-3 font-medium text-ink">{s.suburb}</td>
                  <td className="px-3 py-2.5 sm:px-4 sm:py-3 font-mono text-[0.72rem] sm:text-fluid-xs text-ink-muted">{s.postcode}</td>
                  <td className="px-3 py-2.5 sm:px-4 sm:py-3 text-[0.72rem] sm:text-fluid-xs text-ink-muted">{s.region}</td>
                  <td className="px-4 py-2.5 sm:px-6 sm:py-3 text-right font-semibold gold-text">
                    {s.toCbd === 0 ? '—' : currency(s.toCbd)}
                  </td>
                  <td className="px-4 py-2.5 sm:px-6 sm:py-3 text-right font-semibold gold-text">
                    {currency(s.toTullamarine)}
                  </td>
                </tr>
              ))}
              {suburbs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 sm:px-6 sm:py-12 text-center text-xs sm:text-fluid-sm text-ink-muted">
                    No suburb matches “{query}”. We service all of Melbourne — request a custom quote and
                    dispatch replies promptly.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="mt-3 sm:mt-4 text-[0.72rem] sm:text-fluid-xs text-ink-muted">
          Fares include tolls and airport access fees. Late-night service (10pm–6am) adds 15%.
        </p>
      </section>
    </div>
  );
}
