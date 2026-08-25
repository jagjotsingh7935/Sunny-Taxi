import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CalendarClock, Car, Check, Download, MapPin, Phone } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { BRAND } from '@/data/brand';
import { currency } from '@/services/pricing';
import type { Booking } from '@/types';

interface ConfirmationModalProps {
  booking: Booking | null;
  onClose: () => void;
}

function celebrate() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const colors = ['#D4AF37', '#E5C07B', '#E5E7EB', '#A8862A'];
  confetti({ particleCount: 90, spread: 74, origin: { y: 0.32 }, colors, scalar: 0.9 });
  window.setTimeout(
    () => confetti({ particleCount: 55, angle: 60, spread: 62, origin: { x: 0, y: 0.5 }, colors }),
    180,
  );
  window.setTimeout(
    () => confetti({ particleCount: 55, angle: 120, spread: 62, origin: { x: 1, y: 0.5 }, colors }),
    320,
  );
}

function tripSummaryText(booking: Booking): string {
  const when = new Date(booking.scheduledFor).toLocaleString('en-AU', {
    dateStyle: 'full',
    timeStyle: 'short',
  });
  const lines = booking.fareBreakdown
    .map((l) => `  ${l.label.padEnd(38, '.')} ${currency(l.amount)}`)
    .join('\n');

  return `${BRAND.fullName}
${BRAND.accreditation}

TRIP SUMMARY — ${booking.reference}
${'='.repeat(56)}

Pickup       ${booking.pickup.label}
Destination  ${booking.dropoff.label}
Scheduled    ${when}
Vehicle      ${booking.vehicleName}
Passengers   ${booking.passengers}
Distance     ${booking.distanceKm.toFixed(1)} km (approx. ${booking.durationMins} min)
${booking.addons.flightNumber ? `Flight       ${booking.addons.flightNumber}\n` : ''}
FARE
${lines}
${'-'.repeat(56)}
  TOTAL${' '.repeat(33)} ${currency(booking.total)}
  ${booking.paymentStatus === 'paid' ? 'Paid online — nothing to pay the driver.' : 'Pay the driver by card, EFTPOS, Cabcharge or cash.'}

PASSENGER
${booking.customer.name} · ${booking.customer.phone} · ${booking.customer.email}

24/7 dispatch: ${BRAND.dispatchPhone}
Your driver's name and vehicle details are confirmed prior to pickup.
`;
}

function downloadSummary(booking: Booking) {
  const blob = new Blob([tripSummaryText(booking)], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${booking.reference}-trip-summary.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function ConfirmationModal({ booking, onClose }: ConfirmationModalProps) {
  useEffect(() => {
    if (booking) celebrate();
  }, [booking]);

  if (!booking) return null;

  const when = new Date(booking.scheduledFor).toLocaleString('en-AU', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <Modal open={Boolean(booking)} onClose={onClose} eyebrow="Booking confirmed" title="Your ride is locked in">
      <div className="flex flex-col items-center text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold-gradient">
          <Check className="h-7 w-7 text-obsidian" strokeWidth={3} />
        </span>
        <p className="mt-4 text-fluid-xs uppercase tracking-crown text-ink-muted">Booking reference</p>
        <p className="mt-1 font-mono text-fluid-xl font-bold tracking-label gold-text">
          {booking.reference}
        </p>
      </div>

      <div className="mt-6 space-y-3 rounded-2xl border border-line bg-white p-5">
        <div className="flex gap-3">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep" />
          <div className="min-w-0 text-fluid-sm">
            <p className="text-ink">{booking.pickup.label}</p>
            <p className="mt-1 text-ink-muted">to {booking.dropoff.label}</p>
          </div>
        </div>
        <div className="hairline" />
        <div className="grid gap-3 text-fluid-sm sm:grid-cols-2">
          <p className="flex items-center gap-2 text-ink-soft">
            <CalendarClock className="h-4 w-4 text-gold-deep" /> {when}
          </p>
          <p className="flex items-center gap-2 text-ink-soft">
            <Car className="h-4 w-4 text-gold-deep" /> {booking.vehicleName}
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-2 rounded-2xl border border-line bg-gold/8 p-5">
        {booking.fareBreakdown.map((line) => (
          <div key={line.label} className="flex items-baseline justify-between gap-4 text-fluid-xs">
            <span className="text-ink-muted">{line.label}</span>
            <span className="font-mono text-white/75">{currency(line.amount)}</span>
          </div>
        ))}
        <div className="hairline my-2" />
        <div className="flex items-baseline justify-between">
          <span className="text-fluid-sm font-semibold text-ink">
            {booking.paymentStatus === 'paid' ? 'Paid online' : 'Pay your driver'}
          </span>
          <span className="text-fluid-xl font-bold gold-text">{currency(booking.total)}</span>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <button onClick={() => downloadSummary(booking)} className="btn-ghost w-full">
          <Download className="h-4 w-4" /> Download trip summary
        </button>
        <a href={`tel:${BRAND.dispatchPhoneDial}`} className="btn-gold w-full">
          <Phone className="h-4 w-4" /> Call dispatch
        </a>
      </div>

      <p className="mt-5 text-center text-fluid-xs leading-relaxed text-ink-muted">
        A confirmation has been recorded for {booking.customer.email}. Your driver details and pickup
        updates are confirmed prior to your journey.
      </p>
    </Modal>
  );
}
