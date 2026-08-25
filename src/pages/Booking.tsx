import { useState } from 'react';
import { ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import { LuxuryMap } from '@/components/map/LuxuryMap';
import { BookingWizard } from '@/components/booking/BookingWizard';
import { useBookingStore } from '@/store/bookingStore';

export default function Booking() {
  const { pickup, dropoff, geometry, routing } = useBookingStore();
  const [mapExpanded, setMapExpanded] = useState(false);

  return (
    <div className="shell min-w-0 max-w-full overflow-hidden pb-12 sm:pb-20 pt-16 sm:pt-24 lg:pt-28">
      <header className="mb-4 sm:mb-8 max-w-2xl min-w-0">
        <span className="eyebrow">Booking &amp; live map</span>
        <h1 className="mt-1.5 sm:mt-3 text-fluid-h2 font-extrabold text-ink tracking-tight">
          Map your trip, lock your price
        </h1>
        <p className="mt-1.5 sm:mt-3 text-xs sm:text-fluid-sm leading-relaxed text-ink-muted">
          Type an address and the map flies to it. Add a destination and it draws the route with real
          distance and travel time — before you commit to anything.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 min-w-0 max-w-full lg:grid-cols-[1fr_480px] xl:grid-cols-[1fr_500px] lg:items-start">
        {/* Map column — responsive height on mobile, sticky on desktop */}
        <div className="min-w-0 max-w-full lg:sticky lg:top-24 lg:order-1">
          <div className="relative w-full min-w-0 max-w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-line">
            <LuxuryMap
              pickup={pickup}
              dropoff={dropoff}
              geometry={geometry}
              routing={routing}
              className={`w-full min-w-0 max-w-full transition-all duration-300 ${
                mapExpanded
                  ? 'h-[320px] sm:h-[440px]'
                  : 'h-[170px] xs:h-[200px] sm:h-[300px]'
              } lg:h-[calc(100vh-10rem)]`}
            />

            {/* Mobile toggle to expand/minimize map view */}
            <button
              type="button"
              onClick={() => setMapExpanded((prev) => !prev)}
              className="lg:hidden absolute top-2.5 right-2.5 z-[500] flex items-center gap-1 rounded-full border border-line bg-white/95 px-2.5 py-1 text-[0.68rem] font-semibold text-ink shadow-sm backdrop-blur transition active:scale-95"
              aria-label={mapExpanded ? 'Compact map view' : 'Expand map view'}
            >
              <MapPin className="h-3 w-3 text-gold-deep" />
              <span>{mapExpanded ? 'Compact map' : 'Expand map'}</span>
              {mapExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
          </div>
        </div>

        <div className="min-w-0 max-w-full lg:order-2">
          <BookingWizard />
        </div>
      </div>
    </div>
  );
}
