import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export function AppPreloader() {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // If user prefers reduced motion, finish immediately
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsDone(true);
      return;
    }

    const duration = 1600; // ms
    const startTime = performance.now();

    const frame = (now: number) => {
      const elapsed = now - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);

      if (pct < 100) {
        requestAnimationFrame(frame);
      } else {
        setTimeout(() => setIsDone(true), 240);
      }
    };

    const animId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(animId);
  }, []);

  const getStatusText = (p: number) => {
    if (p < 30) return 'Connecting Melbourne Dispatch…';
    if (p < 70) return 'Checking Suburb Routes & Airports…';
    if (p < 95) return 'Preparing Your Premium Ride…';
    return 'Welcome to Sunny Taxi Service';
  };

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          key="app-preloader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            y: -24,
            scale: 1.02,
            transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
          }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden bg-obsidian text-platinum select-none"
          style={{
            backgroundImage: `
              radial-gradient(600px 350px at 50% 38%, rgba(245, 158, 11, 0.18), transparent 70%),
              linear-gradient(180deg, #080C15 0%, #101726 50%, #080C15 100%)
            `,
          }}
        >
          {/* Ambient background glow ring */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
            <div className="h-[460px] w-[460px] rounded-full border border-gold/15 animate-pulse" />
          </div>

          <div className="relative z-10 flex w-full max-w-sm flex-col items-center px-6 text-center">
            {/* Brand wordmark */}
            <motion.div
              initial={{ y: 12, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="space-y-1.5"
            >
              <h2 className="font-display text-fluid-h2 font-extrabold tracking-tight text-platinum">
                Sunny Taxi <span className="text-gold-light">Service</span>
              </h2>
              <p className="font-accent text-[0.68rem] font-bold uppercase tracking-crown text-gold-light">
                Melbourne · Gagandeep Singh
              </p>
            </motion.div>

            {/* Taxi Driving Progress Track */}
            <div className="mt-10 w-full">
              <div className="relative h-12 w-full">
                {/* Animated Taxi on track */}
                <div
                  className="absolute bottom-2 -translate-x-1/2 transition-all duration-75 ease-out"
                  style={{ left: `${Math.max(6, Math.min(progress, 94))}%` }}
                >
                  <div className="relative">
                    {/* Headlight beam */}
                    <div className="absolute -right-7 top-1 h-3 w-8 bg-gradient-to-r from-amber-300/40 to-transparent blur-[2px] rounded-r-full" />

                    {/* Stylized Modern Taxi SVG */}
                    <svg
                      viewBox="0 0 48 24"
                      className="h-7 w-12 drop-shadow-[0_4px_8px_rgba(245,158,11,0.5)]"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* Taxi Body */}
                      <path
                        d="M6 15L10 8C11 6 13 5 16 5H32C35 5 37 6 38 8L42 15H45C46.1 15 47 15.9 47 17V19H1V17C1 15.9 1.9 15 3 15H6Z"
                        fill="url(#taxiGold)"
                      />
                      {/* Taxi Roof Sign */}
                      <rect x="20" y="2" width="8" height="3" rx="1.5" fill="#080C15" />
                      <rect x="21" y="2.5" width="6" height="2" rx="1" fill="#FEF08A" />
                      {/* Windows */}
                      <path d="M12 9H22V14H8.5L12 9Z" fill="#080C15" fillOpacity="0.85" />
                      <path d="M25 9H36L39.5 14H25V9Z" fill="#080C15" fillOpacity="0.85" />
                      {/* Wheels */}
                      <circle cx="12" cy="19" r="3.5" fill="#080C15" stroke="#FDE047" strokeWidth="1.5" />
                      <circle cx="36" cy="19" r="3.5" fill="#080C15" stroke="#FDE047" strokeWidth="1.5" />
                      <circle cx="12" cy="19" r="1.5" fill="#FDE047" />
                      <circle cx="36" cy="19" r="1.5" fill="#FDE047" />

                      <defs>
                        <linearGradient id="taxiGold" x1="0" y1="5" x2="48" y2="19" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#FDE047" />
                          <stop offset="0.5" stopColor="#F59E0B" />
                          <stop offset="1" stopColor="#D97706" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>

                {/* The Road Track */}
                <div className="absolute bottom-0 inset-x-0 h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gold-gradient transition-all duration-75 ease-out shadow-[0_0_12px_rgba(245,158,11,0.8)]"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

                {/* Road Dash Markings */}
                <div className="mt-1 flex justify-between px-1 text-[0.62rem] font-mono text-white/30">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                  <span>75%</span>
                  <span>100%</span>
                </div>
            </div>

            {/* Percentage & Live Status Indicator */}
            <div className="mt-6 flex flex-col items-center gap-1.5">
              <span className="font-mono text-fluid-h2 font-extrabold gold-text tabular-nums tracking-wider">
                {progress}%
              </span>
              <p className="text-fluid-xs text-white/60 transition-all duration-200">
                {getStatusText(progress)}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
