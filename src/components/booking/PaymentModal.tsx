import { useState } from 'react';
import { CreditCard, Loader2, Lock, ShieldCheck } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { processCardPayment } from '@/services/api';
import { currency } from '@/services/pricing';

interface PaymentModalProps {
  open: boolean;
  amount: number;
  onClose: () => void;
  onPaid: (last4: string) => void;
}

const formatCardNumber = (raw: string) =>
  raw
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(.{4})/g, '$1 ')
    .trim();

const formatExpiry = (raw: string) => {
  const digits = raw.replace(/\D/g, '').slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
};

export function PaymentModal({ open, amount, onClose, onPaid }: PaymentModalProps) {
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvc: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const pay = async () => {
    setBusy(true);
    setError('');
    const result = await processCardPayment(amount, card);
    setBusy(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    onPaid(result.data.last4);
  };

  return (
    <Modal
      open={open}
      onClose={busy ? () => undefined : onClose}
      eyebrow="Secure checkout"
      title={`Authorise ${currency(amount)}`}
      maxWidth="max-w-md"
    >
      <div className="mb-5 flex items-start gap-3 rounded-2xl border border-verified/25 bg-verified/[0.07] p-3.5">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-verified" />
        <p className="text-fluid-xs leading-relaxed text-ink-soft">
          We authorise the card now and capture only after your chauffeur completes the trip. Card
          details never touch our servers.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="field-label" htmlFor="pay-number">
            Card number
          </label>
          <div className="relative">
            <CreditCard className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gold-deep" />
            <input
              id="pay-number"
              inputMode="numeric"
              placeholder="4242 4242 4242 4242"
              value={card.number}
              onChange={(e) => setCard({ ...card, number: formatCardNumber(e.target.value) })}
              className="w-full pl-11 font-mono tracking-label"
            />
          </div>
        </div>

        <div>
          <label className="field-label" htmlFor="pay-name">
            Name on card
          </label>
          <input
            id="pay-name"
            placeholder="A. Chauffeur"
            value={card.name}
            onChange={(e) => setCard({ ...card, name: e.target.value })}
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="field-label" htmlFor="pay-expiry">
              Expiry
            </label>
            <input
              id="pay-expiry"
              inputMode="numeric"
              placeholder="09/29"
              value={card.expiry}
              onChange={(e) => setCard({ ...card, expiry: formatExpiry(e.target.value) })}
              className="w-full font-mono"
            />
          </div>
          <div>
            <label className="field-label" htmlFor="pay-cvc">
              CVC
            </label>
            <input
              id="pay-cvc"
              inputMode="numeric"
              placeholder="123"
              value={card.cvc}
              onChange={(e) => setCard({ ...card, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) })}
              className="w-full font-mono"
            />
          </div>
        </div>

        {error && (
          <p className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-fluid-xs text-red-200">
            {error}
          </p>
        )}

        <button onClick={pay} disabled={busy} className="btn-gold w-full">
          {busy ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Authorising…
            </>
          ) : (
            <>
              <Lock className="h-4 w-4" /> Pay {currency(amount)}
            </>
          )}
        </button>

        <p className="text-center text-fluid-xs text-ink-muted">
          Demonstration checkout. Any 16-digit number authorises successfully.
        </p>
      </div>
    </Modal>
  );
}
