import { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  RotateCcw,
  Search,
  Trash2,
  User,
  Users,
} from 'lucide-react';
import { useAdminDataStore, type QuoteRecord, type MessageRecord } from '@/store/adminDataStore';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { useToast } from '@/hooks/useToast';
import { currency } from '@/services/pricing';

export default function AdminInquiries() {
  const {
    quotes,
    messages,
    updateQuoteStatus,
    deleteQuote,
    updateMessageStatus,
    deleteMessage,
    resetToDefaults,
  } = useAdminDataStore();
  const { notify } = useToast();
  const [activeTab, setActiveTab] = useState<'quotes' | 'messages'>('quotes');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editingQuoteId, setEditingQuoteId] = useState<string | null>(null);
  const [quotePriceInput, setQuotePriceInput] = useState<number>(0);

  // Dialog states
  const [deletingQuote, setDeletingQuote] = useState<{ id: string; ref: string } | null>(null);
  const [deletingMessage, setDeletingMessage] = useState<{ id: string; sender: string } | null>(null);
  const [confirmRestoreOpen, setConfirmRestoreOpen] = useState(false);

  const filteredQuotes = quotes.filter((q) => {
    const matchesSearch =
      q.reference.toLowerCase().includes(search.toLowerCase()) ||
      q.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      q.customer.email.toLowerCase().includes(search.toLowerCase()) ||
      q.customer.phone.includes(search) ||
      q.pickup.label.toLowerCase().includes(search.toLowerCase()) ||
      q.dropoff.label.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'all' || q.adminStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredMessages = messages.filter((m) => {
    return (
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase()) ||
      m.message.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleUpdatePrice = (quoteId: string, ref: string) => {
    updateQuoteStatus(quoteId, 'quoted', Number(quotePriceInput));
    setEditingQuoteId(null);
    notify('success', 'Price Quoted', `Quoted ${currency(quotePriceInput)} for Quote #${ref}.`);
  };

  const handleConfirmDeleteQuote = () => {
    if (deletingQuote) {
      deleteQuote(deletingQuote.id);
      notify('error', 'Quote Deleted', `Quote #${deletingQuote.ref} was removed.`);
      setDeletingQuote(null);
    }
  };

  const handleConfirmDeleteMessage = () => {
    if (deletingMessage) {
      deleteMessage(deletingMessage.id);
      notify('error', 'Message Deleted', `Message from ${deletingMessage.sender} was removed.`);
      setDeletingMessage(null);
    }
  };

  const handleConfirmRestore = () => {
    resetToDefaults();
    setConfirmRestoreOpen(false);
    notify('success', 'Demo Inquiries Restored', 'All sample custom quotes and contact messages have been restored.');
  };

  const handleQuoteStatusChange = (id: string, ref: string, status: QuoteRecord['adminStatus']) => {
    updateQuoteStatus(id, status);
    notify('success', 'Status Updated', `Quote #${ref} status set to ${status.toUpperCase()}.`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <span className="eyebrow">Customer Intake &amp; Lead Management</span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Quotes &amp; Contact Inquiries
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
            Review custom trip quotes requested on the map, reply with fixed prices, and manage contact enquiries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setConfirmRestoreOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-3.5 py-2.5 text-xs font-bold text-amber-900 hover:bg-amber-100 transition active:scale-95 shrink-0"
          >
            <RotateCcw className="h-4 w-4 text-amber-700" />
            <span>Restore Demo Inquiries</span>
          </button>

          {/* Tab Switcher */}
          <div className="flex gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('quotes')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'quotes'
                  ? 'bg-gold-gradient text-obsidian shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Quotes ({quotes.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('messages')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'messages'
                  ? 'bg-gold-gradient text-obsidian shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Messages ({messages.length})
            </button>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              activeTab === 'quotes'
                ? 'Search quotes by reference, customer name, phone, suburb...'
                : 'Search contact messages by name, email, or subject...'
            }
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm border-slate-300 font-medium"
          />
        </div>

        {activeTab === 'quotes' && (
          <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['all', 'received', 'quoted', 'accepted', 'declined'].map((st) => (
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
                {st === 'all' ? 'All Quotes' : st}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Custom Quotes List */}
      {activeTab === 'quotes' && (
        <div className="grid grid-cols-1 gap-4">
          {filteredQuotes.map((q) => (
            <div
              key={q.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-gold-deep/40 transition space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-extrabold text-amber-900 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
                    #{q.reference}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    Received: {new Date(q.createdAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={q.adminStatus}
                    onChange={(e) =>
                      handleQuoteStatusChange(q.id, q.reference, e.target.value as QuoteRecord['adminStatus'])
                    }
                    className={`text-xs font-bold py-1 px-2.5 rounded-lg border cursor-pointer ${
                      q.adminStatus === 'received'
                        ? 'bg-amber-50 text-amber-800 border-amber-300'
                        : q.adminStatus === 'quoted'
                        ? 'bg-blue-50 text-blue-800 border-blue-300'
                        : q.adminStatus === 'accepted'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-slate-100 text-slate-700 border-slate-300'
                    }`}
                  >
                    <option value="received">Received / Pending Quote</option>
                    <option value="quoted">Price Quoted to Client</option>
                    <option value="accepted">Accepted / Booked</option>
                    <option value="declined">Declined / Expired</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => setDeletingQuote({ id: q.id, ref: q.reference })}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Delete Quote"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Trip & Route */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="space-y-1.5 md:col-span-2">
                  <div className="flex items-start gap-2">
                    <span className="h-2 w-2 rounded-full bg-gold-deep mt-1.5 shrink-0" />
                    <div>
                      <span className="text-[0.65rem] uppercase font-bold text-slate-400">Pickup Location:</span>
                      <p className="font-bold text-slate-900">{q.pickup.label}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="h-2 w-2 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                    <div>
                      <span className="text-[0.65rem] uppercase font-bold text-slate-400">Destination:</span>
                      <p className="font-bold text-slate-900">{q.dropoff.label}</p>
                    </div>
                  </div>
                </div>

                {/* Estimate & Quote Editor */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Est. Distance / Time:</span>
                    <span className="font-bold text-slate-900">
                      {q.distanceKm.toFixed(1)} km · {q.durationMins}m
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Passengers:</span>
                    <span className="font-bold text-slate-900">
                      {q.adults + q.children} passengers
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-200">
                    <span className="text-[0.65rem] uppercase font-bold text-slate-500 block">Quoted Price:</span>
                    {editingQuoteId === q.id ? (
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="number"
                          value={quotePriceInput}
                          onChange={(e) => setQuotePriceInput(Number(e.target.value))}
                          className="w-24 text-xs py-1 px-2 font-bold"
                          placeholder="Price"
                        />
                        <button
                          type="button"
                          onClick={() => handleUpdatePrice(q.id, q.reference)}
                          className="px-2 py-1 rounded bg-gold-gradient text-[0.68rem] font-bold text-obsidian shadow-sm"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingQuoteId(null)}
                          className="text-[0.68rem] text-slate-500 hover:text-slate-800"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between mt-0.5">
                        <span className="text-base font-black text-gold-deep">
                          {q.quotedAmount ? currency(q.quotedAmount) : `${currency(q.indicativeFrom)} - ${currency(q.indicativeTo)} (Indicative)`}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingQuoteId(q.id);
                            setQuotePriceInput(q.quotedAmount || q.indicativeFrom);
                          }}
                          className="text-[0.68rem] font-bold text-slate-600 hover:text-gold-deep underline"
                        >
                          {q.quotedAmount ? 'Change Quote' : 'Set Quote'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Customer Info & Occasion */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs text-slate-600 bg-slate-50/50 p-2.5 rounded-xl">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="flex items-center gap-1.5 font-bold text-slate-900">
                    <User className="h-3.5 w-3.5 text-gold-deep" />
                    {q.customer.name}
                  </span>
                  <a
                    href={`tel:${q.customer.phone}`}
                    className="flex items-center gap-1.5 text-slate-700 hover:text-gold-deep font-semibold"
                  >
                    <Phone className="h-3.5 w-3.5 text-emerald-600" />
                    {q.customer.phone}
                  </a>
                  <a
                    href={`mailto:${q.customer.email}`}
                    className="flex items-center gap-1.5 text-slate-700 hover:text-gold-deep"
                  >
                    <Mail className="h-3.5 w-3.5 text-slate-400" />
                    {q.customer.email}
                  </a>
                </div>

                {q.occasion && (
                  <span className="font-semibold text-slate-700 bg-slate-200/60 px-2 py-0.5 rounded text-[0.7rem]">
                    {q.occasion}
                  </span>
                )}
              </div>

              {/* Notes */}
              {q.notes && (
                <p className="text-xs bg-amber-50/70 border border-amber-200/80 p-2 rounded-lg text-amber-900">
                  <strong className="font-bold">Trip Requirements:</strong> {q.notes}
                </p>
              )}
            </div>
          ))}

          {filteredQuotes.length === 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 shadow-sm space-y-3">
              <p className="font-semibold text-slate-700">No custom quotes found.</p>
              <button
                type="button"
                onClick={() => setConfirmRestoreOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-amber-300 bg-amber-50 text-xs font-bold text-amber-900 hover:bg-amber-100 transition shadow-sm"
              >
                <RotateCcw className="h-4 w-4 text-amber-700" />
                <span>Restore Demo Quotes</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Contact Messages List */}
      {activeTab === 'messages' && (
        <div className="grid grid-cols-1 gap-4">
          {filteredMessages.map((m) => (
            <div
              key={m.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-gold-deep/40 transition space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-900 text-sm">{m.name}</span>
                  <span className="text-xs text-slate-500 font-medium">
                    {new Date(m.createdAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      updateMessageStatus(m.id, m.adminStatus === 'unread' ? 'read' : 'unread')
                    }
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase transition ${
                      m.adminStatus === 'unread'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {m.adminStatus}
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeletingMessage({ id: m.id, sender: m.name })}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Delete Message"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-800 uppercase tracking-wider text-[0.7rem]">
                  Subject: {m.subject}
                </p>
                <p className="mt-1 text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 font-medium">
                  {m.message}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs pt-2">
                <a
                  href={`tel:${m.phone}`}
                  className="flex items-center gap-1.5 text-slate-700 hover:text-gold-deep font-semibold"
                >
                  <Phone className="h-3.5 w-3.5 text-emerald-600" />
                  {m.phone}
                </a>
                <a
                  href={`mailto:${m.email}`}
                  className="flex items-center gap-1.5 text-slate-700 hover:text-gold-deep font-semibold"
                >
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  {m.email}
                </a>
              </div>
            </div>
          ))}

          {filteredMessages.length === 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 shadow-sm space-y-3">
              <p className="font-semibold text-slate-700">No contact messages received.</p>
              <button
                type="button"
                onClick={() => setConfirmRestoreOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-amber-300 bg-amber-50 text-xs font-bold text-amber-900 hover:bg-amber-100 transition shadow-sm"
              >
                <RotateCcw className="h-4 w-4 text-amber-700" />
                <span>Restore Demo Messages</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Delete Quote Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deletingQuote)}
        title="Delete Custom Quote?"
        description={`Are you sure you want to delete quote #${deletingQuote?.ref}? This action cannot be undone.`}
        confirmLabel="Delete Quote"
        cancelLabel="Keep Quote"
        tone="danger"
        onConfirm={handleConfirmDeleteQuote}
        onCancel={() => setDeletingQuote(null)}
      />

      {/* Delete Message Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deletingMessage)}
        title="Delete Contact Message?"
        description={`Are you sure you want to delete message from "${deletingMessage?.sender}"?`}
        confirmLabel="Delete Message"
        cancelLabel="Keep Message"
        tone="danger"
        onConfirm={handleConfirmDeleteMessage}
        onCancel={() => setDeletingMessage(null)}
      />

      {/* Restore Demo Inquiries Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmRestoreOpen}
        title="Restore Default Demo Inquiries?"
        description="This will restore all sample customer custom quotes and contact enquiries."
        confirmLabel="Restore Inquiries"
        cancelLabel="Cancel"
        tone="warning"
        onConfirm={handleConfirmRestore}
        onCancel={() => setConfirmRestoreOpen(false)}
      />
    </div>
  );
}
