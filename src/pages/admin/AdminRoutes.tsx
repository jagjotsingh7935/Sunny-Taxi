import { useState } from 'react';
import { Edit2, MapPin, Plus, RotateCcw, Route as RouteIcon, Search, Trash2, X } from 'lucide-react';
import { useAdminDataStore } from '@/store/adminDataStore';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { useToast } from '@/hooks/useToast';
import { currency } from '@/services/pricing';
import type { Route } from '@/types';

export default function AdminRoutes() {
  const { routes, addRoute, updateRoute, deleteRoute, resetToDefaults } = useAdminDataStore();
  const { notify } = useToast();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);

  // Dialog states
  const [deletingRoute, setDeletingRoute] = useState<{ id: string; name: string } | null>(null);
  const [confirmRestoreOpen, setConfirmRestoreOpen] = useState(false);

  // Form State
  const [label, setLabel] = useState('');
  const [shortLabel, setShortLabel] = useState('');
  const [fromLabel, setFromLabel] = useState('');
  const [toLabel, setToLabel] = useState('');
  const [fromSuburb, setFromSuburb] = useState('');
  const [toSuburb, setToSuburb] = useState('');
  const [distanceKm, setDistanceKm] = useState(25);
  const [durationMins, setDurationMins] = useState(25);
  const [fixedPrice, setFixedPrice] = useState(65);
  const [category, setCategory] = useState<Route['category']>('airport');
  const [note, setNote] = useState('');
  const [popular, setPopular] = useState(false);

  const filteredRoutes = routes.filter((r) => {
    const matchesSearch =
      r.label.toLowerCase().includes(search.toLowerCase()) ||
      r.shortLabel.toLowerCase().includes(search.toLowerCase()) ||
      r.from.label.toLowerCase().includes(search.toLowerCase()) ||
      r.to.label.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === 'all' || r.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const openCreateModal = () => {
    setEditingRoute(null);
    setLabel('');
    setShortLabel('');
    setFromLabel('Melbourne Airport Terminal 2');
    setToLabel('Deanside, VIC 3336');
    setFromSuburb('Tullamarine');
    setToSuburb('Deanside');
    setDistanceKm(24);
    setDurationMins(22);
    setFixedPrice(62);
    setCategory('airport');
    setNote('Fixed price pre-booked airport pickup.');
    setPopular(false);
    setIsModalOpen(true);
  };

  const openEditModal = (route: Route) => {
    setEditingRoute(route);
    setLabel(route.label);
    setShortLabel(route.shortLabel);
    setFromLabel(route.from.label);
    setToLabel(route.to.label);
    setFromSuburb(route.from.suburb || '');
    setToSuburb(route.to.suburb || '');
    setDistanceKm(route.distanceKm);
    setDurationMins(route.durationMins);
    setFixedPrice(route.fixedPrice);
    setCategory(route.category);
    setNote(route.note || '');
    setPopular(route.popular);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const routeData: Omit<Route, 'id'> = {
      label: label || `${fromSuburb || fromLabel} to ${toSuburb || toLabel}`,
      shortLabel: shortLabel || `${fromSuburb || 'Origin'} ⇄ ${toSuburb || 'Dest'}`,
      from: {
        label: fromLabel,
        suburb: fromSuburb,
        lat: -37.669,
        lng: 144.841,
      },
      to: {
        label: toLabel,
        suburb: toSuburb,
        lat: -37.747,
        lng: 144.7085,
      },
      category,
      distanceKm: Number(distanceKm),
      durationMins: Number(durationMins),
      fixedPrice: Number(fixedPrice),
      popular,
      note,
    };

    if (editingRoute) {
      updateRoute(editingRoute.id, routeData);
      notify('success', 'Route Updated', `Updated corridor "${routeData.shortLabel}".`);
    } else {
      addRoute(routeData);
      notify('success', 'New Route Created', `Added corridor "${routeData.shortLabel}".`);
    }

    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deletingRoute) {
      deleteRoute(deletingRoute.id);
      notify('error', 'Route Deleted', `Deleted route "${deletingRoute.name}".`);
      setDeletingRoute(null);
    }
  };

  const handleConfirmRestore = () => {
    resetToDefaults();
    setConfirmRestoreOpen(false);
    notify('success', 'Demo Routes Restored', 'All default fixed routes have been restored.');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <span className="eyebrow">Corridors &amp; Published Pricing</span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Fixed Routes Management ({routes.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
            Add, update, or remove fixed-price routes shown on the website booking wizard and maps.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setConfirmRestoreOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-3.5 py-2.5 text-xs font-bold text-amber-900 hover:bg-amber-100 transition active:scale-95 shrink-0"
            title="Reload default demo fixed routes"
          >
            <RotateCcw className="h-4 w-4 text-amber-700" />
            <span>Restore Demo Routes</span>
          </button>

          <button
            type="button"
            onClick={openCreateModal}
            className="flex items-center gap-1.5 rounded-xl bg-gold-gradient px-4 py-2.5 text-xs font-bold text-obsidian shadow-gold transition hover:brightness-105 active:scale-95 shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Fixed Route</span>
          </button>
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
            placeholder="Search routes by origin, destination, or suburb..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm border-slate-300 font-medium"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['all', 'airport', 'city', 'tour', 'regional'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition shrink-0 ${
                categoryFilter === cat
                  ? 'bg-gold-gradient text-obsidian shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'all' ? 'All Corridors' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Routes Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-[0.68rem] uppercase tracking-wider font-bold">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Route &amp; Corridor</th>
                <th className="py-3.5 px-4">Distance / Time</th>
                <th className="py-3.5 px-4">Fixed Sedan Fare</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {filteredRoutes.map((route) => (
                <tr key={route.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4 sm:px-6">
                    <p className="font-bold text-slate-900 leading-tight">{route.label}</p>
                    <p className="text-[0.7rem] text-slate-500 mt-0.5 font-normal">
                      {route.from.label} → {route.to.label}
                    </p>
                    {route.note && (
                      <span className="inline-block mt-1 text-[0.65rem] text-gold-deep bg-gold/10 px-2 py-0.5 rounded font-semibold">
                        {route.note}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap text-slate-600">
                    <span className="font-semibold text-slate-900">{route.distanceKm} km</span>
                    <span className="text-slate-400"> · </span>
                    <span>{route.durationMins} mins</span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-extrabold text-base text-gold-deep">
                      {currency(route.fixedPrice)}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[0.65rem] font-extrabold uppercase tracking-wide ${
                        route.popular
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {route.popular ? 'Featured Popular' : route.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEditModal(route)}
                        className="p-1.5 rounded-lg text-slate-600 hover:bg-gold/15 hover:text-gold-deep transition"
                        title="Edit Route"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingRoute({ id: route.id, name: route.shortLabel })}
                        className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                        title="Delete Route"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredRoutes.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500 space-y-3">
                    <p className="font-semibold text-slate-700">No fixed routes found in the database.</p>
                    <div className="flex items-center justify-center gap-2 pt-2">
                      <button
                        type="button"
                        onClick={openCreateModal}
                        className="px-3.5 py-1.5 rounded-xl bg-gold-gradient text-xs font-bold text-obsidian shadow-sm"
                      >
                        + Add Route
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmRestoreOpen(true)}
                        className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl border border-amber-300 bg-amber-50 text-xs font-bold text-amber-900 hover:bg-amber-100 transition shadow-sm"
                      >
                        <RotateCcw className="h-3.5 w-3.5 text-amber-700" />
                        <span>Restore Default Demo Routes</span>
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Route Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base">
                {editingRoute ? 'Edit Fixed Route' : 'Add New Fixed Route'}
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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="field-label">Short Label (Card title)</label>
                  <input
                    type="text"
                    required
                    value={shortLabel}
                    onChange={(e) => setShortLabel(e.target.value)}
                    placeholder="MEL Airport ⇄ Deanside"
                    className="w-full text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="field-label">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Route['category'])}
                    className="w-full text-xs font-bold"
                  >
                    <option value="airport">Airport Transfer</option>
                    <option value="city">City / CBD</option>
                    <option value="tour">Tour / Winery</option>
                    <option value="regional">Regional Victoria</option>
                    <option value="suburban">Suburban</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="field-label">Full Route Display Title</label>
                <input
                  type="text"
                  required
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="Melbourne Airport (MEL) to Deanside"
                  className="w-full text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="field-label">Origin Address</label>
                  <input
                    type="text"
                    required
                    value={fromLabel}
                    onChange={(e) => setFromLabel(e.target.value)}
                    placeholder="Melbourne Airport Terminal 2"
                    className="w-full text-xs"
                  />
                </div>
                <div>
                  <label className="field-label">Origin Suburb</label>
                  <input
                    type="text"
                    value={fromSuburb}
                    onChange={(e) => setFromSuburb(e.target.value)}
                    placeholder="Tullamarine"
                    className="w-full text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="field-label">Destination Address</label>
                  <input
                    type="text"
                    required
                    value={toLabel}
                    onChange={(e) => setToLabel(e.target.value)}
                    placeholder="37 Kidd St, Deanside VIC 3336"
                    className="w-full text-xs"
                  />
                </div>
                <div>
                  <label className="field-label">Destination Suburb</label>
                  <input
                    type="text"
                    value={toSuburb}
                    onChange={(e) => setToSuburb(e.target.value)}
                    placeholder="Deanside"
                    className="w-full text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="field-label">Distance (km)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={distanceKm}
                    onChange={(e) => setDistanceKm(Number(e.target.value))}
                    className="w-full text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="field-label">Duration (mins)</label>
                  <input
                    type="number"
                    required
                    value={durationMins}
                    onChange={(e) => setDurationMins(Number(e.target.value))}
                    className="w-full text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="field-label">Fixed Price ($ AUD)</label>
                  <input
                    type="number"
                    required
                    value={fixedPrice}
                    onChange={(e) => setFixedPrice(Number(e.target.value))}
                    className="w-full text-xs font-bold text-gold-deep"
                  />
                </div>
              </div>

              <div>
                <label className="field-label">Route Notes / Special Features</label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Pre-booked airport pickup, includes all tolls"
                  className="w-full text-xs"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={popular}
                  onChange={(e) => setPopular(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-gold-deep"
                />
                <span className="text-xs font-bold text-slate-800">
                  Feature this as a Popular Route on Homepage
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
                  {editingRoute ? 'Save Route Changes' : 'Create Route'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Route Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deletingRoute)}
        title="Delete Fixed Route?"
        description={`Are you sure you want to delete the route "${deletingRoute?.name}"? It will be removed from the booking wizard.`}
        confirmLabel="Delete Route"
        cancelLabel="Keep Route"
        tone="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingRoute(null)}
      />

      {/* Restore Demo Routes Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmRestoreOpen}
        title="Restore Default Demo Routes?"
        description="This will restore all default Melbourne fixed routes and corridor prices."
        confirmLabel="Restore Routes"
        cancelLabel="Cancel"
        tone="warning"
        onConfirm={handleConfirmRestore}
        onCancel={() => setConfirmRestoreOpen(false)}
      />
    </div>
  );
}
