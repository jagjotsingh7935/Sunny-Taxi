import { useState } from 'react';
import { Building2, Check, RefreshCw, Save, ShieldCheck, User } from 'lucide-react';
import { useAdminDataStore } from '@/store/adminDataStore';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { useToast } from '@/hooks/useToast';

export default function AdminSettings() {
  const { company, updateCompany, resetToDefaults } = useAdminDataStore();
  const { notify } = useToast();

  const [legalName, setLegalName] = useState<string>(company.fullName || 'Sunny Taxi Service – Gagandeep Singh');
  const [operatorName, setOperatorName] = useState<string>(company.owner || 'Gagandeep Singh');
  const [addressLine, setAddressLine] = useState<string>(company.address || '37 Kidd Street, Deanside VIC 3336, Australia');
  const [suburb, setSuburb] = useState<string>(company.suburb || 'Deanside');
  const [postcode, setPostcode] = useState<string>(company.postcode || '3336');
  const [state, setState] = useState<string>('VIC');
  const [phone, setPhone] = useState<string>(company.dispatchPhone || '0412 456 588');
  const [email, setEmail] = useState<string>(company.email || 'info@sunnytaxi.com.au');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    updateCompany({
      fullName: legalName as any,
      owner: operatorName as any,
      dispatchPhone: phone as any,
      email: email as any,
      address: addressLine as any,
      suburb: suburb as any,
      postcode: postcode as any,
    });

    setSavedSuccess(true);
    notify('success', 'Settings Saved', 'Company business registration and dispatch details updated.');
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleConfirmReset = () => {
    resetToDefaults();
    setConfirmResetOpen(false);
    notify('success', 'Portal Data Reset', 'All routes, fleet, bookings, inquiries, and reviews reset to default demo data.');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm">
        <span className="eyebrow">Company Profile &amp; Accreditation</span>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
          Business &amp; Dispatch Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
          Manage business registration, dispatch contact details, operating address, and system defaults.
        </p>
      </div>

      {savedSuccess && (
        <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-xs font-bold text-emerald-800 flex items-center gap-2">
          <Check className="h-4 w-4 text-emerald-600" />
          <span>Business settings updated successfully and saved to local state.</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Building2 className="h-4 w-4 text-gold-deep" />
            Company Registration Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="field-label">Company Business Name</label>
              <input
                type="text"
                required
                value={legalName}
                onChange={(e) => setLegalName(e.target.value)}
                className="w-full text-xs font-bold"
              />
            </div>
            <div>
              <label className="field-label">Operator / Driver Name</label>
              <input
                type="text"
                required
                value={operatorName}
                onChange={(e) => setOperatorName(e.target.value)}
                className="w-full text-xs font-bold"
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <User className="h-4 w-4 text-gold-deep" />
            Operating Base &amp; Address
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <div className="sm:col-span-3">
              <label className="field-label">Street Address</label>
              <input
                type="text"
                required
                value={addressLine}
                onChange={(e) => setAddressLine(e.target.value)}
                className="w-full text-xs"
              />
            </div>
            <div>
              <label className="field-label">Suburb</label>
              <input
                type="text"
                required
                value={suburb}
                onChange={(e) => setSuburb(e.target.value)}
                className="w-full text-xs"
              />
            </div>
            <div>
              <label className="field-label">State</label>
              <input
                type="text"
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full text-xs font-bold"
              />
            </div>
            <div>
              <label className="field-label">Postcode</label>
              <input
                type="text"
                required
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                className="w-full text-xs font-mono"
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            Dispatch Contact Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="field-label">Primary Dispatch Phone</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-xs font-bold"
              />
            </div>
            <div>
              <label className="field-label">Dispatch Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gold-gradient text-xs font-bold text-obsidian shadow-gold hover:brightness-105 active:scale-95 transition"
          >
            <Save className="h-4 w-4" />
            <span>Save Profile Settings</span>
          </button>
        </div>
      </form>

      {/* Factory Reset Box */}
      <div className="bg-white p-6 rounded-3xl border border-red-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-red-900">Restore Factory Defaults</h3>
          <p className="text-xs text-slate-600 mt-0.5">
            Reset all modified routes, vehicles, bookings, reviews, and fares back to initial demo seeds.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setConfirmResetOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-300 bg-red-50 text-xs font-bold text-red-700 hover:bg-red-100 transition shrink-0 active:scale-95"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Reset Portal Data</span>
        </button>
      </div>

      {/* Factory Reset Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmResetOpen}
        title="Reset All Portal Data to Factory Defaults?"
        description="This will erase all custom changes and restore default demo routes, vehicles, bookings, quotes, reviews, and suburban fares."
        confirmLabel="Reset Everything"
        cancelLabel="Keep Current Data"
        tone="danger"
        onConfirm={handleConfirmReset}
        onCancel={() => setConfirmResetOpen(false)}
      />
    </div>
  );
}
