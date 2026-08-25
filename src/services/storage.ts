const PREFIX = 'csc:';

export const storage = {
  read<T>(key: string, fallback: T): T {
    try {
      const raw = window.localStorage.getItem(PREFIX + key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  },

  write<T>(key: string, value: T): void {
    try {
      window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch {
      /* quota exceeded or private mode — fail quietly, state stays in memory */
    }
  },

  push<T>(key: string, value: T): T[] {
    const list = storage.read<T[]>(key, []);
    const next = [value, ...list];
    storage.write(key, next);
    return next;
  },

  clear(key: string): void {
    try {
      window.localStorage.removeItem(PREFIX + key);
    } catch {
      /* ignore */
    }
  },
};

export const STORAGE_KEYS = {
  bookings: 'bookings',
  quotes: 'quotes',
  reviews: 'reviews',
  messages: 'messages',
  customer: 'customer',
} as const;
