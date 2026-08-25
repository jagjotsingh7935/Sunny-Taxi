import { useEffect, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  eyebrow?: string;
  children: ReactNode;
  maxWidth?: string;
}

export function Modal({
  open,
  onClose,
  title,
  eyebrow,
  children,
  maxWidth = 'max-w-2xl',
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[1000] flex items-end justify-center sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-ink/45 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            data-lenis-prevent
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            className={`relative z-10 max-h-[92vh] w-full overflow-y-auto rounded-t-3xl border border-line bg-white shadow-lift scrollbar-thin scrollbar-track-transparent scrollbar-thumb-line sm:rounded-3xl ${maxWidth}`}
          >
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-line bg-white/92 px-5 py-4 backdrop-blur-xl sm:px-6 sm:py-5">
              <div className="min-w-0">
                {eyebrow && <p className="eyebrow mb-1">{eyebrow}</p>}
                {title && <h3 className="text-fluid-h3">{title}</h3>}
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="shrink-0 rounded-full border border-line p-2 text-ink-muted transition hover:border-gold-deep/50 hover:text-gold-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="px-5 py-6 sm:px-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
