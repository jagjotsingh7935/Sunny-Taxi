import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, MapPinned, Route as RouteIcon, Zap } from 'lucide-react';
import { AddressInput } from '@/components/booking/AddressInput';
import { mockRoutes } from '@/data/mockRoutes';
import { mockVehicles } from '@/data/mockVehicles';
import { baseFareFor, currency } from '@/services/pricing';
import { useBookingStore, type BookingTab } from '@/store/bookingStore';
import type { VehicleClassId } from '@/types';

function defaultSchedule(): string {
  const d = new Date(Date.now() + 3 * 60 * 60 * 1000);
  d.setMinutes(Math.ceil(d.getMinutes() / 15) * 15, 0, 0);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(
    d.getMinutes(),
  )}`;
}

const tabs: { id: BookingTab; label: string; icon: typeof Zap }[] = [
  { id: 'fixed', label: 'Fixed route', icon: Zap },
  { id: 'custom', label: 'Quote on map', icon: MapPinned },
];

/**
 * Hero-sized booking entry point. It captures only what a visitor can answer in ten
 * seconds, writes it to the shared store, and hands off to /booking for the rest.
 */
export function QuickBookWidget() {
  const navigate = useNavigate();
  const {
    tab,
    setTab,
    pickup,
    dropoff,
    setPickup,
    setDropoff,
    applyRoute,
    selectedRouteId,
    vehicleId,
    setVehicle,
    geometry,
  } = useBookingStore();

  const [routeId, setRouteId] = useState(mockRoutes[0].id);
  const [when, setWhen] = useState(defaultSchedule());

  const route = useMemo(() => mockRoutes.find((r) => r.id === routeId) ?? mockRoutes[0], [routeId]);
  const fixedPrice = baseFareFor(vehicleId, route.distanceKm, route.fixedPrice);

  const goFixed = () => {
    applyRoute(route.id);
    setTab('fixed');
    navigate('/booking');
  };

  const goCustom = () => {
    setTab('custom');
    navigate('/booking');
  };

  return (
    <div>
      {/* Tabs */}
      <div className="mb-5 grid grid-cols-2 gap-2 rounded-2xl border border-line bg-white p-1.5">
        {tabs.map(({ id, label, icon: Icon }) => {
          const active = tab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              aria-pressed={active}
              className="relative rounded-xl px-3 py-2.5"
            >
              {active && (
                <motion.span
                  layoutId="quickbook-tab-pill"
                  className="absolute inset-0 rounded-xl bg-gold-gradient"
                  transition={{ type: 'spring', stiffness: 340, damping: 30 }}
                />
              )}
              <span className="relative flex items-center justify-center gap-2">
                <Icon className={`h-3.5 w-3.5 ${active ? 'text-obsidian' : 'text-gold-deep'}`} />
                <span
                  className={`text-fluid-xs font-semibold ${active ? 'text-obsidian' : 'text-ink'}`}
                >
                  {label}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {tab === 'fixed' ? (
        <motion.div
          key="quick-fixed"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <div>
            <label className="field-label" htmlFor="quick-route">
              Where are you going?
            </label>
            <select
              id="quick-route"
              value={routeId}
              onChange={(e) => setRouteId(e.target.value)}
              className="w-full bg-white text-slate-900 font-bold border-slate-300 shadow-sm"
            >
              {mockRoutes.map((r) => (
                <option key={r.id} value={r.id} className="bg-white text-slate-900 font-semibold py-1">
                  {r.shortLabel}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="field-label" htmlFor="quick-when">
              Pickup time
            </label>
            <input
              id="quick-when"
              type="datetime-local"
              value={when}
              onChange={(e) => setWhen(e.target.value)}
              className="w-full bg-white text-slate-900 font-bold border-slate-300 shadow-sm"
            />
          </div>

          <div>
            <p className="field-label">Vehicle class</p>
            <div className="grid grid-cols-4 gap-1.5">
              {mockVehicles.map((v) => {
                const active = v.id === vehicleId;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setVehicle(v.id as VehicleClassId)}
                    title={v.name}
                    className={`rounded-xl border px-2 py-2.5 text-center transition ${
                      active
                        ? 'border-gold-deep bg-gold/15 shadow-sm ring-1 ring-gold-deep/40'
                        : 'border-slate-200 bg-white hover:border-gold-deep/35'
                    }`}
                  >
                    <span className="block text-[0.68rem] font-bold leading-tight text-slate-900">
                      {v.name.split(' ')[0]}
                    </span>
                    <span className="mt-0.5 block text-[9px] font-semibold text-slate-600">{v.passengers} seats</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-gold-deep/30 bg-gold/8 p-4">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[0.68rem] uppercase tracking-label text-slate-800 font-bold">
                  Fixed, all inclusive
                </p>
                <p className="mt-1 flex items-center gap-3 text-fluid-xs font-semibold text-slate-700">
                  <span className="flex items-center gap-1">
                    <RouteIcon className="h-3.5 w-3.5 text-gold-deep" /> {route.distanceKm} km
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-gold-deep" /> {route.durationMins} min
                  </span>
                </p>
              </div>
              <p className="text-fluid-stat font-extrabold gold-text">{currency(fixedPrice)}</p>
            </div>
          </div>

          <button onClick={goFixed} className="btn-gold w-full py-3.5">
            Continue to booking <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>
      ) : (
        <motion.div
          key="quick-custom"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            Enter your pickup &amp; drop-off locations to calculate distance, travel time, and view your route live.
          </p>

          <AddressInput
            id="quick-pickup"
            label="Pickup Location (Source / Starting Point)"
            placeholder="e.g. Melbourne Airport, Deanside, or street address"
            value={pickup}
            onChange={setPickup}
            tone="gold"
          />
          <AddressInput
            id="quick-dropoff"
            label="Destination (Drop-off Point)"
            placeholder="e.g. Collins Street, Melbourne CBD, or suburb"
            value={dropoff}
            onChange={setDropoff}
            tone="silver"
          />

          {geometry && pickup && dropoff && (
            <div className="rounded-2xl border border-gold-deep/30 bg-gold/8 p-4">
              <p className="text-[0.68rem] uppercase tracking-label text-slate-800 font-bold">Your trip estimate</p>
              <p className="mt-1 flex items-center gap-4 text-fluid-sm text-slate-900 font-bold">
                <span className="flex items-center gap-1.5">
                  <RouteIcon className="h-3.5 w-3.5 text-gold-deep" /> {geometry.distanceKm.toFixed(1)} km
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-gold-deep" /> {geometry.durationMins} min
                </span>
              </p>
            </div>
          )}

          <button onClick={goCustom} className="btn-gold w-full py-3.5">
            {pickup && dropoff ? 'Continue to quote' : 'Open the booking map'}
            <ArrowRight className="h-4 w-4" />
          </button>

          <p className="text-center text-fluid-xs text-slate-600 font-medium">
            Unlisted routes, multi-stop trips and future dates. Fixed price quoted promptly.
          </p>
        </motion.div>
      )}

      {selectedRouteId && tab === 'fixed' && (
        <p className="mt-3 text-center text-fluid-xs text-ink-muted">
          Route loaded — finish the details on the next screen.
        </p>
      )}
    </div>
  );
}
