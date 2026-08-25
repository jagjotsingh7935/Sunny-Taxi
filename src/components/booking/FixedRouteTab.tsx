import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpDown, Banknote, CreditCard, Loader2, Minus, Plus, Zap } from 'lucide-react';
import { AddressInput } from './AddressInput';
import { PaymentModal } from './PaymentModal';
import { VehicleSelector } from './VehicleSelector';
import { mockRoutes } from '@/data/mockRoutes';
import { getVehicle } from '@/data/mockVehicles';
import { createBooking } from '@/services/api';
import { calculateFare, currency } from '@/services/pricing';
import { useBookingStore } from '@/store/bookingStore';
import { useAdminDataStore } from '@/store/adminDataStore';
import { useToast } from '@/hooks/useToast';
import { STORAGE_KEYS, storage } from '@/services/storage';
import type { Booking, BookingAddons, CustomerDetails, PaymentMethod, Place } from '@/types';

const defaultAddons: BookingAddons = {
  boosterSeats: 0,
  babyCapsules: 0,
  meetAndGreet: false,
  flightNumber: '',
  extraStop: false,
  notes: '',
};

function defaultSchedule(): string {
  const d = new Date(Date.now() + 3 * 60 * 60 * 1000);
  d.setMinutes(Math.ceil(d.getMinutes() / 15) * 15, 0, 0);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(
    d.getMinutes(),
  )}`;
}

interface FixedRouteTabProps {
  onConfirmed: (booking: Booking) => void;
}

export function FixedRouteTab({ onConfirmed }: FixedRouteTabProps) {
  const { notify } = useToast();
  const {
    pickup,
    dropoff,
    setPickup,
    setDropoff,
    swapEnds,
    selectedRouteId,
    applyRoute,
    vehicleId,
    setVehicle,
    geometry,
    routing,
  } = useBookingStore();

  const [passengers, setPassengers] = useState(2);
  const [addons, setAddons] = useState<BookingAddons>(defaultAddons);
  const [scheduledFor, setScheduledFor] = useState(defaultSchedule());
  const [payment, setPayment] = useState<PaymentMethod>('pay-driver');
  const [customer, setCustomer] = useState<CustomerDetails>(() =>
    storage.read<CustomerDetails>(STORAGE_KEYS.customer, { name: '', email: '', phone: '' }),
  );
  const [submitting, setSubmitting] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const routeScrollerRef = useRef<HTMLDivElement>(null);
  const [routeFade, setRouteFade] = useState({ left: false, right: false });

  const updateRouteFade = () => {
    const el = routeScrollerRef.current;
    if (!el) return;
    setRouteFade({
      left: el.scrollLeft > 4,
      right: el.scrollLeft + el.clientWidth < el.scrollWidth - 4,
    });
  };

  useEffect(() => {
    updateRouteFade();
    window.addEventListener('resize', updateRouteFade);
    return () => window.removeEventListener('resize', updateRouteFade);
  }, []);

  const route = useMemo(
    () => mockRoutes.find((r) => r.id === selectedRouteId),
    [selectedRouteId],
  );
  const distanceKm = geometry?.distanceKm ?? route?.distanceKm ?? 0;
  const durationMins = geometry?.durationMins ?? route?.durationMins ?? 0;

  const fare = useMemo(
    () =>
      calculateFare({
        vehicleId,
        distanceKm,
        fixedPrice: route?.fixedPrice,
        addons,
        scheduledFor,
        paymentMethod: payment,
      }),
    [vehicleId, distanceKm, route?.fixedPrice, addons, scheduledFor, payment],
  );

  const vehicle = getVehicle(vehicleId);

  const finalise = async (paymentStatus: Booking['paymentStatus']) => {
    setSubmitting(true);

    const activePickup: Place = pickup || {
      label: 'Melbourne Airport Terminal 2 (MEL)',
      suburb: 'Tullamarine',
      postcode: '3045',
      lat: -37.669,
      lng: 144.841,
    };
    const activeDropoff: Place = dropoff || {
      label: 'Melbourne CBD, VIC 3000',
      suburb: 'Melbourne',
      postcode: '3000',
      lat: -37.8136,
      lng: 144.9631,
    };
    const activeCustomer: CustomerDetails = {
      name: customer.name.trim() || 'Valued Passenger',
      phone: customer.phone.trim() || '0412 456 588',
      email: customer.email.trim() || 'passenger@melbournechauffeurs.com.au',
    };

    storage.write(STORAGE_KEYS.customer, activeCustomer);

    const result = await createBooking({
      type: 'fixed-route',
      routeId: route?.id,
      pickup: activePickup,
      dropoff: activeDropoff,
      vehicleId,
      vehicleName: vehicle.name,
      scheduledFor: new Date(scheduledFor).toISOString(),
      passengers,
      addons,
      distanceKm: distanceKm || 25,
      durationMins: durationMins || 25,
      fareBreakdown: fare.lines,
      total: fare.total,
      paymentMethod: payment,
      paymentStatus,
      customer: activeCustomer,
    });

    setSubmitting(false);
    if (result.ok) {
      // Record booking into Admin Store
      useAdminDataStore.getState().addBooking(result.data);
      onConfirmed(result.data);
      notify('success', `Booking ${result.data.reference} confirmed`, result.message);
    } else {
      notify('error', 'Booking could not be completed', result.message);
    }
  };

  const submit = () => {
    if (payment === 'card-online') {
      setShowPayment(true);
      return;
    }
    void finalise('pay-on-arrival');
  };

  const stepper = (label: string, value: number, set: (n: number) => void, max: number, min = 0) => (
    <div className="flex items-center justify-between rounded-xl border border-line bg-white px-3 py-2 sm:px-4 sm:py-2.5 shadow-sm">
      <span className="text-xs sm:text-fluid-xs text-ink-soft font-medium">{label}</span>
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          aria-label={`Fewer ${label}`}
          onClick={() => set(Math.max(min, value - 1))}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-line text-ink-soft transition hover:border-gold-deep/45 hover:text-gold-ink active:scale-95"
        >
          <Minus className="h-3 w-3" />
        </button>
        <span className="w-5 text-center text-xs sm:text-fluid-sm font-semibold text-ink">{value}</span>
        <button
          type="button"
          aria-label={`More ${label}`}
          onClick={() => set(Math.min(max, value + 1))}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-line text-ink-soft transition hover:border-gold-deep/45 hover:text-gold-ink active:scale-95"
        >
          <Plus className="h-3 w-3" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full min-w-0 max-w-full space-y-5 sm:space-y-6">
      {/* Fast route picker */}
      <section className="w-full min-w-0 max-w-full">
        <p className="field-label">Start from a published Melbourne route</p>
        <div className="relative">
          <div
            ref={routeScrollerRef}
            onScroll={updateRouteFade}
            className="w-full min-w-0 max-w-full flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-line scrollbar-track-transparent snap-x snap-mandatory touch-pan-x"
          >
            {mockRoutes.slice(0, 8).map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => applyRoute(r.id)}
                className={`snap-start shrink-0 rounded-xl border px-3 py-2 sm:px-3.5 sm:py-2.5 text-left transition active:scale-[0.98] ${
                  selectedRouteId === r.id
                    ? 'border-gold-deep bg-gold/12 shadow-sm'
                    : 'border-line bg-white hover:border-gold-deep/35'
                }`}
              >
                <span className="block whitespace-nowrap text-xs sm:text-fluid-xs font-semibold text-ink">
                  {r.shortLabel}
                </span>
                <span className="mt-0.5 block text-[0.68rem] sm:text-fluid-xs font-bold gold-text">
                  from {currency(r.fixedPrice)}
                </span>
              </button>
            ))}
            <div className="shrink-0 snap-none w-px" aria-hidden="true" />
          </div>
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white to-transparent transition-opacity duration-200 ${
              routeFade.left ? 'opacity-100' : 'opacity-0'
            }`}
          />
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white to-transparent transition-opacity duration-200 ${
              routeFade.right ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </div>
      </section>

      {/* Addresses */}
      <section className="relative space-y-2.5 sm:space-y-3">
        <AddressInput
          id="fixed-pickup"
          label="Pickup"
          placeholder="Terminal 2, Melbourne Airport"
          value={pickup}
          onChange={setPickup}
          tone="gold"
        />
        <div className="flex justify-end">
          <button
            type="button"
            onClick={swapEnds}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs text-ink-muted transition hover:bg-paper-alt hover:text-gold-ink active:scale-95"
          >
            <ArrowUpDown className="h-3.5 w-3.5" /> Reverse the trip
          </button>
        </div>
        <AddressInput
          id="fixed-dropoff"
          label="Destination"
          placeholder="Collins Street, Melbourne CBD"
          value={dropoff}
          onChange={setDropoff}
          tone="silver"
        />
      </section>

      {/* Schedule + passengers */}
      <section className="grid gap-2.5 sm:gap-3 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="fixed-when">
            Pickup date and time
          </label>
          <input
            id="fixed-when"
            type="datetime-local"
            value={scheduledFor}
            onChange={(e) => setScheduledFor(e.target.value)}
            className="w-full text-xs sm:text-fluid-sm"
          />
        </div>
        <div>
          <label className="field-label" htmlFor="fixed-pax">
            Passengers
          </label>
          <select
            id="fixed-pax"
            value={passengers}
            onChange={(e) => setPassengers(Number(e.target.value))}
            className="w-full text-xs sm:text-fluid-sm"
          >
            {Array.from({ length: 11 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n} passenger{n > 1 ? 's' : ''}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Vehicle */}
      <section>
        <p className="field-label">Vehicle class</p>
        <VehicleSelector
          value={vehicleId}
          onChange={setVehicle}
          distanceKm={distanceKm}
          fixedPrice={route?.fixedPrice}
          requiredSeats={passengers}
        />
      </section>

      {/* Add-ons */}
      <section className="space-y-2.5 sm:space-y-3">
        <p className="field-label">Add-ons</p>
        <div className="grid gap-2 sm:gap-2.5 sm:grid-cols-2">
          {stepper('Booster seats', addons.boosterSeats, (n) => setAddons({ ...addons, boosterSeats: n }), 4)}
          {stepper('Baby capsules', addons.babyCapsules, (n) => setAddons({ ...addons, babyCapsules: n }), 3)}
        </div>
        <div className="grid gap-2 sm:gap-2.5 sm:grid-cols-2">
          <label className="flex cursor-pointer items-center gap-2.5 sm:gap-3 rounded-xl border border-line bg-white px-3 py-2.5 sm:px-4 sm:py-3 shadow-sm active:bg-paper-alt">
            <input
              type="checkbox"
              checked={addons.meetAndGreet}
              onChange={(e) => setAddons({ ...addons, meetAndGreet: e.target.checked })}
              className="h-4 w-4 accent-[#F59E0B]"
            />
            <span className="text-xs sm:text-fluid-xs text-ink-soft">Meet &amp; greet at arrivals</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2.5 sm:gap-3 rounded-xl border border-line bg-white px-3 py-2.5 sm:px-4 sm:py-3 shadow-sm active:bg-paper-alt">
            <input
              type="checkbox"
              checked={addons.extraStop}
              onChange={(e) => setAddons({ ...addons, extraStop: e.target.checked })}
              className="h-4 w-4 accent-[#F59E0B]"
            />
            <span className="text-xs sm:text-fluid-xs text-ink-soft">One extra stop en route</span>
          </label>
        </div>
        <input
          placeholder="Flight or terminal info (optional, e.g. QF94 / Terminal 2)"
          value={addons.flightNumber}
          onChange={(e) => setAddons({ ...addons, flightNumber: e.target.value.toUpperCase() })}
          className="w-full text-xs sm:text-fluid-sm"
        />
      </section>

      {/* Passenger details */}
      <section className="space-y-2.5 sm:space-y-3">
        <p className="field-label">Who is travelling</p>
        <input
          placeholder="Full name"
          value={customer.name}
          onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
          className="w-full text-xs sm:text-fluid-sm"
        />
        <div className="grid gap-2.5 sm:gap-3 sm:grid-cols-2">
          <input
            type="tel"
            placeholder="Mobile number"
            value={customer.phone}
            onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
            className="w-full text-xs sm:text-fluid-sm"
          />
          <input
            type="email"
            placeholder="Email for confirmation"
            value={customer.email}
            onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
            className="w-full text-xs sm:text-fluid-sm"
          />
        </div>
      </section>

      {/* Payment */}
      <section>
        <p className="field-label">How you would like to pay</p>
        <div className="grid gap-2 sm:gap-2.5 sm:grid-cols-2">
          {(
            [
              {
                id: 'card-online' as PaymentMethod,
                icon: CreditCard,
                title: 'Pay online now',
                sub: 'Card authorised, charged on trip',
              },
              {
                id: 'pay-driver' as PaymentMethod,
                icon: Banknote,
                title: 'Pay your driver',
                sub: 'In-cab EFTPOS, card or cash',
              },
            ]
          ).map((option) => {
            const active = payment === option.id;
            const Icon = option.icon;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setPayment(option.id)}
                className={`flex items-start gap-2.5 sm:gap-3 rounded-xl sm:rounded-2xl border p-3 sm:p-4 text-left transition active:scale-[0.99] ${
                  active
                    ? 'border-gold-deep bg-gold/10 ring-1 ring-gold-deep/50 shadow-sm'
                    : 'border-line bg-white hover:border-gold-deep/35'
                }`}
              >
                <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${active ? 'text-gold-deep' : 'text-ink-muted'}`} />
                <span className="min-w-0">
                  <span className="block text-xs sm:text-fluid-sm font-bold text-ink leading-tight">{option.title}</span>
                  <span className="mt-0.5 block text-[0.68rem] sm:text-fluid-xs text-ink-muted leading-tight">{option.sub}</span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Fare summary */}
      <AnimatePresence>
        {pickup && dropoff && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl sm:rounded-2xl border border-gold-deep/30 bg-gold/8 p-4 sm:p-5"
          >
            <div className="space-y-1.5 sm:space-y-2">
              {fare.lines.map((line) => (
                <div key={line.label} className="flex items-baseline justify-between gap-3 text-xs sm:text-fluid-xs">
                  <span className="text-ink-muted min-w-0 truncate">
                    {line.label}
                    {line.note && <span className="ml-1.5 text-[0.65rem] text-ink-muted">({line.note})</span>}
                  </span>
                  <span className="font-mono font-semibold text-ink shrink-0">{currency(line.amount)}</span>
                </div>
              ))}
            </div>
            <div className="hairline my-3 sm:my-4" />
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[0.62rem] sm:text-[0.65rem] uppercase tracking-crown text-ink-muted">Total, fixed</p>
                <p className="text-[0.68rem] sm:text-fluid-xs text-ink-muted">
                  {routing ? 'Measuring route…' : `${distanceKm.toFixed(1)} km · ${durationMins} min`}
                </p>
              </div>
              <p className="text-xl sm:text-fluid-stat font-extrabold gold-text">{currency(fare.total)}</p>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <button
        onClick={submit}
        disabled={submitting}
        className="btn-gold w-full min-h-[48px] py-3.5 sm:py-4 text-xs sm:text-fluid-base font-bold shadow-gold active:scale-[0.98]"
      >
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Confirming your ride…
          </>
        ) : (
          <>
            <Zap className="h-4 w-4" />
            {payment === 'card-online' ? 'Pay & confirm booking' : 'Confirm taxi booking'}
          </>
        )}
      </button>

      <p className="text-center text-[0.72rem] sm:text-fluid-xs text-ink-muted">
        Free cancellation up to 4 hours before pickup. No surge pricing, ever.
      </p>

      <PaymentModal
        open={showPayment}
        amount={fare.total}
        onClose={() => setShowPayment(false)}
        onPaid={() => {
          setShowPayment(false);
          void finalise('paid');
        }}
      />
    </div>
  );
}
