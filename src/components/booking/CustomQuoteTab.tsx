import { useMemo, useState } from 'react';
import { Loader2, Mail, Send } from 'lucide-react';
import { AddressInput } from './AddressInput';
import { Modal } from '@/components/ui/Modal';
import { mockVehicles } from '@/data/mockVehicles';
import { createQuote } from '@/services/api';
import { currency, indicativeRange } from '@/services/pricing';
import { useBookingStore } from '@/store/bookingStore';
import { useAdminDataStore } from '@/store/adminDataStore';
import { useToast } from '@/hooks/useToast';
import { STORAGE_KEYS, storage } from '@/services/storage';
import type { BabySeatType, CustomerDetails, Place, QuoteRequest, VehicleClassId } from '@/types';

const babySeatOptions: { value: BabySeatType; label: string }[] = [
  { value: 'none', label: 'No child restraint needed' },
  { value: 'rear-facing-capsule', label: 'Rear-facing baby capsule (0–6 months)' },
  { value: 'forward-facing-toddler', label: 'Forward-facing toddler seat (6 months–4 years)' },
  { value: 'booster', label: 'Booster seat (4–7 years)' },
];

const occasions = [
  'Airport transfer',
  'Corporate / client travel',
  'Winery or day tour',
  'Wedding or event',
  'Long-distance regional trip',
  'Cruise terminal transfer',
  'Something else',
];

function defaultSchedule(): string {
  const d = new Date(Date.now() + 48 * 60 * 60 * 1000);
  d.setHours(9, 0, 0, 0);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T09:00`;
}

export function CustomQuoteTab() {
  const { notify } = useToast();
  const { pickup, dropoff, setPickup, setDropoff, geometry, routing } = useBookingStore();

  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [babySeat, setBabySeat] = useState<BabySeatType>('none');
  const [carryOnBags, setCarryOnBags] = useState(2);
  const [largeBags, setLargeBags] = useState(2);
  const [vehicleId, setVehicleId] = useState<VehicleClassId | 'recommend'>('recommend');
  const [scheduledFor, setScheduledFor] = useState(defaultSchedule());
  const [occasion, setOccasion] = useState(occasions[0]);
  const [notes, setNotes] = useState('');
  const [customer, setCustomer] = useState<CustomerDetails>(() =>
    storage.read<CustomerDetails>(STORAGE_KEYS.customer, { name: '', email: '', phone: '' }),
  );
  const [submitting, setSubmitting] = useState(false);
  const [receipt, setReceipt] = useState<QuoteRequest | null>(null);

  const totalPassengers = adults + children;

  /** Smallest class that seats the party and swallows the luggage. */
  const recommended = useMemo<VehicleClassId>(() => {
    const fit = mockVehicles.find(
      (v) => v.passengers >= totalPassengers && v.largeSuitcases >= largeBags,
    );
    return (fit ?? mockVehicles[mockVehicles.length - 1]).id;
  }, [totalPassengers, largeBags]);

  const resolvedVehicle: VehicleClassId = vehicleId === 'recommend' ? recommended : vehicleId;
  const distanceKm = geometry?.distanceKm ?? 0;
  const range = useMemo(
    () => indicativeRange(resolvedVehicle, distanceKm),
    [resolvedVehicle, distanceKm],
  );

  const submit = async () => {
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

    const result = await createQuote({
      type: 'custom-quote',
      pickup: activePickup,
      dropoff: activeDropoff,
      scheduledFor: new Date(scheduledFor).toISOString(),
      adults,
      children,
      babySeat,
      carryOnBags,
      largeBags,
      vehicleId,
      distanceKm: distanceKm || 25,
      durationMins: geometry?.durationMins ?? 25,
      indicativeFrom: range.from,
      indicativeTo: range.to,
      customer: activeCustomer,
      occasion,
      notes,
    });

    setSubmitting(false);
    if (result.ok) {
      // Record into Admin Inquiries
      useAdminDataStore.getState().addQuote(result.data);
      setReceipt(result.data);
      notify('success', `Quote ${result.data.reference} received`, result.message);
    } else {
      notify('error', 'Quote could not be sent', result.message);
    }
  };

  return (
    <div className="w-full min-w-0 max-w-full space-y-4 sm:space-y-6">
      <p className="rounded-xl sm:rounded-2xl border border-line bg-white p-3.5 sm:p-4 text-[0.72rem] sm:text-fluid-xs leading-relaxed text-ink-muted shadow-sm">
        For custom trips, regional Victorian journeys, group tours, or wheelchair-accessible travel.
        Tell us what you need and we reply with a fixed price promptly.
      </p>

      <section className="space-y-2.5 sm:space-y-3">
        <AddressInput
          id="quote-pickup"
          label="Pickup"
          placeholder="Where should we collect you?"
          value={pickup}
          onChange={setPickup}
          tone="gold"
        />
        <AddressInput
          id="quote-dropoff"
          label="Destination"
          placeholder="Where are you heading?"
          value={dropoff}
          onChange={setDropoff}
          tone="silver"
        />
      </section>

      <section>
        <label className="field-label" htmlFor="quote-when">
          When do you need the vehicle?
        </label>
        <input
          id="quote-when"
          type="datetime-local"
          value={scheduledFor}
          onChange={(e) => setScheduledFor(e.target.value)}
          className="w-full text-xs sm:text-fluid-sm"
        />
      </section>

      <section className="grid gap-2.5 sm:gap-3 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="quote-adults">
            Adults
          </label>
          <select
            id="quote-adults"
            value={adults}
            onChange={(e) => setAdults(Number(e.target.value))}
            className="w-full text-xs sm:text-fluid-sm"
          >
            {Array.from({ length: 11 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n} adult{n > 1 ? 's' : ''}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="field-label" htmlFor="quote-children">
            Children
          </label>
          <select
            id="quote-children"
            value={children}
            onChange={(e) => setChildren(Number(e.target.value))}
            className="w-full text-xs sm:text-fluid-sm"
          >
            {[0, 1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>
                {n === 0 ? 'No children' : `${n} child${n > 1 ? 'ren' : ''}`}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section>
        <label className="field-label" htmlFor="quote-seat">
          Child restraint
        </label>
        <select
          id="quote-seat"
          value={babySeat}
          onChange={(e) => setBabySeat(e.target.value as BabySeatType)}
          className="w-full text-xs sm:text-fluid-sm"
        >
          {babySeatOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <p className="mt-1 text-[0.68rem] sm:text-fluid-xs text-ink-muted">
          Child restraints fitted and checked before arrival on request.
        </p>
      </section>

      <section className="grid gap-2.5 sm:gap-3 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="quote-carryon">
            Carry-on bags
          </label>
          <select
            id="quote-carryon"
            value={carryOnBags}
            onChange={(e) => setCarryOnBags(Number(e.target.value))}
            className="w-full text-xs sm:text-fluid-sm"
          >
            {Array.from({ length: 9 }, (_, i) => i).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="field-label" htmlFor="quote-large">
            Large suitcases
          </label>
          <select
            id="quote-large"
            value={largeBags}
            onChange={(e) => setLargeBags(Number(e.target.value))}
            className="w-full text-xs sm:text-fluid-sm"
          >
            {Array.from({ length: 11 }, (_, i) => i).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="grid gap-2.5 sm:gap-3 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="quote-vehicle">
            Vehicle class
          </label>
          <select
            id="quote-vehicle"
            value={vehicleId}
            onChange={(e) => setVehicleId(e.target.value as VehicleClassId | 'recommend')}
            className="w-full text-xs sm:text-fluid-sm"
          >
            <option value="recommend">Recommend one for me</option>
            {mockVehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="field-label" htmlFor="quote-occasion">
            Trip type
          </label>
          <select
            id="quote-occasion"
            value={occasion}
            onChange={(e) => setOccasion(e.target.value)}
            className="w-full text-xs sm:text-fluid-sm"
          >
            {occasions.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
      </section>

      {vehicleId === 'recommend' && (
        <p className="chip-gold text-[0.72rem] sm:text-fluid-xs">
          Based on {totalPassengers} passenger{totalPassengers > 1 ? 's' : ''} and {largeBags} large
          bag{largeBags === 1 ? '' : 's'}, we recommend our{' '}
          <strong className="text-ink">{mockVehicles.find((v) => v.id === recommended)?.name}</strong>.
        </p>
      )}

      <section className="space-y-2.5 sm:space-y-3">
        <p className="field-label">How we reach you</p>
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
            placeholder="Email address"
            value={customer.email}
            onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
            className="w-full text-xs sm:text-fluid-sm"
          />
        </div>
        <textarea
          rows={3}
          placeholder="Anything else? Multiple stops, wheelchair assistance, baby seats, return trip details…"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full resize-none text-xs sm:text-fluid-sm"
        />
      </section>

      {pickup && dropoff && distanceKm > 0 && (
        <section className="rounded-xl sm:rounded-2xl border border-gold-deep/30 bg-gold/8 p-4 sm:p-5">
          <p className="text-[0.62rem] sm:text-[0.65rem] uppercase tracking-crown text-ink-muted">Indicative fare range</p>
          <p className="mt-1 text-xl sm:text-fluid-stat font-bold gold-text">
            {currency(range.from)} – {currency(range.to)}
          </p>
          <p className="mt-1.5 text-[0.68rem] sm:text-fluid-xs text-ink-muted">
            {routing
              ? 'Measuring route…'
              : `${distanceKm.toFixed(1)} km · about ${geometry?.durationMins ?? 0} mins. Dispatch confirms one fixed upfront price.`}
          </p>
        </section>
      )}

      <button
        onClick={submit}
        disabled={submitting}
        className="btn-gold w-full min-h-[48px] py-3.5 sm:py-4 text-xs sm:text-fluid-base font-bold shadow-gold active:scale-[0.98]"
      >
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Sending to dispatch…
          </>
        ) : (
          <>
            <Send className="h-4 w-4" /> Request fixed quote
          </>
        )}
      </button>

      <Modal
        open={Boolean(receipt)}
        onClose={() => setReceipt(null)}
        eyebrow="Quote received"
        title="Dispatch is on it"
        maxWidth="max-w-lg"
      >
        {receipt && (
          <div className="space-y-5">
            <div className="rounded-2xl border border-gold-deep/30 bg-gold/8 p-5 text-center">
              <p className="text-[0.65rem] uppercase tracking-crown text-ink-muted">Tracking reference</p>
              <p className="mt-1 font-mono text-fluid-xl font-bold tracking-label gold-text">
                {receipt.reference}
              </p>
            </div>
            <div className="space-y-2 text-fluid-sm text-ink-soft">
              <p>
                <span className="text-ink-muted">Trip </span>
                {receipt.pickup.label} → {receipt.dropoff.label}
              </p>
              <p>
                <span className="text-ink-muted">When </span>
                {new Date(receipt.scheduledFor).toLocaleString('en-AU', {
                  dateStyle: 'full',
                  timeStyle: 'short',
                })}
              </p>
              <p>
                <span className="text-ink-muted">Party </span>
                {receipt.adults} adult{receipt.adults > 1 ? 's' : ''}
                {receipt.children > 0 && `, ${receipt.children} child`}
                {receipt.children > 1 && 'ren'} · {receipt.largeBags} large bag
                {receipt.largeBags === 1 ? '' : 's'}
              </p>
            </div>
            <p className="flex items-start gap-3 rounded-2xl border border-line bg-white p-4 text-fluid-xs leading-relaxed text-ink-muted">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep" />
              A copy has been emailed to {receipt.customer.email}. A dispatcher replies with your
              fixed price within 30 minutes — quote the reference above if you call us first.
            </p>
            <button onClick={() => setReceipt(null)} className="btn-ghost w-full">
              Done
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
