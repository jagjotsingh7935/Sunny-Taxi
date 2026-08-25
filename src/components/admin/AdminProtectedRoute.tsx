import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuthStore } from '@/store/adminAuthStore';

export function AdminProtectedRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAdminAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}
