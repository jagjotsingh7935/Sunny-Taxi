import { useState } from 'react';
import { BadgeCheck, Check, Edit2, Plus, RotateCcw, Star, Trash2, X } from 'lucide-react';
import { useAdminDataStore } from '@/store/adminDataStore';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { useToast } from '@/hooks/useToast';
import type { Review, TripType } from '@/types';

export default function AdminReviews() {
  const {
    reviews,
    addReview,
    updateReview,
    deleteReview,
    toggleReviewVerified,
    resetToDefaults,
  } = useAdminDataStore();
  const { notify } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  // Dialog states
  const [deletingReview, setDeletingReview] = useState<{ id: string; author: string } | null>(null);
  const [confirmRestoreOpen, setConfirmRestoreOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [suburb, setSuburb] = useState('');
  const [tripType, setTripType] = useState<TripType>('Airport Transfer');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [verified, setVerified] = useState(true);
  const [vehicle, setVehicle] = useState('Sedan Taxi');

  const openCreateModal = () => {
    setEditingReview(null);
    setName('');
    setSuburb('Deanside');
    setTripType('Airport Transfer');
    setRating(5);
    setComment('');
    setVerified(true);
    setVehicle('Sedan Taxi');
    setIsModalOpen(true);
  };

  const openEditModal = (rev: Review) => {
    setEditingReview(rev);
    setName(rev.name);
    setSuburb(rev.suburb);
    setTripType(rev.tripType);
    setRating(rev.rating);
    setComment(rev.comment);
    setVerified(rev.verified);
    setVehicle(rev.vehicle || 'Sedan Taxi');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const reviewData: Omit<Review, 'id'> = {
      name,
      suburb,
      tripType,
      rating: Number(rating),
      comment,
      verified,
      vehicle,
      subject: 'service',
      date: editingReview ? editingReview.date : new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    };

    if (editingReview) {
      updateReview(editingReview.id, reviewData);
      notify('success', 'Review Updated', `Updated review by ${name}.`);
    } else {
      addReview(reviewData);
      notify('success', 'Testimonial Added', `Added new review by ${name}.`);
    }

    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deletingReview) {
      deleteReview(deletingReview.id);
      notify('error', 'Review Deleted', `Removed review from ${deletingReview.author}.`);
      setDeletingReview(null);
    }
  };

  const handleConfirmRestore = () => {
    resetToDefaults();
    setConfirmRestoreOpen(false);
    notify('success', 'Demo Reviews Restored', 'All sample customer reviews and ratings have been restored.');
  };

  const handleToggleVerified = (id: string, author: string, currentlyVerified: boolean) => {
    toggleReviewVerified(id);
    notify('info', 'Verification Badge Updated', `${author}'s review is now ${currentlyVerified ? 'unverified' : 'verified'}.`);
  };

  return (
    <div className="space-y-5 sm:space-y-6 max-w-7xl mx-auto min-w-0 max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <span className="eyebrow">Client Feedback &amp; Social Proof</span>
          <h1 className="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Reviews &amp; Testimonials ({reviews.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
            Manage customer reviews displayed on the public website and testimonials page.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <button
            type="button"
            onClick={() => setConfirmRestoreOpen(true)}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-3.5 py-2 text-xs font-bold text-amber-900 hover:bg-amber-100 transition active:scale-95 shrink-0"
          >
            <RotateCcw className="h-3.5 w-3.5 text-amber-700" />
            <span>Restore Demo Reviews</span>
          </button>

          <button
            type="button"
            onClick={openCreateModal}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-gold-gradient px-4 py-2 text-xs font-bold text-obsidian shadow-gold transition hover:brightness-105 active:scale-95 shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Add Testimonial</span>
          </button>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 min-w-0">
        {reviews.map((r) => (
          <div
            key={r.id}
            className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-sm hover:border-gold-deep/40 transition flex flex-col justify-between min-w-0 max-w-full overflow-hidden"
          >
            <div className="min-w-0">
              <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-slate-900 text-sm truncate">{r.name}</span>
                    {r.verified && (
                      <span title="Verified Customer" className="shrink-0">
                        <BadgeCheck className="h-4 w-4 text-emerald-600" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 font-medium truncate">{r.suburb}, VIC</p>
                </div>

                {/* Stars */}
                <div className="flex items-center gap-0.5 text-amber-500 shrink-0">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${
                        i < r.rating ? 'fill-amber-400 text-amber-500' : 'text-slate-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Trip & Vehicle Tag */}
              <div className="mt-3 flex flex-wrap gap-1.5 sm:gap-2 text-[0.7rem]">
                <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-semibold">
                  {r.tripType}
                </span>
                {r.vehicle && (
                  <span className="bg-gold/10 text-gold-deep px-2 py-0.5 rounded-md font-semibold">
                    {r.vehicle}
                  </span>
                )}
                <span className="text-slate-400 self-center">· {r.date}</span>
              </div>

              <p className="mt-3 text-xs sm:text-sm text-slate-700 leading-relaxed italic font-medium break-words">
                “{r.comment}”
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => handleToggleVerified(r.id, r.name, r.verified)}
                className={`text-xs font-bold px-2.5 py-1 rounded-lg border transition ${
                  r.verified
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                {r.verified ? '✓ Verified' : 'Unverified'}
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => openEditModal(r)}
                  className="p-1.5 rounded-lg text-slate-600 hover:bg-gold/15 hover:text-gold-deep transition"
                  title="Edit Review"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeletingReview({ id: r.id, author: r.name })}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                  title="Delete Review"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {reviews.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center text-slate-500 shadow-sm space-y-3">
          <p className="font-semibold text-slate-700">No testimonials or reviews found.</p>
          <button
            type="button"
            onClick={() => setConfirmRestoreOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-amber-300 bg-amber-50 text-xs font-bold text-amber-900 hover:bg-amber-100 transition shadow-sm"
          >
            <RotateCcw className="h-4 w-4 text-amber-700" />
            <span>Restore Default Reviews</span>
          </button>
        </div>
      )}

      {/* Add / Edit Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                {editingReview ? 'Edit Review' : 'Add New Testimonial'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                <div>
                  <label className="field-label">Customer Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. David H."
                    className="w-full text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="field-label">Suburb / Location</label>
                  <input
                    type="text"
                    required
                    value={suburb}
                    onChange={(e) => setSuburb(e.target.value)}
                    placeholder="e.g. Deanside"
                    className="w-full text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                <div>
                  <label className="field-label">Trip Type</label>
                  <select
                    value={tripType}
                    onChange={(e) => setTripType(e.target.value as TripType)}
                    className="w-full text-xs font-bold"
                  >
                    <option value="Airport Transfer">Airport Transfer</option>
                    <option value="Corporate Travel">Corporate Travel</option>
                    <option value="Winery Tour">Winery Tour</option>
                    <option value="Maxi Van">Maxi Van Group</option>
                    <option value="Event Transfer">Event Transfer</option>
                  </select>
                </div>
                <div>
                  <label className="field-label">Star Rating (1-5)</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full text-xs font-bold text-amber-600"
                  >
                    <option value={5}>★★★★★ (5 Stars)</option>
                    <option value={4}>★★★★☆ (4 Stars)</option>
                    <option value={3}>★★★☆☆ (3 Stars)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="field-label">Vehicle Used</label>
                <input
                  type="text"
                  value={vehicle}
                  onChange={(e) => setVehicle(e.target.value)}
                  placeholder="e.g. Sedan Taxi, SUV 7-Seater, Maxi Van"
                  className="w-full text-xs"
                />
              </div>

              <div>
                <label className="field-label">Review Testimonial Text</label>
                <textarea
                  rows={4}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Gagandeep was right on time at 4:30 AM for our international flight..."
                  className="w-full text-xs leading-relaxed"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={verified}
                  onChange={(e) => setVerified(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-emerald-600"
                />
                <span className="text-xs font-bold text-slate-800">
                  Mark with Verified Customer Badge
                </span>
              </label>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gold-gradient text-xs font-bold text-obsidian shadow-sm hover:brightness-105 active:scale-95"
                >
                  Save Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Review Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deletingReview)}
        title="Delete Testimonial?"
        description={`Are you sure you want to remove the review from "${deletingReview?.author}"?`}
        confirmLabel="Delete Review"
        cancelLabel="Keep Review"
        tone="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingReview(null)}
      />

      {/* Restore Demo Reviews Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmRestoreOpen}
        title="Restore Default Demo Reviews?"
        description="This will restore all default client testimonials and star ratings."
        confirmLabel="Restore Reviews"
        cancelLabel="Cancel"
        tone="warning"
        onConfirm={handleConfirmRestore}
        onCancel={() => setConfirmRestoreOpen(false)}
      />
    </div>
  );
}
