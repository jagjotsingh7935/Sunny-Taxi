import { Link } from 'react-router-dom';
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { BRAND } from '@/data/brand';
import { footerSuburbs } from '@/data/mockSuburbs';

const quickLinks = [
  { to: '/booking', label: 'Book a taxi' },
  { to: '/fleet-routes', label: 'Fleet and fixed fares' },
  { to: '/reviews', label: 'Customer reviews' },
  { to: '/about', label: 'About Sunny Taxi' },
  { to: '/contact', label: 'Contact dispatch' },
  { to: '/admin/login', label: '🔒 Admin & Dispatch Portal' },
];

const payments = ['Visa', 'Mastercard', 'Amex', 'EFTPOS', 'Cabcharge', 'Apple Pay', 'Google Pay', 'Cash'];

export function Footer() {
  const whatsappUrl = `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(
    'Hi Sunny Taxi Service, I would like to book a taxi in Melbourne.',
  )}`;

  return (
    <footer className="band-dark on-dark mt-20 sm:mt-24">
      <div className="shell py-14 sm:py-16">
        <div className="grid gap-10 sm:gap-12 lg:grid-cols-[1.25fr_0.8fr_1.35fr]">
          {/* Brand column */}
          <div>
            <div className="flex items-center gap-3">
              <span className="font-display text-fluid-xl font-extrabold tracking-tight text-platinum">
                Sunny Taxi <span className="text-gold-light">Service</span>
              </span>
            </div>

            <p className="mt-4 max-w-sm text-fluid-sm leading-relaxed text-white/55">
              Professional, punctual and personalised taxi &amp; passenger transport services across
              metropolitan Melbourne by Gagandeep Singh. Sedan taxis, 7-seater SUVs, and maxi vans with
              fixed upfront pricing.
            </p>

            <div className="mt-6 space-y-2.5 text-fluid-sm">
              <a
                href={`tel:${BRAND.dispatchPhoneDial}`}
                className="flex items-center gap-2.5 text-white/70 transition hover:text-gold-light"
              >
                <Phone className="h-4 w-4 shrink-0 text-gold" /> {BRAND.dispatchPhone}
              </a>
              <a
                href={`mailto:${BRAND.email}`}
                className="flex items-center gap-2.5 break-all text-white/70 transition hover:text-gold-light"
              >
                <Mail className="h-4 w-4 shrink-0 text-gold" /> {BRAND.email}
              </a>
              <p className="flex items-start gap-2.5 text-white/70">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" /> {BRAND.address}
              </p>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2.5 text-fluid-xs font-semibold text-emerald-300 transition hover:bg-emerald-400/20"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp dispatch, 24/7
            </a>
          </div>

          {/* Quick links */}
          <div>
            <p className="eyebrow mb-5">Quick links</p>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-fluid-sm text-white/60 transition hover:text-gold-light"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Suburbs + payments */}
          <div>
            <p className="eyebrow mb-5">Melbourne suburbs we serve</p>
            <div className="flex flex-wrap gap-2">
              {footerSuburbs.map((suburb) => (
                <Link key={suburb} to="/fleet-routes" className="chip transition hover:text-gold-light">
                  {suburb}
                </Link>
              ))}
              <span className="chip border-dashed">+ 40 more across Greater Melbourne</span>
            </div>

            <p className="eyebrow mb-3 mt-8">Payments accepted</p>
            <div className="flex flex-wrap gap-2">
              {payments.map((p) => (
                <span key={p} className="chip font-mono text-[0.65rem]">
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="hairline my-9" />

        <div className="flex flex-col gap-2 text-fluid-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {BRAND.fullName}. {BRAND.abn}.
          </p>
          <div className="flex items-center gap-3">
            <p>{BRAND.accreditation}</p>
            <span>·</span>
            <Link to="/admin/login" className="text-white/50 hover:text-gold-light transition">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
