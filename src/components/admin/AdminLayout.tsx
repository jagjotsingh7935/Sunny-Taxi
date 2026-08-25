import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Bell,
  CalendarCheck,
  Car,
  ChevronRight,
  DollarSign,
  ExternalLink,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Mail,
  MapPin,
  Menu,
  MessageSquare,
  RotateCcw,
  Route as RouteIcon,
  Settings,
  Shield,
  Star,
  User,
  X,
} from 'lucide-react';
import { useAdminAuthStore } from '@/store/adminAuthStore';
import { useAdminDataStore } from '@/store/adminDataStore';
import { ConfirmDialog } from './ConfirmDialog';
import { useToast } from '@/hooks/useToast';

export function AdminLayout() {
  const { user, logout } = useAdminAuthStore();
  const { quotes, bookings, messages, resetToDefaults } = useAdminDataStore();
  const { notify } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const navigate = useNavigate();

  const pendingQuotes = quotes.filter((q) => q.adminStatus === 'received').length;
  const activeBookings = bookings.filter((b) => b.adminStatus === 'confirmed').length;
  const unreadMessages = messages.filter((m) => m.adminStatus === 'unread').length;
  const totalAlerts = pendingQuotes + unreadMessages;

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleConfirmReset = () => {
    resetToDefaults();
    setConfirmResetOpen(false);
    notify('success', 'Demo Data Restored', 'All routes, vehicles, bookings, quotes, reviews, and fares have been restored to defaults.');
  };

  const navItems = [
    {
      to: '/admin/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      to: '/admin/bookings',
      label: 'Fixed Bookings',
      icon: CalendarCheck,
      badge: activeBookings > 0 ? activeBookings : null,
      badgeColor: 'bg-emerald-500 text-white',
    },
    {
      to: '/admin/inquiries',
      label: 'Quotes & Inquiries',
      icon: MessageSquare,
      badge: totalAlerts > 0 ? totalAlerts : null,
      badgeColor: 'bg-amber-500 text-obsidian',
    },
    {
      to: '/admin/routes',
      label: 'Fixed Routes',
      icon: RouteIcon,
      badge: null,
    },
    {
      to: '/admin/fleet',
      label: 'Fleet & Vehicles',
      icon: Car,
      badge: null,
    },
    {
      to: '/admin/reviews',
      label: 'Reviews & Feedback',
      icon: Star,
      badge: null,
    },
    {
      to: '/admin/fares',
      label: 'Suburban Fares',
      icon: DollarSign,
      badge: null,
    },
    {
      to: '/admin/settings',
      label: 'Company Profile',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex text-slate-900 font-sans">
      {/* Mobile Drawer Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar - Sticky Pinned on Left */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-obsidian text-platinum flex flex-col h-screen shrink-0 transition-transform duration-300 ease-in-out lg:sticky lg:top-0 select-none ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-white/10 shrink-0">
          <Link
            to="/admin/dashboard"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-gradient text-obsidian font-extrabold shadow-gold text-lg">
              ST
            </span>
            <div>
              <span className="block font-bold text-white tracking-tight leading-none text-base">
                Sunny Taxi
              </span>
              <span className="block text-[0.65rem] font-semibold uppercase tracking-wider text-gold-light mt-1">
                Admin Dispatch Portal
              </span>
            </div>
          </Link>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Current Operator Card */}
        <div className="p-4 mx-4 my-4 rounded-2xl bg-white/[0.05] border border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gold/20 border border-gold-deep/40 flex items-center justify-center text-gold-light font-bold text-sm">
              GS
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{user?.name || 'Gagandeep Singh'}</p>
              <p className="text-[0.65rem] text-white/60 truncate">{user?.role || 'Owner & Dispatcher'}</p>
            </div>
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" title="System Online" />
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20">
          <p className="px-3 py-2 text-[0.65rem] font-bold uppercase tracking-wider text-white/40">
            Management &amp; Dispatch
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-gold-gradient text-obsidian shadow-gold font-bold'
                      : 'text-white/75 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[0.65rem] font-bold ${
                      item.badgeColor || 'bg-gold text-obsidian'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/10 space-y-2 shrink-0">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs font-semibold text-white/70 hover:bg-white/10 hover:text-white transition"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="h-3.5 w-3.5 text-gold" />
              View Public Website
            </span>
            <ChevronRight className="h-3.5 w-3.5 text-white/40" />
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition text-left"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shrink-0 shadow-sm sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
              aria-label="Open sidebar navigation"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 font-medium">
              <Shield className="h-3.5 w-3.5 text-emerald-600" />
              <span>CPVV Accredited Dispatch Portal</span>
              <span className="text-slate-300">·</span>
              <span>Deanside, Melbourne VIC</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-4">
            {/* Quick Reset Demo Data Button */}
            <button
              type="button"
              onClick={() => setConfirmResetOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-300 bg-amber-50/90 text-xs font-bold text-amber-900 hover:bg-amber-100 transition active:scale-95 shadow-sm"
              title="Restore all default demo routes, fleet, bookings, quotes, and reviews"
            >
              <RotateCcw className="h-3.5 w-3.5 text-amber-700" />
              <span className="hidden sm:inline">Reset Demo Data</span>
            </button>

            {/* Live inquiries notification bell */}
            <Link
              to="/admin/inquiries"
              className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
              title="View Inquiries & Quotes"
            >
              <Bell className="h-5 w-5" />
              {totalAlerts > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[9px] font-extrabold text-obsidian shadow-sm animate-pulse">
                  {totalAlerts}
                </span>
              )}
            </Link>

            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              <ExternalLink className="h-3.5 w-3.5 text-gold-deep" />
              <span>Live Site</span>
            </Link>

            <div className="h-6 w-px bg-slate-200 hidden sm:block" />

            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gold-gradient flex items-center justify-center font-bold text-xs text-obsidian shadow-sm">
                GS
              </div>
              <div className="hidden md:block text-left">
                <span className="block text-xs font-bold text-slate-900 leading-tight">Gagandeep Singh</span>
                <span className="block text-[0.65rem] text-slate-500 font-medium leading-tight">Administrator</span>
              </div>
            </div>
          </div>
        </header>

        {/* Reset Confirmation Dialog */}
        <ConfirmDialog
          isOpen={confirmResetOpen}
          title="Restore Default Demo Data?"
          description="This will restore all default Melbourne fixed routes, fleet vehicles, bookings, custom quotes, testimonials, and suburban fares."
          confirmLabel="Restore All Data"
          cancelLabel="Keep Current Data"
          tone="warning"
          onConfirm={handleConfirmReset}
          onCancel={() => setConfirmResetOpen(false)}
        />

        {/* Routed Page Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-slate-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
