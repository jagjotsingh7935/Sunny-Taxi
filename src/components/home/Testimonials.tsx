import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BadgeCheck, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { StarRating } from '@/components/ui/StarRating';
import { mockReviews } from '@/data/mockReviews';

const featured = mockReviews.filter((r) => r.rating === 5).slice(0, 8);

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % featured.length), 6500);
    return () => window.clearInterval(id);
  }, [paused]);

  const review = featured[index];
  const go = (delta: number) =>
    setIndex((i) => (i + delta + featured.length) % featured.length);

  return (
    <section className="shell section-y">
      <SectionHeading
        eyebrow="Verified riders"
        title="What Melbourne says after the trip"
        description="Every review below is tied to a completed booking reference. We publish the four-star ones too."
      />

      <div
        className="card relative mx-auto mt-12 max-w-3xl p-8 sm:p-12"
        data-reveal
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <Quote className="absolute right-8 top-8 h-12 w-12 text-gold/15" />

        <AnimatePresence mode="wait">
          <motion.blockquote
            key={review.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <StarRating value={review.rating} size={18} />
            <p className="mt-6 text-fluid-lg font-medium leading-relaxed text-ink/90 sm:text-fluid-xl">
              &ldquo;{review.comment}&rdquo;
            </p>
            <footer className="mt-7 flex flex-wrap items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gold-deep/30 bg-gold/10 font-accent text-fluid-sm font-bold gold-text">
                {review.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
              </span>
              <span>
                <span className="block text-fluid-sm font-medium text-ink">{review.name}</span>
                <span className="block text-fluid-xs text-ink-muted">
                  {review.suburb} · {review.vehicle}
                </span>
              </span>
              <span className="chip-gold ml-auto">
                <BadgeCheck className="h-3 w-3" /> {review.tripType}
              </span>
            </footer>
          </motion.blockquote>
        </AnimatePresence>

        <div className="mt-9 flex items-center justify-between">
          <div className="flex gap-1.5">
            {featured.map((r, i) => (
              <button
                key={r.id}
                onClick={() => setIndex(i)}
                aria-label={`Review ${i + 1}`}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === index ? 'w-8 bg-gold-gradient' : 'w-3 bg-line hover:bg-ink-muted/40'
                }`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => go(-1)}
              aria-label="Previous review"
              className="rounded-full border border-line p-2.5 text-ink-soft transition hover:border-gold-deep/45 hover:text-gold-ink"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Next review"
              className="rounded-full border border-line p-2.5 text-ink-soft transition hover:border-gold-deep/45 hover:text-gold-ink"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
