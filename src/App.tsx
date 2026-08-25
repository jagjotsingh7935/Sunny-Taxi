import { Suspense, lazy, useEffect } from 'react';
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useLenis } from '@/hooks/useLenis';
import { AppPreloader } from '@/components/ui/AppPreloader';
import { AdminProtectedRoute } from '@/components/admin/AdminProtectedRoute';
import { AdminLayout } from '@/components/admin/AdminLayout';

const Home = lazy(() => import('@/pages/Home'));
const Booking = lazy(() => import('@/pages/Booking'));
const FleetRoutes = lazy(() => import('@/pages/FleetRoutes'));
const Reviews = lazy(() => import('@/pages/Reviews'));
const About = lazy(() => import('@/pages/About'));
const Contact = lazy(() => import('@/pages/Contact'));

// Admin Pages
const AdminLogin = lazy(() => import('@/pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const AdminBookings = lazy(() => import('@/pages/admin/AdminBookings'));
const AdminInquiries = lazy(() => import('@/pages/admin/AdminInquiries'));
const AdminRoutes = lazy(() => import('@/pages/admin/AdminRoutes'));
const AdminFleet = lazy(() => import('@/pages/admin/AdminFleet'));
const AdminReviews = lazy(() => import('@/pages/admin/AdminReviews'));
const AdminFares = lazy(() => import('@/pages/admin/AdminFares'));
const AdminSettings = lazy(() => import('@/pages/admin/AdminSettings'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);
  return null;
}

function PageFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center gap-3 text-fluid-sm text-ink-muted">
      <Loader2 className="h-5 w-5 animate-spin text-gold-deep" />
      Loading route and vehicle data…
    </div>
  );
}

function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <p className="font-mono text-fluid-h1 font-bold gold-text">404</p>
      <h1 className="mt-4 text-fluid-h2">That road does not exist</h1>
      <p className="mt-3 text-fluid-sm text-ink-muted">
        The page you asked for is not on our map. Try the booking page — that one always works.
      </p>
      <Link to="/booking" className="btn-gold mt-7">
        Open the booking map
      </Link>
    </div>
  );
}

export default function App() {
  useLenis();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="flex min-h-screen flex-col">
      <AppPreloader />
      <ScrollToTop />
      {!isAdmin && <Navbar />}
      <main className="flex-1">
        <Suspense fallback={<PageFallback />}>
          <Routes>
            {/* Public Client Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/fleet-routes" element={<FleetRoutes />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            {/* Admin Portal Authentication */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Protected Admin Management Portal */}
            <Route
              path="/admin"
              element={
                <AdminProtectedRoute>
                  <AdminLayout />
                </AdminProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="bookings" element={<AdminBookings />} />
              <Route path="inquiries" element={<AdminInquiries />} />
              <Route path="routes" element={<AdminRoutes />} />
              <Route path="fleet" element={<AdminFleet />} />
              <Route path="reviews" element={<AdminReviews />} />
              <Route path="fares" element={<AdminFares />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      {!isAdmin && <Footer />}
    </div>
  );
}
