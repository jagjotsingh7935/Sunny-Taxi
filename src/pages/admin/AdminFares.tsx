import { useState } from 'react';
import { DollarSign, Edit2, Plus, RotateCcw, Search, Trash2, X } from 'lucide-react';
import { useAdminDataStore } from '@/store/adminDataStore';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { useToast } from '@/hooks/useToast';
import { currency } from '@/services/pricing';
import type { SuburbFare } from '@/types';

export default function AdminFares() {
  const { suburbs, addSuburb, updateSuburb, deleteSuburb, resetToDefaults } = useAdminDataStore();
  const { notify } = useToast();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSuburb, setEditingSuburb] = useState<SuburbFare | null>(null);

  // Dialog states
  const [deletingSuburb, setDeletingSuburb] = useState<SuburbFare | null>(null);
  const [confirmRestoreOpen, setConfirmRestoreOpen] = useState(false);

  // Form State
  const [suburbName, setSuburbName] = useState('');
  const [postcode, setPostcode] = useState('');
  const [region, setRegion] = useState('West');
  const [toCbd, setToCbd] = useState(55);
  const [toTullamarine, setToTullamarine] = useState(65);
  const [distanceFromCbdKm, setDistanceFromCbdKm] = useState(25);

  const filteredSuburbs = suburbs.filter(
    (s) =>
      s.suburb.toLowerCase().includes(search.toLowerCase()) ||
      s.postcode.includes(search) ||
      s.region.toLowerCase().includes(search.toLowerCase()),
  );

  const openCreateModal = () => {
    setEditingSuburb(null);
    setSuburbName('');
    setPostcode('3000');
    setRegion('West');
    setToCbd(55);
    setToTullamarine(65);
    setDistanceFromCbdKm(25);
    setIsModalOpen(true);
  };

  const openEditModal = (suburb: SuburbFare) => {
    setEditingSuburb(suburb);
    setSuburbName(suburb.suburb);
    setPostcode(suburb.postcode);
    setRegion(suburb.region);
    setToCbd(suburb.toCbd);
    setToTullamarine(suburb.toTullamarine);
    setDistanceFromCbdKm(suburb.distanceFromCbdKm);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const suburbData: SuburbFare = {
      suburb: suburbName,
      postcode,
      region,
      toCbd: Number(toCbd),
      toTullamarine: Number(toTullamarine),
      distanceFromCbdKm: Number(distanceFromCbdKm),
      lat: editingSuburb?.lat || -37.75,
      lng: editingSuburb?.lng || 144.75,
    };

    if (editingSuburb) {
      updateSuburb(`${editingSuburb.suburb}-${editingSuburb.postcode}`, suburbData);
      notify('success', 'Fare Rate Updated', `Updated rates for ${suburbName} (${postcode}).`);
    } else {
      addSuburb(suburbData);
      notify('success', 'Suburb Fare Added', `Added fare entry for ${suburbName} (${postcode}).`);
    }

    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deletingSuburb) {
      deleteSuburb(`${deletingSuburb.suburb}-${deletingSuburb.postcode}`);
      notify('error', 'Fare Record Deleted', `Removed ${deletingSuburb.suburb} (${deletingSuburb.postcode}) from matrix.`);
      setDeletingSuburb(null);
    }
  };

  const handleConfirmRestore = () => {
    resetToDefaults();
    setConfirmRestoreOpen(false);
    notify('success', 'Demo Fares Restored', 'All default suburban fixed rates have been restored.');
  };

  return (
    <div className="space-y-5 sm:space-y-6 max-w-7xl mx-auto min-w-0 max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <span className="eyebrow">Fixed Suburban Rates</span>
          <h1 className="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Suburban Fare Matrix ({suburbs.length} suburbs)
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
            Configure published sedan rates to Melbourne CBD and Melbourne Airport by suburb and postcode.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <button
            type="button"
            onClick={() => setConfirmRestoreOpen(true)}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-3.5 py-2 text-xs font-bold text-amber-900 hover:bg-amber-100 transition active:scale-95 shrink-0"
          >
            <RotateCcw className="h-3.5 w-3.5 text-amber-700" />
            <span>Restore Demo Fares</span>
          </button>

          <button
            type="button"
            onClick={openCreateModal}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-gold-gradient px-4 py-2 text-xs font-bold text-obsidian shadow-gold transition hover:brightness-105 active:scale-95 shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Add Suburb Fare</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-sm min-w-0">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search suburbs by name, postcode (e.g. 3336, Deanside), or region..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm border-slate-300 font-medium"
          />
        </div>
      </div>

      {/* Mobile Suburb Cards (< md) */}
      <div className="md:hidden space-y-3 min-w-0">
        {filteredSuburbs.map((s) => (
          <div
            key={`${s.suburb}-${s.postcode}`}
            className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3 min-w-0 max-w-full overflow-hidden"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm">
                  {s.suburb}{' '}
                  <span className="font-mono text-xs text-slate-500 font-normal">({s.postcode})</span>
                </h4>
                <span className="text-[0.68rem] text-slate-500 font-medium">
                  Region: {s.region} · {s.distanceFromCbdKm} km from CBD
                </span>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => openEditModal(s)}
                  className="p-1.5 rounded-lg text-slate-600 hover:bg-gold/15 hover:text-gold-deep transition"
                  title="Edit Fare"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeletingSuburb(s)}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                  title="Delete Suburb"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[0.65rem] text-slate-500 uppercase font-semibold block">To Melbourne CBD</span>
                <span className="font-black text-sm text-gold-deep">
                  {s.toCbd === 0 ? '—' : currency(s.toCbd)}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[0.65rem] text-slate-500 uppercase font-semibold block">To MEL Airport</span>
                <span className="font-black text-sm text-gold-deep">
                  {currency(s.toTullamarine)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Suburbs Table (>= md) */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-w-0">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-[0.68rem] uppercase tracking-wider font-bold">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Suburb</th>
                <th className="py-3.5 px-4">Postcode</th>
                <th className="py-3.5 px-4">Region</th>
                <th className="py-3.5 px-4">To Melbourne CBD</th>
                <th className="py-3.5 px-4">To MEL Airport</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {filteredSuburbs.map((s) => (
                <tr key={`${s.suburb}-${s.postcode}`} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4 sm:px-6 font-bold text-slate-900">{s.suburb}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">{s.postcode}</td>
                  <td className="py-3.5 px-4 text-slate-600">{s.region}</td>
                  <td className="py-3.5 px-4 font-extrabold text-gold-deep">
                    {s.toCbd === 0 ? '—' : currency(s.toCbd)}
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-gold-deep">
                    {currency(s.toTullamarine)}
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEditModal(s)}
                        className="p-1.5 rounded-lg text-slate-600 hover:bg-gold/15 hover:text-gold-deep transition"
                        title="Edit Fare"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingSuburb(s)}
                        className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                        title="Delete Suburb"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredSuburbs.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center text-slate-500 shadow-sm space-y-3">
          <p className="font-semibold text-slate-700">No suburb fares found.</p>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <button
              type="button"
              onClick={openCreateModal}
              className="px-3.5 py-1.5 rounded-xl bg-gold-gradient text-xs font-bold text-obsidian shadow-sm"
            >
              + Add Suburb Fare
            </button>
            <button
              type="button"
              onClick={() => setConfirmRestoreOpen(true)}
              className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl border border-amber-300 bg-amber-50 text-xs font-bold text-amber-900 hover:bg-amber-100 transition shadow-sm"
            >
              <RotateCcw className="h-3.5 w-3.5 text-amber-700" />
              <span>Restore Default Suburban Fares</span>
            </button>
          </div>
        </div>
      )}

      {/* Add / Edit Suburb Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 max-w-md w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base truncate pr-2">
                {editingSuburb ? `Edit Fare: ${editingSuburb.suburb}` : 'Add Suburb Fare'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg shrink-0"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5">
              <div>
                <label className="field-label">Suburb Name</label>
                <input
                  type="text"
                  required
                  value={suburbName}
                  onChange={(e) => setSuburbName(e.target.value)}
                  placeholder="e.g. Deanside"
                  className="w-full text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                <div>
                  <label className="field-label">Postcode</label>
                  <input
                    type="text"
                    required
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value)}
                    placeholder="3336"
                    className="w-full text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="field-label">Region</label>
                  <input
                    type="text"
                    required
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    placeholder="West / North / East"
                    className="w-full text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                <div>
                  <label className="field-label">Rate to CBD ($)</label>
                  <input
                    type="number"
                    required
                    value={toCbd}
                    onChange={(e) => setToCbd(Number(e.target.value))}
                    className="w-full text-xs font-bold text-gold-deep"
                  />
                </div>
                <div>
                  <label className="field-label">Rate to MEL Airport ($)</label>
                  <input
                    type="number"
                    required
                    value={toTullamarine}
                    onChange={(e) => setToTullamarine(Number(e.target.value))}
                    className="w-full text-xs font-bold text-gold-deep"
                  />
                </div>
              </div>

              <div>
                <label className="field-label">Distance from CBD (km)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={distanceFromCbdKm}
                  onChange={(e) => setDistanceFromCbdKm(Number(e.target.value))}
                  className="w-full text-xs"
                />
              </div>

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
                  Save Suburb Rate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Fare Record Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deletingSuburb)}
        title="Delete Suburb Fare Record?"
        description={`Are you sure you want to remove the fixed fare record for ${deletingSuburb?.suburb} (${deletingSuburb?.postcode})?`}
        confirmLabel="Delete Record"
        cancelLabel="Keep Record"
        tone="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingSuburb(null)}
      />

      {/* Restore Demo Fares Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmRestoreOpen}
        title="Restore Default Suburban Fare Matrix?"
        description="This will restore all default Melbourne metropolitan suburbs and published airport & CBD prices."
        confirmLabel="Restore Fares"
        cancelLabel="Cancel"
        tone="warning"
        onConfirm={handleConfirmRestore}
        onCancel={() => setConfirmRestoreOpen(false)}
      />
    </div>
  );
}
