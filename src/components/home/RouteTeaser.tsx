import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Route as RouteIcon } from 'lucide-react';
import { LuxuryMap } from '@/components/map/LuxuryMap';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { popularRoutes } from '@/data/mockRoutes';
import { estimateRoute } from '@/services/geo';
import { currency } from '@/services/pricing';
import { useBookingStore } from '@/store/bookingStore';

export function RouteTeaser() {
  const [activeId, setActiveId] = useState(popularRoutes[0].id);
  const applyRoute = useBookingStore((s) => s.applyRoute);
  const setTab = useBookingStore((s) => s.setTab);

  const active = popularRoutes.find((r) => r.id === activeId) ?? popularRoutes[0];
  const geometry = useMemo(() => estimateRoute(active.from, active.to), [active]);

  return (
    <section className="shell section-y">
      <SectionHeading
        eyebrow="Live route preview"
        title="See the road before you book it"
        description="Choose a high-demand Melbourne corridor and watch the route draw itself — distance, travel time and the fixed fare, all before you enter a single detail."
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-[380px_1fr]" data-reveal>
        <div className="space-y-2.5">
          {popularRoutes.map((route) => {
            const selected = route.id === active.id;
            return (
              <button
                key={route.id}
                onClick={() => setActiveId(route.id)}
                className={`flex w-full items-center justify-between gap-4 rounded-2xl border p-4 text-left transition-all duration-300 ${
                  selected
                    ? 'border-gold-deep bg-gold/10 shadow-gold'
                    : 'border-line bg-white hover:border-gold-deep/35 hover:bg-paper-alt/60'
                }`}
              >
                <span className="min-w-0">
                  <span className="block truncate text-fluid-sm font-medium text-ink">
                    {route.shortLabel}
                  </span>
                  <span className="mt-1 flex items-center gap-3 text-fluid-xs text-ink-muted">
                    <span className="flex items-center gap-1">
                      <RouteIcon className="h-3 w-3" /> {route.distanceKm} km
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {route.durationMins} min
                    </span>
                  </span>
                </span>
                <span className="shrink-0 text-right">
                  <span className="block text-[0.65rem] uppercase tracking-label text-ink-muted">from</span>
                  <span className="block text-fluid-lg font-bold gold-text">
                    {currency(route.fixedPrice)}
                  </span>
                </span>
              </button>
            );
          })}

          <Link
            to="/booking"
            onClick={() => {
              setTab('fixed');
              applyRoute(active.id);
            }}
            className="btn-gold mt-4 w-full"
          >
            Book {active.shortLabel} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <LuxuryMap
          pickup={active.from}
          dropoff={active.to}
          geometry={geometry}
          className="h-[420px] lg:h-full"
        />
      </div>
    </section>
  );
}
