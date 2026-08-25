import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { BadgeCheck, Loader2, PenLine } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { StarRating } from '@/components/ui/StarRating';
import { createReview } from '@/services/api';
import { useAdminDataStore } from '@/store/adminDataStore';
import { useToast } from '@/hooks/useToast';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import type { Review, ReviewSubject, TripType } from '@/types';

const tripTypes: TripType[] = [
  'Airport Transfer',
  'Corporate Travel',
  'Winery Tour',
  'Maxi Van',
  'Event Transfer',
];

const filters: { label: string; value: 'all' | TripType }[] = [
  { label: 'All reviews', value: 'all' },
  ...tripTypes.map((t) => ({ label: t, value: t as TripType })),
];

export default function Reviews() {
  const ref = useScrollReveal<HTMLDivElement>();
  const { notify } = useToast();
  const storeReviews = useAdminDataStore((s) => s.reviews);

  const [reviews, setReviews] = useState<Review[]>(storeReviews);
  const [filter, setFilter] = useState<'all' | TripType>('all');
  const [open, setOpen] = useState(false);

  const [subject, setSubject] = useState<ReviewSubject>('driver');
  const [rating, setRating] = useState(5);
  const [form, setForm] = useState({
    name: '',
    suburb: '',
    driverName: '',
    tripType: tripTypes[0] as TripType,
    comment: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setReviews(storeReviews);
  }, [storeReviews]);

  const stats = useMemo(() => {
    if (reviews.length === 0) return { average: 0, total: 0, distribution: [] as { star: number; count: number }[] };
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return {
      average: Number((sum / reviews.length).toFixed(1)),
      total: reviews.length,
      distribution: [5, 4, 3, 2, 1].map((star) => ({
        star,
        count: reviews.filter((r) => r.rating === star).length,
      })),
    };
  }, [reviews]);

  const visible = useMemo(
    () => (filter === 'all' ? reviews : reviews.filter((r) => r.tripType === filter)),
    [reviews, filter],
  );

  const submit = async () => {
    if (form.name.trim().length < 2 || form.comment.trim().length < 12) {
      notify('info', 'Tell us a little more', 'A name and at least a sentence about the trip.');
      return;
    }
    setSubmitting(true);
    const result = await createReview({
      subject,
      name: form.name,
      suburb: form.suburb || 'Melbourne',
      driverName: subject === 'driver' ? form.driverName || undefined : undefined,
      tripType: form.tripType,
      rating,
      comment: form.comment,
    });
    setSubmitting(false);

    if (result.ok) {
      useAdminDataStore.getState().addReview(result.data);
      setOpen(false);
      setForm({ name: '', suburb: '', driverName: '', tripType: tripTypes[0], comment: '' });
      setRating(5);
      notify('success', 'Thank you for your feedback', 'Your review has been recorded.');
    }
  };

  return (
    <div ref={ref} className="shell pb-16 pt-24 sm:pb-20 sm:pt-28">
      <header className="max-w-2xl">
        <span className="eyebrow">Reviews &amp; ratings</span>
        <h1 className="mt-3 text-fluid-h2">
          Rated by the people in the back seat
        </h1>
      </header>

      {/* Summary banner */}
      <div className="card mt-8 grid gap-8 p-8 sm:p-10 lg:grid-cols-[260px_1fr_auto] lg:items-center">
        <div className="text-center lg:text-left">
          <p className="text-fluid-h1 font-bold gold-text">{stats.average || '—'}</p>
          <StarRating value={stats.average} size={18} className="mt-3 justify-center lg:justify-start" />
          <p className="mt-2 text-fluid-xs text-ink-muted">
            Based on {stats.total} verified Melbourne riders
          </p>
        </div>

        <div className="space-y-2.5">
          {stats.distribution.map(({ star, count }) => {
            const pct = stats.total ? (count / stats.total) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-3">
                <span className="w-8 shrink-0 text-fluid-xs text-ink-muted">{star}★</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-paper-alt">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full bg-gold-gradient"
                  />
                </div>
                <span className="w-8 shrink-0 text-right text-fluid-xs text-ink-muted">{count}</span>
              </div>
            );
          })}
        </div>

        <button onClick={() => setOpen(true)} className="btn-gold w-full lg:w-auto">
          <PenLine className="h-4 w-4" /> Write a review
        </button>
      </div>

      {/* Filters */}
      <div className="mt-10 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`rounded-full border px-4 py-2 text-fluid-xs transition ${
              filter === f.value
                ? 'border-gold-deep bg-gold/10 text-gold-ink'
                : 'border-line bg-white text-ink-muted hover:border-gold-deep/35'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {visible.map((review) => (
          <article key={review.id} data-reveal className="card p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold-deep/30 bg-gold/10 font-accent text-fluid-xs font-bold gold-text">
                  {review.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                </span>
                <span>
                  <span className="block text-fluid-sm font-medium text-ink">{review.name}</span>
                  <span className="block text-fluid-xs text-ink-muted">{review.suburb}</span>
                </span>
              </div>
              <StarRating value={review.rating} size={14} />
            </div>

            <p className="mt-4 text-fluid-sm leading-relaxed text-ink-soft">{review.comment}</p>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="chip">{review.tripType}</span>
              {review.driverName && <span className="chip">Chauffeur: {review.driverName}</span>}
              {review.vehicle && <span className="chip">{review.vehicle}</span>}
              {review.verified ? (
                <span className="chip border-verified/30 bg-verified/10 text-verified">
                  <BadgeCheck className="h-3 w-3" /> Verified trip
                </span>
              ) : (
                <span className="chip border-dashed">Awaiting moderation</span>
              )}
              <span className="ml-auto text-fluid-xs text-ink-muted">
                {new Date(review.date).toLocaleDateString('en-AU', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>
          </article>
        ))}
      </div>

      {/* Write a review */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        eyebrow="Your experience"
        title="Write a review"
        maxWidth="max-w-lg"
      >
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-2 rounded-2xl border border-line bg-white p-1.5">
            {(
              [
                { id: 'driver' as ReviewSubject, label: 'Rate your chauffeur' },
                { id: 'service' as ReviewSubject, label: 'Rate the service' },
              ]
            ).map((option) => (
              <button
                key={option.id}
                onClick={() => setSubject(option.id)}
                className={`rounded-xl px-3 py-2.5 text-fluid-xs font-medium transition ${
                  subject === option.id
                    ? 'bg-gold-gradient text-obsidian'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-line bg-white p-5 text-center">
            <p className="field-label">Your rating</p>
            <StarRating value={rating} size={30} onChange={setRating} className="justify-center" />
            <p className="mt-2 text-fluid-xs text-ink-muted">
              {['Poor', 'Below par', 'Fine', 'Very good', 'Faultless'][rating - 1]}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <input
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full"
            />
            <input
              placeholder="Suburb or city"
              value={form.suburb}
              onChange={(e) => setForm({ ...form, suburb: e.target.value })}
              className="w-full"
            />
          </div>

          {subject === 'driver' && (
            <input
              placeholder="Chauffeur's name (optional)"
              value={form.driverName}
              onChange={(e) => setForm({ ...form, driverName: e.target.value })}
              className="w-full"
            />
          )}

          <select
            value={form.tripType}
            onChange={(e) => setForm({ ...form, tripType: e.target.value as TripType })}
            className="w-full"
            aria-label="Trip type"
          >
            {tripTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <textarea
            rows={4}
            placeholder="What happened on the trip? The specifics help the next rider."
            value={form.comment}
            onChange={(e) => setForm({ ...form, comment: e.target.value })}
            className="w-full resize-none"
          />

          <button onClick={submit} disabled={submitting} className="btn-gold w-full">
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Submitting…
              </>
            ) : (
              'Submit review'
            )}
          </button>

          <p className="text-center text-fluid-xs text-ink-muted">
            Reviews are matched to a booking reference before they appear publicly.
          </p>
        </div>
      </Modal>
    </div>
  );
}
