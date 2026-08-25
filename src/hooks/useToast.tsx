import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Info, X, XCircle } from 'lucide-react';

export type ToastTone = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  tone: ToastTone;
  title: string;
  detail?: string;
}

interface ToastContextValue {
  notify: (tone: ToastTone, title: string, detail?: string) => void;
}

const ToastContext = createContext<ToastContextValue>({ notify: () => undefined });

export const useToast = () => useContext(ToastContext);

const icons = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

const tones: Record<ToastTone, { border: string; iconBg: string; text: string; iconColor: string }> = {
  success: {
    border: 'border-emerald-200 bg-white',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    text: 'text-slate-900',
  },
  error: {
    border: 'border-red-200 bg-white',
    iconBg: 'bg-red-50',
    iconColor: 'text-red-600',
    text: 'text-slate-900',
  },
  info: {
    border: 'border-gold/40 bg-white',
    iconBg: 'bg-gold/15',
    iconColor: 'text-gold-deep',
    text: 'text-slate-900',
  },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const notify = useCallback((tone: ToastTone, title: string, detail?: string) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, tone, title, detail }]);
    window.setTimeout(() => {
      dismiss(id);
    }, 4500);
  }, [dismiss]);

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Toast Container */}
      <div className="pointer-events-none fixed bottom-5 right-4 sm:right-6 z-[999999] flex w-[min(92vw,400px)] flex-col gap-2.5">
        <AnimatePresence>
          {toasts.map((toast) => {
            const Icon = icons[toast.tone];
            const style = tones[toast.tone];
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                className={`pointer-events-auto flex items-start gap-3 rounded-2xl border ${style.border} p-4 shadow-2xl backdrop-blur-lg`}
                role="status"
              >
                <div className={`p-2 rounded-xl shrink-0 ${style.iconBg} ${style.iconColor}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1 pt-0.5">
                  <p className={`text-xs sm:text-sm font-extrabold leading-tight ${style.text}`}>
                    {toast.title}
                  </p>
                  {toast.detail && (
                    <p className="mt-1 text-xs text-slate-600 font-medium leading-relaxed">
                      {toast.detail}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => dismiss(toast.id)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition shrink-0"
                  aria-label="Dismiss notification"
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
