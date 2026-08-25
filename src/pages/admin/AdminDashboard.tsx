import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CalendarCheck,
  Car,
  CheckCircle2,
  Clock,
  DollarSign,
  MapPin,
  MessageSquare,
  Plus,
  Route as RouteIcon,
  Star,
  TrendingUp,
  User,
  Zap,
} from 'lucide-react';
import { useAdminDataStore } from '@/store/adminDataStore';
import { currency } from '@/services/pricing';

export default function AdminDashboard() {
  const { routes, vehicles, reviews, suburbs, bookings, quotes, messages } = useAdminDataStore();

  const activeBookings = bookings.filter((b) => b.adminStatus === 'confirmed');
  const pendingQuotes = quotes.filter((q) => q.adminStatus === 'received');
  const unreadMessages = messages.filter((m) => m.adminStatus === 'unread');

  const avgRating = reviews.length
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  const stats = [
    {
      title: 'Total Bookings',
      value: bookings.length,
      sub: `${activeBookings.length} active scheduled`,
      icon: CalendarCheck,
      color: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30',
      to: '/admin/bookings',
    },
    {
      title: 'Pending Quotes & Inquiries',
      value: pendingQuotes.length + unreadMessages.length,
      sub: `${pendingQuotes.length} custom quotes, ${unreadMessages.length} messages`,
      icon: MessageSquare,
      color: 'bg-amber-500/10 text-amber-800 border-amber-500/30',
      to: '/admin/inquiries',
    },
    {
      title: 'Published Fixed Routes',
      value: routes.length,
      sub: 'Melbourne Airport & Suburbs',
      icon: RouteIcon,
      color: 'bg-blue-500/10 text-blue-700 border-blue-500/30',
      to: '/admin/routes',
    },
    {
      title: 'Active Fleet Vehicles',
      value: vehicles.length,
      sub: 'Sedans, SUVs & Maxi Vans',
      icon: Car,
      color: 'bg-purple-500/10 text-purple-700 border-purple-500/30',
      to: '/admin/fleet',
    },
    {
      title: 'Customer Testimonials',
      value: `${avgRating} ★`,
      sub: `${reviews.length} verified 5-star reviews`,
      icon: Star,
      color: 'bg-gold/15 text-gold-deep border-gold/40',
      to: '/admin/reviews',
    },
    {
      title: 'Suburban Fare Matrix',
      value: suburbs.length,
      sub: 'Metropolitan VIC postcodes',
      icon: DollarSign,
      color: 'bg-slate-500/10 text-slate-800 border-slate-300',
      to: '/admin/fares',
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gold/15 text-gold-deep text-xs font-bold uppercase tracking-wider mb-2">
            Live Dispatch Overview
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, Gagandeep
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
            Sunny Taxi Service — Metropolitan Melbourne &amp; Airport Passenger Transport Operations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/routes"
            className="flex items-center gap-1.5 rounded-xl bg-gold-gradient px-3.5 py-2 text-xs font-bold text-obsidian shadow-sm transition hover:brightness-105 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>Add Route</span>
          </Link>
          <Link
            to="/admin/fleet"
            className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50 transition active:scale-95 shadow-sm"
          >
            <Car className="h-4 w-4 text-gold-deep" />
            <span>Manage Fleet</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.title}
              to={item.to}
              className="group relative bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-gold-deep/50 transition-all duration-200 flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {item.title}
                  </p>
                  <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 tracking-tight">
                    {item.value}
                  </p>
                </div>
                <div className={`p-3 rounded-xl border ${item.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">{item.sub}</span>
                <span className="font-bold text-gold-deep group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  Manage <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Two Column Layout: Recent Bookings & Pending Quotes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Fixed Bookings */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <CalendarCheck className="h-4 w-4 text-emerald-600" />
              <h2 className="text-sm font-bold text-slate-900">Recent Fixed Bookings</h2>
            </div>
            <Link
              to="/admin/bookings"
              className="text-xs font-bold text-gold-deep hover:underline"
            >
              View all ({bookings.length})
            </Link>
          </div>

          {bookings.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">No bookings recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {bookings.slice(0, 3).map((b) => (
                <div
                  key={b.id}
                  className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50 hover:bg-white hover:border-gold-deep/40 transition space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-extrabold text-slate-900">
                      {b.reference}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[0.65rem] font-extrabold uppercase tracking-wide ${
                        b.adminStatus === 'confirmed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : b.adminStatus === 'completed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {b.adminStatus}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-slate-900 truncate">
                    {b.pickup.suburb || b.pickup.label.split(',')[0]} →{' '}
                    {b.dropoff.suburb || b.dropoff.label.split(',')[0]}
                  </p>

                  <div className="flex items-center justify-between text-[0.7rem] text-slate-600 pt-1 border-t border-slate-200/60">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3 text-gold-deep" />
                      {b.customer.name}
                    </span>
                    <span className="font-bold text-slate-900">{currency(b.total)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Quotes & Inquiries */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-amber-600" />
              <h2 className="text-sm font-bold text-slate-900">Custom Quotes &amp; Inquiries</h2>
            </div>
            <Link
              to="/admin/inquiries"
              className="text-xs font-bold text-gold-deep hover:underline"
            >
              View all ({quotes.length + messages.length})
            </Link>
          </div>

          {quotes.length === 0 && messages.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">No pending inquiries.</p>
          ) : (
            <div className="space-y-3">
              {quotes.slice(0, 3).map((q) => (
                <div
                  key={q.id}
                  className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50 hover:bg-white hover:border-gold-deep/40 transition space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-extrabold text-amber-900">
                      {q.reference}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[0.65rem] font-extrabold uppercase tracking-wide ${
                        q.adminStatus === 'received'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {q.adminStatus}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-slate-900 truncate">
                    {q.pickup.suburb || q.pickup.label.split(',')[0]} →{' '}
                    {q.dropoff.suburb || q.dropoff.label.split(',')[0]}
                  </p>

                  <div className="flex items-center justify-between text-[0.7rem] text-slate-600 pt-1 border-t border-slate-200/60">
                    <span className="flex items-center gap-1 truncate">
                      <User className="h-3 w-3 text-gold-deep shrink-0" />
                      {q.customer.name} ({q.adults + q.children} pax)
                    </span>
                    <span className="font-bold text-gold-deep">
                      {q.quotedAmount ? currency(q.quotedAmount) : 'Pending Quote'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
