import { SURCHARGES } from '@/data/brand';
import { getVehicle } from '@/data/mockVehicles';
import type { BookingAddons, FareLine, PaymentMethod, VehicleClassId } from '@/types';

export const currency = (value: number): string =>
  new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);

const round = (n: number) => Math.round(n * 100) / 100;

interface FareInput {
  vehicleId: VehicleClassId;
  distanceKm: number;
  fixedPrice?: number;
  addons?: Partial<BookingAddons>;
  scheduledFor?: string;
  paymentMethod?: PaymentMethod;
  includeTolls?: boolean;
}

export interface FareResult {
  lines: FareLine[];
  subtotal: number;
  total: number;
}

function isLateNight(iso?: string): boolean {
  if (!iso) return false;
  const hour = new Date(iso).getHours();
  return Number.isFinite(hour) && (hour >= 22 || hour < 6);
}

/** Meter-free pricing: a published fixed fare wins, otherwise distance-based. */
export function baseFareFor(vehicleId: VehicleClassId, distanceKm: number, fixedPrice?: number) {
  const vehicle = getVehicle(vehicleId);
  if (typeof fixedPrice === 'number') {
    return round(fixedPrice * vehicle.multiplier);
  }
  const computed = vehicle.baseFare + distanceKm * vehicle.perKm;
  return round(Math.max(vehicle.minimumFare, computed));
}

export function calculateFare(input: FareInput): FareResult {
  const {
    vehicleId,
    distanceKm,
    fixedPrice,
    addons,
    scheduledFor,
    paymentMethod = 'pay-driver',
    includeTolls = true,
  } = input;

  const vehicle = getVehicle(vehicleId);
  const lines: FareLine[] = [];

  const base = baseFareFor(vehicleId, distanceKm, fixedPrice);
  lines.push({
    label:
      typeof fixedPrice === 'number'
        ? `${vehicle.name} — fixed route fare`
        : `${vehicle.name} — ${distanceKm.toFixed(1)} km`,
    amount: base,
    note: typeof fixedPrice === 'number' ? 'Published price, locked at booking' : undefined,
  });

  if (addons?.boosterSeats) {
    lines.push({
      label: `Booster seat × ${addons.boosterSeats}`,
      amount: round(addons.boosterSeats * SURCHARGES.boosterSeat),
    });
  }

  if (addons?.babyCapsules) {
    lines.push({
      label: `Baby capsule × ${addons.babyCapsules}`,
      amount: round(addons.babyCapsules * SURCHARGES.babyCapsule),
    });
  }

  if (addons?.meetAndGreet) {
    lines.push({
      label: 'Meet and greet at arrivals',
      amount: SURCHARGES.meetAndGreet,
      note: 'Name board, terminal parking, luggage assistance',
    });
  }

  if (addons?.extraStop) {
    lines.push({ label: 'Additional stop en route', amount: SURCHARGES.extraStop });
  }

  if (includeTolls && distanceKm > 12) {
    lines.push({ label: 'CityLink tolls', amount: SURCHARGES.tolls, note: 'Passed through at cost' });
  }

  let subtotal = round(lines.reduce((acc, l) => acc + l.amount, 0));

  if (isLateNight(scheduledFor)) {
    const late = round(subtotal * SURCHARGES.lateNightPercent);
    lines.push({
      label: 'Late night service (10pm – 6am)',
      amount: late,
      note: 'Applies to the fare, never a surge multiplier',
    });
    subtotal = round(subtotal + late);
  }

  let total = subtotal;
  if (paymentMethod === 'card-online') {
    const fee = round(subtotal * SURCHARGES.cardFeePercent);
    lines.push({ label: 'Card processing (1.4%)', amount: fee });
    total = round(subtotal + fee);
  }

  return { lines, subtotal, total: round(total) };
}

/** Range shown on a custom quote before dispatch confirms the fare. */
export function indicativeRange(vehicleId: VehicleClassId, distanceKm: number) {
  const mid = baseFareFor(vehicleId, distanceKm);
  return {
    from: Math.round(mid * 0.92),
    to: Math.round(mid * 1.12),
  };
}
