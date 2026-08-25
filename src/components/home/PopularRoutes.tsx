import { useNavigate } from 'react-router-dom';
import { ArrowRight, Clock, Route as RouteIcon } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { popularRoutes } from '@/data/mockRoutes';
import { currency } from '@/services/pricing';
import { useBookingStore } from '@/store/bookingStore';

export function PopularRoutes() {
  const navigate = useNavigate();
  const { applyRoute, setTab } = useBookingStore();

  const bookRoute = (id: string) => {
    setTab('fixed');
    applyRoute(id);
    navigate('/booking');
  };

  return (
    <section className="band-alt border-y border-line">
      <div className="shell section-y">
      <SectionHeading
        eyebrow="Fixed-price routes"
        title="Melbourne's most-booked transfers"
        description="Published fares for the corridors we run every day. Tap one and the booking wizard opens with both ends already filled in."
      />

      <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {popularRoutes.map((route) => (
          <article
            key={route.id}
            data-reveal
            className="card group flex flex-col p-6 transition-all duration-500 hover:border-gold-deep/40"
          >
            <span className="chip w-fit capitalize">{route.category}</span>

            <h3 className="mt-4 text-fluid-base font-semibold leading-snug text-ink">
              {route.label}
            </h3>

            <div className="mt-4 flex items-center gap-4 text-fluid-xs text-ink-muted">
              <span className="flex items-center gap-1.5">
                <RouteIcon className="h-3.5 w-3.5 text-gold-deep" /> {route.distanceKm} km
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-gold-deep" /> {route.durationMins} min
              </span>
            </div>

            {route.note && (
              <p className="mt-4 text-fluid-xs leading-relaxed text-ink-muted">{route.note}</p>
            )}

            <div className="mt-auto pt-6">
              <div className="hairline mb-4" />
              <div className="flex items-end justify-between">
                <p>
                  <span className="block text-[0.65rem] uppercase tracking-label text-ink-muted">
                    Fixed from
                  </span>
                  <span className="text-fluid-xl font-bold gold-text">{currency(route.fixedPrice)}</span>
                </p>
                <button
                  onClick={() => bookRoute(route.id)}
                  className="btn-gold px-4 py-2.5 text-fluid-xs"
                >
                  Book now <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </article>
        ))}
        </div>
      </div>
    </section>
  );
}
