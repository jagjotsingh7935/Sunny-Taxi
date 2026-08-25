import { useState } from 'react';
import { Briefcase, Car, Check, Edit2, Plus, RotateCcw, Trash2, Users, Wifi, X } from 'lucide-react';
import { useAdminDataStore } from '@/store/adminDataStore';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { useToast } from '@/hooks/useToast';
import { currency } from '@/services/pricing';
import type { Vehicle, VehicleClassId } from '@/types';

export default function AdminFleet() {
  const { vehicles, updateVehicle, addVehicle, deleteVehicle, resetToDefaults } = useAdminDataStore();
  const { notify } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [confirmRestoreOpen, setConfirmRestoreOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [passengers, setPassengers] = useState(4);
  const [largeSuitcases, setLargeSuitcases] = useState(2);
  const [carryOn, setCarryOn] = useState(2);
  const [baseFare, setBaseFare] = useState(65);
  const [perKm, setPerKm] = useState(2.8);
  const [multiplier, setMultiplier] = useState(1.0);
  const [modelsText, setModelsText] = useState('');
  const [featuresText, setFeaturesText] = useState('');
  const [badge, setBadge] = useState('');

  const openEditModal = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setName(vehicle.name);
    setTagline(vehicle.tagline);
    setDescription(vehicle.description);
    setPassengers(vehicle.passengers);
    setLargeSuitcases(vehicle.largeSuitcases);
    setCarryOn(vehicle.carryOn);
    setBaseFare(vehicle.baseFare);
    setPerKm(vehicle.perKm);
    setMultiplier(vehicle.multiplier);
    setModelsText(vehicle.models.join(', '));
    setFeaturesText(vehicle.features.join('\n'));
    setBadge(vehicle.badge || '');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const vehicleData: Vehicle = {
      id: editingVehicle ? editingVehicle.id : (`custom-vehicle-${Date.now()}` as VehicleClassId),
      name,
      tagline,
      description,
      models: modelsText.split(',').map((m) => m.trim()).filter(Boolean),
      image: editingVehicle?.image || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=85',
      passengers: Number(passengers),
      carryOn: Number(carryOn),
      largeSuitcases: Number(largeSuitcases),
      baseFare: Number(baseFare),
      perKm: Number(perKm),
      minimumFare: 45,
      multiplier: Number(multiplier),
      wifi: true,
      babySeatCompatible: true,
      tintedGlass: true,
      features: featuresText.split('\n').map((f) => f.trim()).filter(Boolean),
      badge: badge.trim() || undefined,
    };

    if (editingVehicle) {
      updateVehicle(editingVehicle.id, vehicleData);
      notify('success', 'Vehicle Updated', `Updated specifications for "${name}".`);
    } else {
      addVehicle(vehicleData);
      notify('success', 'Vehicle Added', `Added vehicle class "${name}".`);
    }

    setIsModalOpen(false);
  };

  const handleConfirmRestore = () => {
    resetToDefaults();
    setConfirmRestoreOpen(false);
    notify('success', 'Demo Fleet Restored', 'All default vehicle classes and fleet specifications have been restored.');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <span className="eyebrow">Vehicle Classes &amp; Capacities</span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Fleet Management ({vehicles.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
            Configure vehicle classes, passenger &amp; luggage capacities, and multiplier rates.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setConfirmRestoreOpen(true)}
          className="flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-3.5 py-2.5 text-xs font-bold text-amber-900 hover:bg-amber-100 transition active:scale-95 shrink-0"
        >
          <RotateCcw className="h-4 w-4 text-amber-700" />
          <span>Restore Demo Fleet</span>
        </button>
      </div>

      {/* Fleet Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {vehicles.map((v) => (
          <div
            key={v.id}
            className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm flex flex-col justify-between hover:border-gold-deep/40 transition"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[0.65rem] font-bold uppercase tracking-wider text-gold-deep bg-gold/10 px-2.5 py-0.5 rounded-full">
                    {v.id}
                  </span>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mt-1.5 leading-tight">
                    {v.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">{v.tagline}</p>
                </div>
                <button
                  type="button"
                  onClick={() => openEditModal(v)}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-gold/15 hover:border-gold-deep/40 hover:text-gold-deep transition"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  <span>Edit</span>
                </button>
              </div>

              {/* Specs Badge Bar */}
              <div className="mt-4 flex flex-wrap gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                <div className="flex items-center gap-1.5 text-slate-700 font-bold">
                  <Users className="h-4 w-4 text-gold-deep" />
                  <span>Up to {v.passengers} Passengers</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700 font-bold">
                  <Briefcase className="h-4 w-4 text-gold-deep" />
                  <span>{v.largeSuitcases} Large + {v.carryOn} Carry-on</span>
                </div>
              </div>

              <p className="mt-3 text-xs text-slate-600 leading-relaxed font-normal">
                {v.description}
              </p>

              {/* Models */}
              <div className="mt-3">
                <p className="text-[0.65rem] uppercase font-bold text-slate-400">Available Models:</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {v.models.map((m) => (
                    <span key={m} className="px-2 py-0.5 rounded-md bg-slate-100 text-[0.7rem] font-semibold text-slate-700">
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              {/* Key Features */}
              <div className="mt-3.5 pt-3 border-t border-slate-100 space-y-1">
                {v.features.slice(0, 3).map((f) => (
                  <div key={f} className="flex items-center gap-2 text-xs text-slate-700">
                    <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[0.65rem] uppercase tracking-wider text-slate-400 font-semibold">Pricing Multiplier</span>
                <p className="text-sm font-bold text-slate-900">{v.multiplier}x Base Rate</p>
              </div>
              <div>
                <span className="text-[0.65rem] uppercase tracking-wider text-slate-400 font-semibold text-right block">Base Starting Rate</span>
                <p className="text-base font-extrabold text-gold-deep text-right">{currency(v.baseFare)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Vehicle Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base">
                Edit Vehicle Class: {name}
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
              <div>
                <label className="field-label">Vehicle Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs font-bold"
                />
              </div>

              <div>
                <label className="field-label">Tagline (Short Summary)</label>
                <input
                  type="text"
                  required
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full text-xs font-medium"
                />
              </div>

              <div>
                <label className="field-label">Full Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="field-label">Passengers</label>
                  <input
                    type="number"
                    min="1"
                    max="14"
                    required
                    value={passengers}
                    onChange={(e) => setPassengers(Number(e.target.value))}
                    className="w-full text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="field-label">Large Bags</label>
                  <input
                    type="number"
                    min="0"
                    max="16"
                    required
                    value={largeSuitcases}
                    onChange={(e) => setLargeSuitcases(Number(e.target.value))}
                    className="w-full text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="field-label">Carry-On</label>
                  <input
                    type="number"
                    min="0"
                    max="16"
                    required
                    value={carryOn}
                    onChange={(e) => setCarryOn(Number(e.target.value))}
                    className="w-full text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="field-label">Base Fare ($)</label>
                  <input
                    type="number"
                    required
                    value={baseFare}
                    onChange={(e) => setBaseFare(Number(e.target.value))}
                    className="w-full text-xs font-bold text-gold-deep"
                  />
                </div>
                <div>
                  <label className="field-label">Per Km ($)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={perKm}
                    onChange={(e) => setPerKm(Number(e.target.value))}
                    className="w-full text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="field-label">Multiplier</label>
                  <input
                    type="number"
                    step="0.05"
                    required
                    value={multiplier}
                    onChange={(e) => setMultiplier(Number(e.target.value))}
                    className="w-full text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="field-label">Models (Comma-separated)</label>
                <input
                  type="text"
                  value={modelsText}
                  onChange={(e) => setModelsText(e.target.value)}
                  placeholder="Toyota Camry Hybrid, Lexus ES"
                  className="w-full text-xs"
                />
              </div>

              <div>
                <label className="field-label">Features (1 per line)</label>
                <textarea
                  rows={3}
                  value={featuresText}
                  onChange={(e) => setFeaturesText(e.target.value)}
                  placeholder="Complimentary onboard bottled water&#10;Quiet hybrid powertrain&#10;Phone fast charging cables"
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
                  Save Vehicle Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Restore Demo Fleet Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmRestoreOpen}
        title="Restore Default Fleet Specifications?"
        description="This will reset Sedan Taxi, SUV / 7-Seater, and Maxi Van capacities, luggage limits, and base fare multipliers to defaults."
        confirmLabel="Restore Fleet"
        cancelLabel="Cancel"
        tone="warning"
        onConfirm={handleConfirmRestore}
        onCancel={() => setConfirmRestoreOpen(false)}
      />
    </div>
  );
}
