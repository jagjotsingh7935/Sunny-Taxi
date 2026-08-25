import { useState } from 'react';
import { Clock, Loader2, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import { LuxuryMap } from '@/components/map/LuxuryMap';
import { BRAND, MELBOURNE_CENTER } from '@/data/brand';
import { mockSuburbs } from '@/data/mockSuburbs';
import { sendMessage } from '@/services/api';
import { useAdminDataStore } from '@/store/adminDataStore';
import { useToast } from '@/hooks/useToast';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const subjects = [
  'New booking enquiry',
  'Existing booking change',
  'Corporate account',
  'Wedding or event travel',
  'Lost property',
  'Feedback or complaint',
];

const regions = Array.from(new Set(mockSuburbs.map((s) => s.region)));

const office = {
  label: BRAND.address,
  suburb: 'Deanside',
  postcode: '3336',
  lat: -37.7478,
  lng: 144.7176,
};

export default function Contact() {
  const ref = useScrollReveal<HTMLDivElement>();
  const { notify } = useToast();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: subjects[0],
    message: '',
  });
  const [sending, setSending] = useState(false);
  const [sentRef, setSentRef] = useState<string | null>(null);

  const whatsappUrl = `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(
    'Hi Sunny Taxi Service, I have a question about a Melbourne taxi booking.',
  )}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name.trim().length < 2 || !/\S+@\S+\.\S+/.test(form.email) || form.message.trim().length < 10) {
      notify('info', 'A few details are missing', 'Name, a valid email and a short message.');
      return;
    }
    setSending(true);
    const result = await sendMessage(form);
    setSending(false);
    if (result.ok) {
      // Record into Admin Inquiries
      useAdminDataStore.getState().addMessage(result.data);
      setSentRef(result.data.reference);
      setForm({ name: '', email: '', phone: '', subject: subjects[0], message: '' });
      notify('success', 'Message sent', result.message);
    }
  };

  return (
    <div ref={ref} className="shell pb-16 pt-24 sm:pb-20 sm:pt-28">
      <header className="max-w-2xl">
        <span className="eyebrow">Contact dispatch</span>
        <h1 className="mt-3 text-fluid-h2">
          Someone answers, every hour of every day
        </h1>
        <p className="mt-3 text-fluid-sm leading-relaxed text-ink-muted">
          A real Melbourne dispatcher, not a queue. Call for anything time-critical, message us for
          everything else.
        </p>
      </header>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        {/* Contact channels */}
        <div className="space-y-4">
          <a
            href={`tel:${BRAND.dispatchPhoneDial}`}
            data-reveal
            className="card flex items-center gap-5 p-6 transition hover:border-gold-deep/45"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold-gradient">
              <Phone className="h-5 w-5 text-obsidian" />
            </span>
            <span>
              <span className="block text-fluid-xs uppercase tracking-label text-ink-muted">
                24/7 hotline
              </span>
              <span className="block text-fluid-xl font-bold text-ink">{BRAND.dispatchPhone}</span>
              <span className="block text-fluid-xs text-ink-muted">Tap to call dispatch now</span>
            </span>
          </a>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            data-reveal
            className="card flex items-center gap-5 p-6 transition hover:border-verified/40"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-verified/30 bg-verified/15">
              <MessageCircle className="h-5 w-5 text-verified" />
            </span>
            <span>
              <span className="block text-fluid-xs uppercase tracking-label text-ink-muted">
                WhatsApp
              </span>
              <span className="block text-fluid-base font-semibold text-ink">
                Chat with a dispatcher
              </span>
              <span className="block text-fluid-xs text-ink-muted">Typical reply under 3 minutes</span>
            </span>
          </a>

          <div data-reveal className="card space-y-4 p-6">
            <div>
              <span className="block text-fluid-xs uppercase tracking-label text-ink-muted">
                Operator &amp; Contact
              </span>
              <p className="text-fluid-base font-bold text-ink">{BRAND.owner}</p>
              <p className="text-fluid-xs text-ink-muted">Taxi &amp; Passenger Transport Services</p>
            </div>
            <div className="hairline" />
            <p className="flex items-start gap-3 text-fluid-sm text-ink-soft">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep" />
              <a href={`mailto:${BRAND.email}`} className="transition hover:text-gold-ink">
                {BRAND.email}
              </a>
            </p>
            <p className="flex items-start gap-3 text-fluid-sm text-ink-soft">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep" /> {BRAND.address}
            </p>
            <p className="flex items-start gap-3 text-fluid-sm text-ink-soft">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep" /> {BRAND.hours}
            </p>
          </div>

          <LuxuryMap
            pickup={office}
            dropoff={null}
            geometry={null}
            showOverlay={false}
            zoom={14}
            className="h-[240px]"
          />

          <div data-reveal className="card p-6">
            <p className="eyebrow mb-4">Where we operate</p>
            <div className="flex flex-wrap gap-2">
              {regions.map((r) => (
                <span key={r} className="chip">
                  {r}
                </span>
              ))}
            </div>
            <p className="mt-4 text-fluid-xs leading-relaxed text-ink-muted">
              Greater Melbourne plus regional Victoria on request — Geelong, Ballarat, Bendigo,
              Daylesford, the Peninsula and Phillip Island.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="card h-fit p-6 sm:p-8" data-reveal>
          <h2 className="text-fluid-h3">Send us a message</h2>
          <p className="mt-1.5 text-fluid-xs text-ink-muted">
            Dispatch replies within 30 minutes, day or night.
          </p>

          <div className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="field-label" htmlFor="c-name">
                  Name
                </label>
                <input
                  id="c-name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your full name"
                  className="w-full"
                />
              </div>
              <div>
                <label className="field-label" htmlFor="c-phone">
                  Mobile
                </label>
                <input
                  id="c-phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="04XX XXX XXX"
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <label className="field-label" htmlFor="c-email">
                Email
              </label>
              <input
                id="c-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="w-full"
              />
            </div>

            <div>
              <label className="field-label" htmlFor="c-subject">
                What is this about?
              </label>
              <select
                id="c-subject"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full"
              >
                {subjects.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="field-label" htmlFor="c-message">
                Message
              </label>
              <textarea
                id="c-message"
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Dates, addresses, passenger numbers — whatever helps us answer properly the first time."
                className="w-full resize-none"
              />
            </div>

            <button onClick={handleSubmit} disabled={sending} className="btn-gold w-full py-3.5">
              {sending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Sending…
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" /> Send message
                </>
              )}
            </button>

            {sentRef && (
              <p className="rounded-2xl border border-verified/30 bg-verified/10 px-4 py-3.5 text-fluid-xs leading-relaxed text-verified">
                Message sent. Your reference is{' '}
                <span className="font-mono font-bold">{sentRef}</span> — quote it if you call before
                we reply.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
