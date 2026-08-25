import { useState } from 'react';
import {
  Calendar,
  CalendarCheck,
  CheckCircle2,
  Clock,
  DollarSign,
  Mail,
  MapPin,
  Phone,
  RotateCcw,
  Search,
  Trash2,
  User,
  XCircle,
} from 'lucide-react';
import { useAdminDataStore, type BookingRecord } from '@/store/adminDataStore';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { useToast } from '@/hooks/useToast';
import { currency } from '@/services/pricing';

export default function AdminBookings() {
  const { bookings, updateBookingStatus, deleteBooking, resetToDefaults } = useAdminDataStore();
  const { notify } = useToast();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(null);

  // Dialog states
  const [deletingBooking, setDeletingBooking] = useState<{ id: string; ref: string } | null>(null);
  const [confirmRestoreOpen, setConfirmRestoreOpen] = useState(false);

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.reference.toLowerCase().includes(search.toLowerCase()) ||
      b.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      b.customer.email.toLowerCase().includes(search.toLowerCase()) ||
      b.customer.phone.includes(search) ||
      b.pickup.label.toLowerCase().includes(search.toLowerCase()) ||
      b.dropoff.label.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'all' || b.adminStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleConfirmDelete = () => {
    if (deletingBooking) {
      deleteBooking(deletingBooking.id);
      notify('error', 'Booking Deleted', `Booking #${deletingBooking.ref} was removed.`);
      if (selectedBooking?.id === deletingBooking.id) setSelectedBooking(null);
      setDeletingBooking(null);
    }
  };

  const handleConfirmRestore = () => {
    resetToDefaults();
    setConfirmRestoreOpen(false);
    notify('success', 'Demo Bookings Restored', 'All sample scheduled trips and fixed bookings have been restored.');
  };

  const handleStatusChange = (id: string, ref: string, status: BookingRecord['adminStatus']) => {
    updateBookingStatus(id, status);
    notify('success', 'Status Updated', `Booking #${ref} status set to ${status.toUpperCase()}.`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <span className="eyebrow">Dispatch &amp; Scheduled Trips</span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Fixed Route Bookings ({bookings.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
            Real-time bookings received from the website. Update booking status, driver dispatch, and customer notes.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setConfirmRestoreOpen(true)}
          className="flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-3.5 py-2.5 text-xs font-bold text-amber-900 hover:bg-amber-100 transition active:scale-95 shrink-0"
        >
          <RotateCcw className="h-4 w-4 text-amber-700" />
          <span>Restore Demo Bookings</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by booking ref, customer name, phone, or address..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm border-slate-300 font-medium"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['all', 'confirmed', 'completed', 'cancelled'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition shrink-0 ${
                statusFilter === st
                  ? 'bg-gold-gradient text-obsidian shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'all' ? 'All Bookings' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredBookings.map((b) => (
          <div
            key={b.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-gold-deep/40 transition space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-extrabold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                  #{b.reference}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Booked: {new Date(b.createdAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {/* Status Controller */}
              <div className="flex items-center gap-2">
                <select
                  value={b.adminStatus}
                  onChange={(e) =>
                    handleStatusChange(b.id, b.reference, e.target.value as BookingRecord['adminStatus'])
                  }
                  className={`text-xs font-bold py-1 px-2.5 rounded-lg border cursor-pointer ${
                    b.adminStatus === 'confirmed'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : b.adminStatus === 'completed'
                      ? 'bg-blue-50 text-blue-800 border-blue-300'
                      : 'bg-red-50 text-red-800 border-red-300'
                  }`}
                >
                  <option value="confirmed">Confirmed / Active</option>
                  <option value="completed">Completed Trip</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <button
                  type="button"
                  onClick={() => setDeletingBooking({ id: b.id, ref: b.reference })}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  title="Delete Record"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Core Trip Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {/* Pickup & Destination */}
              <div className="space-y-1.5 md:col-span-2">
                <div className="flex items-start gap-2">
                  <span className="h-2 w-2 rounded-full bg-gold-deep mt-1.5 shrink-0" />
                  <div>
                    <span className="text-[0.65rem] uppercase font-bold text-slate-400">Pickup Location:</span>
                    <p className="font-bold text-slate-900">{b.pickup.label}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="h-2 w-2 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                  <div>
                    <span className="text-[0.65rem] uppercase font-bold text-slate-400">Destination:</span>
                    <p className="font-bold text-slate-900">{b.dropoff.label}</p>
                  </div>
                </div>
              </div>

              {/* Schedule & Fare */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-semibold">Scheduled Date:</span>
                  <span className="font-bold text-slate-900">
                    {new Date(b.scheduledFor).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-semibold">Vehicle Class:</span>
                  <span className="font-bold text-slate-900 truncate max-w-[140px]">{b.vehicleName}</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                  <span className="text-slate-500 font-semibold">Total Fare:</span>
                  <span className="font-black text-sm text-gold-deep">{currency(b.total)}</span>
                </div>
              </div>
            </div>

            {/* Customer Details Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs text-slate-600 bg-slate-50/50 p-2.5 rounded-xl">
              <div className="flex flex-wrap items-center gap-4">
                <span className="flex items-center gap-1.5 font-bold text-slate-900">
                  <User className="h-3.5 w-3.5 text-gold-deep" />
                  {b.customer.name}
                </span>
                <a
                  href={`tel:${b.customer.phone}`}
                  className="flex items-center gap-1.5 text-slate-700 hover:text-gold-deep font-semibold"
                >
                  <Phone className="h-3.5 w-3.5 text-emerald-600" />
                  {b.customer.phone}
                </a>
                <a
                  href={`mailto:${b.customer.email}`}
                  className="flex items-center gap-1.5 text-slate-700 hover:text-gold-deep"
                >
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  {b.customer.email}
                </a>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[0.7rem] uppercase font-bold text-slate-400">Payment:</span>
                <span className="font-bold text-slate-800">
                  {b.paymentMethod === 'card-online' ? 'Credit Card (Online)' : 'Pay Driver (EFTPOS/Cash)'}
                </span>
              </div>
            </div>

            {/* Special Notes & Flight Details */}
            {b.addons.notes && (
              <p className="text-xs bg-amber-50/70 border border-amber-200/80 p-2 rounded-lg text-amber-900">
                <strong className="font-bold">Passenger Notes:</strong> {b.addons.notes}
                {b.addons.flightNumber && ` (Flight: ${b.addons.flightNumber})`}
              </p>
            )}
          </div>
        ))}

        {filteredBookings.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 shadow-sm space-y-3">
            <p className="font-semibold text-slate-700">No booking records found.</p>
            <button
              type="button"
              onClick={() => setConfirmRestoreOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-amber-300 bg-amber-50 text-xs font-bold text-amber-900 hover:bg-amber-100 transition shadow-sm"
            >
              <RotateCcw className="h-4 w-4 text-amber-700" />
              <span>Restore Default Demo Bookings</span>
            </button>
          </div>
        )}
      </div>

      {/* Delete Booking Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deletingBooking)}
        title="Delete Booking Record?"
        description={`Are you sure you want to permanently delete booking #${deletingBooking?.ref}? This action cannot be undone.`}
        confirmLabel="Delete Booking"
        cancelLabel="Keep Booking"
        tone="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingBooking(null)}
      />

      {/* Restore Demo Bookings Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmRestoreOpen}
        title="Restore Default Demo Bookings?"
        description="This will restore all sample scheduled airport transfers and customer trip bookings."
        confirmLabel="Restore Bookings"
        cancelLabel="Cancel"
        tone="warning"
        onConfirm={handleConfirmRestore}
        onCancel={() => setConfirmRestoreOpen(false)}
      />
    </div>
  );
}
