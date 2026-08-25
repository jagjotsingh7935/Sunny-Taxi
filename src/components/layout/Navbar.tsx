import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, Phone, X } from 'lucide-react';
import { BRAND } from '@/data/brand';

const links = [
  { to: '/', label: 'Home' },
  { to: '/fleet-routes', label: 'Fleet & Routes' },
  { to: '/booking', label: 'Booking & Map' },
  { to: '/reviews', label: 'Reviews' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[800] transition-shadow duration-300 ${
        scrolled ? 'shadow-card' : ''
      }`}
    >
      <div className="border-b border-line bg-white/88 backdrop-blur-xl">
        <div className="shell flex h-16 items-center justify-between gap-3 sm:h-[74px] sm:gap-4">
          {/* Brand */}
          <Link to="/" className="flex shrink-0 items-center gap-2.5 sm:gap-3">
            <span className="leading-tight">
              <span className="block font-display text-[1.2rem] font-extrabold tracking-tight text-ink sm:text-[1.4rem]">
                Sunny <span className="text-gold-ink">Taxi</span>
              </span>
              <span className="block font-accent text-[0.64rem] font-bold uppercase tracking-crown text-gold-ink">
                Service · Melbourne
              </span>
            </span>
          </Link>

          {/* Desktop links */}
          <nav className="hidden items-center gap-0.5 lg:flex">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `relative rounded-full px-3 py-2 text-fluid-sm font-medium transition-colors duration-200 ${
                    isActive ? 'text-gold-ink' : 'text-ink-soft hover:text-ink'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute inset-x-3 -bottom-px h-[2px] rounded-full bg-gold-gradient"
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-2">
            <a
              href={`tel:${BRAND.dispatchPhoneDial}`}
              className="hidden items-center gap-2 rounded-full border border-verified/25 bg-verified/8 px-3.5 py-2 text-fluid-xs font-semibold text-verified transition hover:bg-verified/15 md:flex"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-verified opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-verified" />
              </span>
              24/7 · {BRAND.dispatchPhone}
            </a>

            <Link to="/booking" className="btn-gold hidden px-5 py-2.5 xs:inline-flex">
              Book ride
            </Link>

            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              className="rounded-xl border border-line bg-white p-2.5 text-ink transition hover:border-gold-deep/50 lg:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-b border-line bg-white shadow-card lg:hidden"
          >
            <div className="shell space-y-1 py-4">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `block rounded-xl px-4 py-3 text-fluid-sm transition ${
                      isActive
                        ? 'bg-gold/10 font-semibold text-gold-ink'
                        : 'text-ink-soft hover:bg-paper-alt hover:text-ink'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="grid gap-2 pt-3 sm:grid-cols-2">
                <a href={`tel:${BRAND.dispatchPhoneDial}`} className="btn-ghost w-full">
                  <Phone className="h-4 w-4" /> {BRAND.dispatchPhone}
                </a>
                <Link to="/booking" className="btn-gold w-full">
                  Book ride
                </Link>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
