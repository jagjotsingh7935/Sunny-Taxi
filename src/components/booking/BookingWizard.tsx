import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Zap } from 'lucide-react';
import { CustomQuoteTab } from './CustomQuoteTab';
import { FixedRouteTab } from './FixedRouteTab';
import { ConfirmationModal } from './ConfirmationModal';
import { useBookingStore, type BookingTab } from '@/store/bookingStore';
import type { Booking } from '@/types';

const tabs: {
  id: BookingTab;
  label: string;
  badge: string;
  icon: typeof Zap;
}[] = [
  { id: 'fixed', label: 'Fixed Route', badge: 'Instant Booking', icon: Zap },
  { id: 'custom', label: 'Custom Quote', badge: 'Custom Trip', icon: FileText },
];

export function BookingWizard({ compact = false }: { compact?: boolean }) {
  const { tab, setTab } = useBookingStore();
  const [confirmed, setConfirmed] = useState<Booking | null>(null);

  return (
    <div className={`w-full min-w-0 max-w-full overflow-hidden ${compact ? '' : 'card p-3.5 sm:p-6 lg:p-7'}`}>
      {/* Segmented Tab Switcher */}
      <div className="mb-5 sm:mb-6 grid grid-cols-2 gap-1.5 rounded-xl border border-line bg-paper-alt/80 p-1 w-full min-w-0">
        {tabs.map(({ id, label, badge, icon: Icon }) => {
          const active = tab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              aria-pressed={active}
              className={`relative flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 rounded-lg py-2.5 px-2 text-center transition-all duration-200 active:scale-[0.98] min-w-0 ${
                active
                  ? 'text-obsidian shadow-gold font-bold'
                  : 'text-ink-muted hover:text-ink font-medium'
              }`}
            >
              {active && (
                <motion.span
                  layoutId="booking-tab-pill"
                  className="absolute inset-0 rounded-lg bg-gold-gradient shadow-gold"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative z-10 flex items-center justify-center gap-1.5 min-w-0">
                <Icon className={`h-4 w-4 shrink-0 ${active ? 'text-obsidian' : 'text-gold-deep'}`} />
                <span className="text-xs sm:text-fluid-sm font-bold leading-none tracking-tight">
                  {label}
                </span>
              </span>
              <span
                className={`relative z-10 rounded-full px-2 py-0.5 text-[0.62rem] sm:text-[0.68rem] font-extrabold tracking-tight transition-colors ${
                  active
                    ? 'bg-obsidian/15 text-obsidian ring-1 ring-obsidian/20'
                    : 'bg-gold/15 text-gold-ink border border-gold-deep/30'
                }`}
              >
                {badge}
              </span>
            </button>
          );
        })}
      </div>

      <div className="w-full min-w-0 max-w-full">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="w-full min-w-0 max-w-full"
        >
          {tab === 'fixed' ? <FixedRouteTab onConfirmed={setConfirmed} /> : <CustomQuoteTab />}
        </motion.div>
      </div>

      <ConfirmationModal booking={confirmed} onClose={() => setConfirmed(null)} />
    </div>
  );
}
