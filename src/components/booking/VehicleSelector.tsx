import { Briefcase, Check, Users } from 'lucide-react';
import { mockVehicles } from '@/data/mockVehicles';
import { baseFareFor, currency } from '@/services/pricing';
import type { VehicleClassId } from '@/types';

interface VehicleSelectorProps {
  value: VehicleClassId;
  onChange: (id: VehicleClassId) => void;
  distanceKm: number;
  fixedPrice?: number;
  requiredSeats?: number;
}

export function VehicleSelector({
  value,
  onChange,
  distanceKm,
  fixedPrice,
  requiredSeats = 1,
}: VehicleSelectorProps) {
  return (
    <div className="w-full min-w-0 max-w-full grid gap-2 sm:gap-2.5 sm:grid-cols-2">
      {mockVehicles.map((vehicle) => {
        const selected = vehicle.id === value;
        const tooSmall = vehicle.passengers < requiredSeats;
        const price = baseFareFor(vehicle.id, distanceKm, fixedPrice);

        return (
          <button
            key={vehicle.id}
            type="button"
            disabled={tooSmall}
            onClick={() => onChange(vehicle.id)}
            aria-pressed={selected}
            className={`w-full min-w-0 group relative rounded-xl sm:rounded-2xl border p-3 sm:p-4 text-left transition-all duration-200 active:scale-[0.99] ${
              selected
                ? 'border-gold-deep bg-gold/10 shadow-sm ring-1 ring-gold-deep/50'
                : 'border-line bg-white hover:border-gold-deep/45 hover:bg-paper-alt/60'
            } ${tooSmall ? 'cursor-not-allowed opacity-40' : ''}`}
          >
            {selected && (
              <span className="absolute right-2.5 top-2.5 sm:right-3 sm:top-3 flex h-4.5 w-4.5 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-gold-gradient shadow-sm">
                <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-obsidian" strokeWidth={3} />
              </span>
            )}

            <p className="pr-6 text-xs sm:text-fluid-sm font-bold text-ink leading-tight truncate">{vehicle.name}</p>
            <p className="mt-0.5 text-[0.68rem] sm:text-fluid-xs text-ink-muted leading-tight truncate">{vehicle.tagline}</p>

            <div className="mt-2.5 sm:mt-3 flex items-center gap-3 text-[0.68rem] sm:text-fluid-xs text-ink-muted">
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gold-deep" />
                {vehicle.passengers}
              </span>
              <span className="flex items-center gap-1">
                <Briefcase className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gold-deep" />
                {vehicle.largeSuitcases}
              </span>
            </div>

            <p className="mt-2 sm:mt-3 text-base sm:text-fluid-lg font-bold gold-text">
              {distanceKm > 0 || fixedPrice ? currency(price) : '—'}
            </p>
            {tooSmall && <p className="mt-1 text-[0.65rem] font-medium text-red-600">Not enough seats</p>}
          </button>
        );
      })}
    </div>
  );
}
