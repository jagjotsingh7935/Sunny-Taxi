import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Baby, Briefcase, Check, Eye, Users, Wifi } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { mockVehicles } from '@/data/mockVehicles';
import { currency } from '@/services/pricing';
import { useBookingStore } from '@/store/bookingStore';
import type { Vehicle } from '@/types';

export function FleetShowcase() {
  const [active, setActive] = useState<Vehicle | null>(null);
  const setVehicle = useBookingStore((s) => s.setVehicle);

  return (
    <section className="shell section-y">
      <SectionHeading
        eyebrow="Our vehicle fleet"
        title="Sedans, 7-seaters &amp; maxi passenger vans"
        description="Spotless, air-conditioned, and fully accredited in Victoria. Choose by passenger numbers, luggage capacity, or special assistance needs."
      />

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {mockVehicles.map((vehicle) => (
          <motion.article
            key={vehicle.id}
            data-reveal
            whileHover={{ y: -6 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            className="card group flex flex-col overflow-hidden"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={vehicle.image}
                alt={`${vehicle.name} — ${vehicle.models[0]}`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/25 to-transparent" />
              {vehicle.badge && (
                <span className="chip-gold absolute left-3 top-3">{vehicle.badge}</span>
              )}
            </div>

            <div className="flex flex-1 flex-col p-5">
              <h3 className="text-fluid-base font-semibold text-ink">{vehicle.name}</h3>
              <p className="mt-1 text-fluid-xs text-ink-muted">{vehicle.tagline}</p>

              <div className="mt-4 flex items-center gap-4 text-fluid-xs text-ink-muted">
                <span className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-gold-deep" /> {vehicle.passengers}
                </span>
                <span className="flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5 text-gold-deep" /> {vehicle.largeSuitcases}
                </span>
                {vehicle.wifi && <Wifi className="h-3.5 w-3.5 text-gold-deep" />}
                {vehicle.babySeatCompatible && <Baby className="h-3.5 w-3.5 text-gold-deep" />}
              </div>

              <p className="mt-4 text-fluid-sm text-ink-muted">
                from <span className="text-fluid-lg font-bold gold-text">{currency(vehicle.minimumFare)}</span>
              </p>

              <button
                onClick={() => setActive(vehicle)}
                className="btn-ghost mt-5 w-full px-4 py-2.5 text-fluid-xs"
              >
                <Eye className="h-3.5 w-3.5" /> Specifications
              </button>
            </div>
          </motion.article>
        ))}
      </div>

      <Modal
        open={Boolean(active)}
        onClose={() => setActive(null)}
        eyebrow={active?.tagline}
        title={active?.name}
      >
        {active && (
          <div className="space-y-6">
            <div className="overflow-hidden rounded-2xl border border-line">
              <img
                src={active.image}
                alt={active.name}
                className="aspect-[16/9] w-full object-cover"
              />
            </div>

            <p className="text-fluid-sm leading-relaxed text-ink-soft">{active.description}</p>

            <div>
              <p className="eyebrow mb-3">Typical vehicles</p>
              <div className="flex flex-wrap gap-2">
                {active.models.map((m) => (
                  <span key={m} className="chip">
                    {m}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: 'Passengers', value: active.passengers },
                { label: 'Large cases', value: active.largeSuitcases },
                { label: 'Carry-on', value: active.carryOn },
                { label: 'From', value: currency(active.minimumFare) },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-line bg-white p-4 text-center"
                >
                  <p className="text-fluid-xl font-bold text-ink">{stat.value}</p>
                  <p className="mt-1 text-[0.65rem] uppercase tracking-label text-ink-muted">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="grid gap-2.5 sm:grid-cols-2">
              {[
                ...active.features,
                active.wifi ? 'Onboard WiFi included' : 'WiFi on request',
                active.tintedGlass ? 'Tinted privacy glass' : 'Standard glazing',
                active.babySeatCompatible ? 'Baby capsule and booster compatible' : 'No child restraints',
              ].map((feature) => (
                <p key={feature} className="flex items-start gap-2.5 text-fluid-xs text-ink-muted">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-verified" />
                  {feature}
                </p>
              ))}
            </div>

            <Link
              to="/booking"
              onClick={() => {
                setVehicle(active.id);
                setActive(null);
              }}
              className="btn-gold w-full"
            >
              Book the {active.name}
            </Link>
          </div>
        )}
      </Modal>
    </section>
  );
}
