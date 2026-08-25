import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Eye, EyeOff, KeyRound, Lock, Mail, ShieldCheck } from 'lucide-react';
import { useAdminAuthStore } from '@/store/adminAuthStore';

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAdminAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    const destination = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin/dashboard';
    navigate(destination, { replace: true });
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const res = login(email, password);
      setLoading(false);
      if (res.success) {
        const destination = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin/dashboard';
        navigate(destination, { replace: true });
      } else {
        setError(res.message || 'Invalid credentials.');
      }
    }, 400);
  };

  const handleFillDemo = () => {
    setEmail('admin@sunnytaxi.com.au');
    setPassword('sunny2026');
    setError('');
  };

  return (
    <div className="min-h-screen bg-obsidian text-platinum flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-gold/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3.5 py-1.5 text-xs font-semibold text-white/80 hover:text-white hover:bg-white/10 transition mb-6"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Return to Website
          </Link>

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-gradient shadow-gold text-obsidian font-extrabold text-2xl mb-4">
            ST
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Sunny Taxi Service
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-gold-light font-semibold uppercase tracking-wider">
            Admin &amp; Dispatch Portal
          </p>
          <p className="mt-2 text-xs text-white/60">
            Secure management for bookings, routes, fleet, quotes, and customer reviews.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mt-8 bg-white/[0.04] border border-white/12 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl"
        >
          {error && (
            <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs font-medium text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-1.5">
                Admin Email / Username
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gold/70" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@sunnytaxi.com.au"
                  className="w-full rounded-xl border border-white/15 bg-white/[0.07] pl-10 pr-4 py-3 text-sm text-white font-medium placeholder:text-white/35 focus:border-gold focus:ring-2 focus:ring-gold/25 outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gold/70" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-white/15 bg-white/[0.07] pl-10 pr-10 py-3 text-sm text-white font-medium placeholder:text-white/35 focus:border-gold focus:ring-2 focus:ring-gold/25 outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-gold-gradient py-3.5 px-4 text-sm font-bold text-obsidian shadow-gold transition hover:brightness-105 active:scale-[0.99] disabled:opacity-70"
            >
              {loading ? 'Authenticating…' : 'Access Admin Portal'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Quick Demo Credentials Autofill Helper */}
          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <p className="text-xs text-white/60 mb-2.5">For immediate testing and demonstration:</p>
            <button
              type="button"
              onClick={handleFillDemo}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gold-deep/40 bg-gold/10 px-3 py-1.5 text-xs font-semibold text-gold-light hover:bg-gold/20 transition active:scale-95"
            >
              <KeyRound className="h-3.5 w-3.5" />
              <span>Autofill Demo Credentials</span>
            </button>
            <p className="mt-2 text-[0.65rem] text-white/40 font-mono">
              admin@sunnytaxi.com.au · sunny2026
            </p>
          </div>
        </motion.div>

        {/* Security badge */}
        <div className="mt-6 text-center flex items-center justify-center gap-1.5 text-[0.7rem] text-white/50">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span>Gagandeep Singh — Sunny Taxi Service (CPVV Melbourne)</span>
        </div>
      </div>
    </div>
  );
}
