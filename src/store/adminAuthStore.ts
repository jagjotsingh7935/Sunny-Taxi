import { create } from 'zustand';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Owner & Dispatcher' | 'Administrator';
  lastLogin: string;
}

interface AdminAuthState {
  isAuthenticated: boolean;
  user: AdminUser | null;
  login: (email: string, pass: string) => { success: boolean; message?: string };
  logout: () => void;
}

const AUTH_STORAGE_KEY = 'sunny_taxi_admin_auth_v1';

function getStoredAuth(): { isAuthenticated: boolean; user: AdminUser | null } {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return { isAuthenticated: false, user: null };
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.isAuthenticated === 'boolean') {
      return parsed;
    }
  } catch {
    // fallback
  }
  return { isAuthenticated: false, user: null };
}

export const useAdminAuthStore = create<AdminAuthState>((set) => {
  const initial = getStoredAuth();

  return {
    isAuthenticated: initial.isAuthenticated,
    user: initial.user,

    login: (email: string, pass: string) => {
      const cleanEmail = email.trim().toLowerCase();
      const cleanPass = pass.trim();

      // Acceptable default admin credentials or any matching password
      const isValid =
        (cleanEmail === 'admin@sunnytaxi.com.au' && cleanPass === 'sunny2026') ||
        (cleanEmail === 'admin' && cleanPass === 'admin123') ||
        (cleanEmail.length >= 3 && cleanPass.length >= 4);

      if (isValid) {
        const user: AdminUser = {
          id: 'admin-gagandeep',
          name: 'Gagandeep Singh',
          email: cleanEmail.includes('@') ? cleanEmail : 'admin@sunnytaxi.com.au',
          role: 'Owner & Dispatcher',
          lastLogin: new Date().toISOString(),
        };

        const authState = { isAuthenticated: true, user };
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
        set(authState);
        return { success: true };
      }

      return { success: false, message: 'Invalid email or password. Use demo credentials.' };
    },

    logout: () => {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      set({ isAuthenticated: false, user: null });
    },
  };
});
