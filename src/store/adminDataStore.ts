import { create } from 'zustand';
import { BRAND } from '@/data/brand';
import { mockRoutes } from '@/data/mockRoutes';
import { mockVehicles } from '@/data/mockVehicles';
import { mockReviews } from '@/data/mockReviews';
import { mockSuburbs } from '@/data/mockSuburbs';
import type { Booking, ContactMessage, QuoteRequest, Review, Route, SuburbFare, Vehicle } from '@/types';

export interface BookingRecord extends Booking {
  id: string;
  adminStatus: 'confirmed' | 'completed' | 'cancelled' | 'in-progress';
  driverAssigned?: string;
  adminNotes?: string;
}

export interface QuoteRecord extends QuoteRequest {
  id: string;
  adminStatus: 'received' | 'quoted' | 'accepted' | 'declined';
  quotedAmount?: number;
  adminNotes?: string;
}

export interface MessageRecord extends ContactMessage {
  id: string;
  adminStatus: 'unread' | 'read' | 'replied';
  adminNotes?: string;
}

interface AdminDataState {
  routes: Route[];
  vehicles: Vehicle[];
  reviews: Review[];
  suburbs: SuburbFare[];
  bookings: BookingRecord[];
  quotes: QuoteRecord[];
  messages: MessageRecord[];
  company: typeof BRAND;

  // Routes CRUD
  addRoute: (route: Omit<Route, 'id'>) => void;
  updateRoute: (id: string, updates: Partial<Route>) => void;
  deleteRoute: (id: string) => void;

  // Vehicles CRUD
  addVehicle: (vehicle: Vehicle) => void;
  updateVehicle: (id: string, updates: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;

  // Reviews CRUD
  addReview: (review: Omit<Review, 'id'>) => void;
  updateReview: (id: string, updates: Partial<Review>) => void;
  deleteReview: (id: string) => void;
  toggleReviewVerified: (id: string) => void;

  // Suburbs CRUD
  addSuburb: (suburb: SuburbFare) => void;
  updateSuburb: (suburbKey: string, updates: Partial<SuburbFare>) => void;
  deleteSuburb: (suburbKey: string) => void;

  // Bookings management
  addBooking: (booking: Booking) => void;
  updateBookingStatus: (id: string, status: BookingRecord['adminStatus'], notes?: string) => void;
  deleteBooking: (id: string) => void;

  // Quotes management
  addQuote: (quote: QuoteRequest) => void;
  updateQuoteStatus: (id: string, status: QuoteRecord['adminStatus'], quotedAmount?: number, notes?: string) => void;
  deleteQuote: (id: string) => void;

  // Contact Messages management
  addMessage: (message: ContactMessage) => void;
  updateMessageStatus: (id: string, status: MessageRecord['adminStatus']) => void;
  deleteMessage: (id: string) => void;

  // Company Settings
  updateCompany: (updates: Partial<typeof BRAND>) => void;

  // Restore defaults
  resetToDefaults: () => void;
}

const STORAGE_KEYS = {
  routes: 'sunny_taxi_routes_v1',
  vehicles: 'sunny_taxi_vehicles_v1',
  reviews: 'sunny_taxi_reviews_v1',
  suburbs: 'sunny_taxi_suburbs_v1',
  bookings: 'sunny_taxi_bookings_v1',
  quotes: 'sunny_taxi_quotes_v1',
  messages: 'sunny_taxi_messages_v1',
  company: 'sunny_taxi_company_v1',
};

// Initial sample bookings to give the admin portal rich, realistic initial data
const sampleBookings: BookingRecord[] = [
  {
    id: 'BK-MEL-7821',
    reference: 'MEL-7821',
    createdAt: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
    type: 'fixed-route',
    routeId: 'mel-deanside',
    pickup: { label: 'Terminal 2, Melbourne Airport (MEL)', lat: -37.669, lng: 144.841, suburb: 'Tullamarine' },
    dropoff: { label: '37 Kidd Street, Deanside VIC 3336', lat: -37.747, lng: 144.7085, suburb: 'Deanside' },
    vehicleId: 'silver-sedan',
    vehicleName: 'Sedan Taxi (Toyota Camry Hybrid)',
    scheduledFor: new Date(Date.now() + 3600 * 1000 * 18).toISOString(),
    passengers: 2,
    addons: {
      boosterSeats: 0,
      babyCapsules: 0,
      meetAndGreet: true,
      flightNumber: 'QF482',
      extraStop: false,
      notes: 'Flight arriving at Terminal 2, international baggage hall.',
    },
    distanceKm: 24.5,
    durationMins: 22,
    fareBreakdown: [
      { label: 'Fixed Route Base Fare', amount: 62 },
      { label: 'Airport Tolls & Parking Access', amount: 0, note: 'Included' },
    ],
    total: 62,
    paymentMethod: 'pay-driver',
    paymentStatus: 'pay-on-arrival',
    customer: {
      name: 'Michael Thompson',
      email: 'm.thompson@westnet.com.au',
      phone: '+61 412 884 192',
    },
    status: 'confirmed',
    adminStatus: 'confirmed',
    driverAssigned: 'Gagandeep Singh',
  },
  {
    id: 'BK-MEL-7809',
    reference: 'MEL-7809',
    createdAt: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
    type: 'fixed-route',
    routeId: 'mel-cbd',
    pickup: { label: 'Melbourne Airport Terminal 1', lat: -37.669, lng: 144.841, suburb: 'Tullamarine' },
    dropoff: { label: 'Crown Towers, 8 Whiteman St, Southbank VIC 3006', lat: -37.8236, lng: 144.9587, suburb: 'Southbank' },
    vehicleId: 'prestige-suv',
    vehicleName: 'SUV / 7-Seater (Toyota Kluger)',
    scheduledFor: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
    passengers: 5,
    addons: {
      boosterSeats: 1,
      babyCapsules: 0,
      meetAndGreet: true,
      flightNumber: 'VA214',
      extraStop: false,
      notes: 'Family trip with 4 large suitcases.',
    },
    distanceKm: 26.2,
    durationMins: 28,
    fareBreakdown: [
      { label: 'Fixed Route Base Fare', amount: 65 },
      { label: 'SUV 7-Seater Upgrade', amount: 32 },
    ],
    total: 97,
    paymentMethod: 'card-online',
    paymentStatus: 'paid',
    customer: {
      name: 'Sarah Jenkins',
      email: 'sarah.j@outlook.com',
      phone: '+61 428 991 304',
    },
    status: 'confirmed',
    adminStatus: 'completed',
    driverAssigned: 'Gagandeep Singh',
  },
];

// Sample custom quote inquiries
const sampleQuotes: QuoteRecord[] = [
  {
    id: 'QT-VIC-1044',
    reference: 'QT-VIC-1044',
    createdAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
    type: 'custom-quote',
    pickup: { label: 'Caroline Springs Town Centre, VIC 3023', lat: -37.734, lng: 144.739, suburb: 'Caroline Springs' },
    dropoff: { label: 'Chandon Winery, Maroondah Hwy, Coldstream VIC 3770', lat: -37.689, lng: 145.412, suburb: 'Coldstream' },
    scheduledFor: new Date(Date.now() + 3600 * 1000 * 72).toISOString(),
    adults: 6,
    children: 0,
    babySeat: 'none',
    carryOnBags: 2,
    largeBags: 2,
    vehicleId: 'maxi-van',
    distanceKm: 78.4,
    durationMins: 75,
    indicativeFrom: 195,
    indicativeTo: 245,
    customer: {
      name: 'David Reynolds',
      email: 'david.reynolds@reynoldseng.com.au',
      phone: '+61 403 772 811',
    },
    occasion: 'Full Day Corporate Winery Tour & Team Return',
    notes: 'Would like pickup at 9:30 AM and return transfer from Coldstream at 4:30 PM.',
    status: 'received',
    adminStatus: 'received',
    quotedAmount: 220,
  },
  {
    id: 'QT-VIC-1039',
    reference: 'QT-VIC-1039',
    createdAt: new Date(Date.now() - 3600 * 1000 * 16).toISOString(),
    type: 'custom-quote',
    pickup: { label: '34 Station Street, Werribee VIC 3030', lat: -37.902, lng: 144.663, suburb: 'Werribee' },
    dropoff: { label: 'Avalon Airport (AVV), 80 Beach Rd, Lara VIC 3212', lat: -38.0394, lng: 144.4694, suburb: 'Lara' },
    scheduledFor: new Date(Date.now() + 3600 * 1000 * 30).toISOString(),
    adults: 3,
    children: 1,
    babySeat: 'forward-facing-toddler',
    carryOnBags: 4,
    largeBags: 3,
    vehicleId: 'prestige-suv',
    distanceKm: 28.5,
    durationMins: 24,
    indicativeFrom: 65,
    indicativeTo: 85,
    customer: {
      name: 'Priya Sharma',
      email: 'priya.sharma91@gmail.com',
      phone: '+61 419 655 420',
    },
    occasion: 'Family Holiday Jetstar flight',
    notes: 'Please bring clean toddler forward-facing child seat.',
    status: 'received',
    adminStatus: 'quoted',
    quotedAmount: 75,
  },
];

// Sample messages
const sampleMessages: MessageRecord[] = [
  {
    id: 'MSG-301',
    reference: 'MSG-301',
    createdAt: new Date(Date.now() - 3600 * 1000 * 5).toISOString(),
    name: 'Aged Care Services Western Suburbs',
    email: 'coordinator@westernagedcare.org.au',
    phone: '+61 3 9366 1120',
    subject: 'Regular Daily Transport Account inquiry',
    message: 'Hello Gagandeep, we are seeking regular weekday transport for our clients in Deanside and Caroline Springs. Do you offer weekly business invoicing?',
    adminStatus: 'unread',
  },
];

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export const useAdminDataStore = create<AdminDataState>((set, get) => ({
  routes: loadFromStorage(STORAGE_KEYS.routes, mockRoutes),
  vehicles: loadFromStorage(STORAGE_KEYS.vehicles, mockVehicles),
  reviews: loadFromStorage(STORAGE_KEYS.reviews, mockReviews),
  suburbs: loadFromStorage(STORAGE_KEYS.suburbs, mockSuburbs),
  bookings: loadFromStorage(STORAGE_KEYS.bookings, sampleBookings),
  quotes: loadFromStorage(STORAGE_KEYS.quotes, sampleQuotes),
  messages: loadFromStorage(STORAGE_KEYS.messages, sampleMessages),
  company: loadFromStorage(STORAGE_KEYS.company, BRAND),

  // Routes
  addRoute: (route) => {
    const id = `route-${Date.now()}`;
    const newRoute: Route = { ...route, id };
    const updated = [newRoute, ...get().routes];
    saveToStorage(STORAGE_KEYS.routes, updated);
    set({ routes: updated });
  },

  updateRoute: (id, updates) => {
    const updated = get().routes.map((r) => (r.id === id ? { ...r, ...updates } : r));
    saveToStorage(STORAGE_KEYS.routes, updated);
    set({ routes: updated });
  },

  deleteRoute: (id) => {
    const updated = get().routes.filter((r) => r.id !== id);
    saveToStorage(STORAGE_KEYS.routes, updated);
    set({ routes: updated });
  },

  // Vehicles
  addVehicle: (vehicle) => {
    const updated = [...get().vehicles, vehicle];
    saveToStorage(STORAGE_KEYS.vehicles, updated);
    set({ vehicles: updated });
  },

  updateVehicle: (id, updates) => {
    const updated = get().vehicles.map((v) => (v.id === id ? { ...v, ...updates } : v));
    saveToStorage(STORAGE_KEYS.vehicles, updated);
    set({ vehicles: updated });
  },

  deleteVehicle: (id) => {
    const updated = get().vehicles.filter((v) => v.id !== id);
    saveToStorage(STORAGE_KEYS.vehicles, updated);
    set({ vehicles: updated });
  },

  // Reviews
  addReview: (review) => {
    const id = `rev-${Date.now()}`;
    const newReview: Review = { ...review, id };
    const updated = [newReview, ...get().reviews];
    saveToStorage(STORAGE_KEYS.reviews, updated);
    set({ reviews: updated });
  },

  updateReview: (id, updates) => {
    const updated = get().reviews.map((r) => (r.id === id ? { ...r, ...updates } : r));
    saveToStorage(STORAGE_KEYS.reviews, updated);
    set({ reviews: updated });
  },

  deleteReview: (id) => {
    const updated = get().reviews.filter((r) => r.id !== id);
    saveToStorage(STORAGE_KEYS.reviews, updated);
    set({ reviews: updated });
  },

  toggleReviewVerified: (id) => {
    const updated = get().reviews.map((r) => (r.id === id ? { ...r, verified: !r.verified } : r));
    saveToStorage(STORAGE_KEYS.reviews, updated);
    set({ reviews: updated });
  },

  // Suburbs
  addSuburb: (suburb) => {
    const updated = [...get().suburbs, suburb];
    saveToStorage(STORAGE_KEYS.suburbs, updated);
    set({ suburbs: updated });
  },

  updateSuburb: (suburbKey, updates) => {
    const updated = get().suburbs.map((s) =>
      `${s.suburb}-${s.postcode}` === suburbKey ? { ...s, ...updates } : s,
    );
    saveToStorage(STORAGE_KEYS.suburbs, updated);
    set({ suburbs: updated });
  },

  deleteSuburb: (suburbKey) => {
    const updated = get().suburbs.filter((s) => `${s.suburb}-${s.postcode}` !== suburbKey);
    saveToStorage(STORAGE_KEYS.suburbs, updated);
    set({ suburbs: updated });
  },

  // Bookings
  addBooking: (booking) => {
    const newRecord: BookingRecord = {
      ...booking,
      id: booking.reference || `BK-${Date.now()}`,
      adminStatus: 'confirmed',
      driverAssigned: 'Gagandeep Singh',
    };
    const updated = [newRecord, ...get().bookings];
    saveToStorage(STORAGE_KEYS.bookings, updated);
    set({ bookings: updated });
  },

  updateBookingStatus: (id, status, notes) => {
    const updated = get().bookings.map((b) =>
      b.id === id ? { ...b, adminStatus: status, ...(notes ? { adminNotes: notes } : {}) } : b,
    );
    saveToStorage(STORAGE_KEYS.bookings, updated);
    set({ bookings: updated });
  },

  deleteBooking: (id) => {
    const updated = get().bookings.filter((b) => b.id !== id);
    saveToStorage(STORAGE_KEYS.bookings, updated);
    set({ bookings: updated });
  },

  // Quotes
  addQuote: (quote) => {
    const newRecord: QuoteRecord = {
      ...quote,
      id: quote.reference || `QT-${Date.now()}`,
      adminStatus: 'received',
      quotedAmount: quote.indicativeFrom,
    };
    const updated = [newRecord, ...get().quotes];
    saveToStorage(STORAGE_KEYS.quotes, updated);
    set({ quotes: updated });
  },

  updateQuoteStatus: (id, status, quotedAmount, notes) => {
    const updated = get().quotes.map((q) =>
      q.id === id
        ? {
            ...q,
            adminStatus: status,
            ...(quotedAmount !== undefined ? { quotedAmount } : {}),
            ...(notes ? { adminNotes: notes } : {}),
          }
        : q,
    );
    saveToStorage(STORAGE_KEYS.quotes, updated);
    set({ quotes: updated });
  },

  deleteQuote: (id) => {
    const updated = get().quotes.filter((q) => q.id !== id);
    saveToStorage(STORAGE_KEYS.quotes, updated);
    set({ quotes: updated });
  },

  // Contact messages
  addMessage: (message) => {
    const newRecord: MessageRecord = {
      ...message,
      id: message.reference || `MSG-${Date.now()}`,
      adminStatus: 'unread',
    };
    const updated = [newRecord, ...get().messages];
    saveToStorage(STORAGE_KEYS.messages, updated);
    set({ messages: updated });
  },

  updateMessageStatus: (id, status) => {
    const updated = get().messages.map((m) => (m.id === id ? { ...m, adminStatus: status } : m));
    saveToStorage(STORAGE_KEYS.messages, updated);
    set({ messages: updated });
  },

  deleteMessage: (id) => {
    const updated = get().messages.filter((m) => m.id !== id);
    saveToStorage(STORAGE_KEYS.messages, updated);
    set({ messages: updated });
  },

  // Company Settings
  updateCompany: (updates) => {
    const updated = { ...get().company, ...updates };
    saveToStorage(STORAGE_KEYS.company, updated);
    set({ company: updated });
  },

  // Reset
  resetToDefaults: () => {
    saveToStorage(STORAGE_KEYS.routes, mockRoutes);
    saveToStorage(STORAGE_KEYS.vehicles, mockVehicles);
    saveToStorage(STORAGE_KEYS.reviews, mockReviews);
    saveToStorage(STORAGE_KEYS.suburbs, mockSuburbs);
    saveToStorage(STORAGE_KEYS.bookings, sampleBookings);
    saveToStorage(STORAGE_KEYS.quotes, sampleQuotes);
    saveToStorage(STORAGE_KEYS.messages, sampleMessages);
    saveToStorage(STORAGE_KEYS.company, BRAND);

    set({
      routes: mockRoutes,
      vehicles: mockVehicles,
      reviews: mockReviews,
      suburbs: mockSuburbs,
      bookings: sampleBookings,
      quotes: sampleQuotes,
      messages: sampleMessages,
      company: BRAND,
    });
  },
}));
