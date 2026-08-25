export type VehicleClassId = 'silver-sedan' | 'european-premium' | 'prestige-suv' | 'maxi-van';

export interface Vehicle {
  id: VehicleClassId;
  name: string;
  tagline: string;
  description: string;
  models: string[];
  image: string;
  passengers: number;
  carryOn: number;
  largeSuitcases: number;
  baseFare: number;
  perKm: number;
  minimumFare: number;
  multiplier: number;
  wifi: boolean;
  babySeatCompatible: boolean;
  tintedGlass: boolean;
  features: string[];
  badge?: string;
}

export interface LatLng {
  lat: number;
  lng: number;
}

export interface Place extends LatLng {
  label: string;
  suburb?: string;
  postcode?: string;
}

export interface Route {
  id: string;
  from: Place;
  to: Place;
  label: string;
  shortLabel: string;
  category: 'airport' | 'city' | 'tour' | 'regional' | 'suburban';
  distanceKm: number;
  durationMins: number;
  fixedPrice: number;
  popular: boolean;
  note?: string;
}

export interface SuburbFare {
  suburb: string;
  postcode: string;
  region: string;
  lat: number;
  lng: number;
  toCbd: number;
  toTullamarine: number;
  distanceFromCbdKm: number;
}

export interface RouteGeometry {
  points: LatLng[];
  distanceKm: number;
  durationMins: number;
  source: 'osrm' | 'estimate';
}

export type BabySeatType = 'none' | 'rear-facing-capsule' | 'forward-facing-toddler' | 'booster';

export type PaymentMethod = 'card-online' | 'pay-driver';

export interface BookingAddons {
  boosterSeats: number;
  babyCapsules: number;
  meetAndGreet: boolean;
  flightNumber: string;
  extraStop: boolean;
  notes: string;
}

export interface Booking {
  reference: string;
  createdAt: string;
  type: 'fixed-route';
  routeId?: string;
  pickup: Place;
  dropoff: Place;
  vehicleId: VehicleClassId;
  vehicleName: string;
  scheduledFor: string;
  passengers: number;
  addons: BookingAddons;
  distanceKm: number;
  durationMins: number;
  fareBreakdown: FareLine[];
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'paid' | 'pay-on-arrival';
  customer: CustomerDetails;
  status: 'confirmed';
}

export interface FareLine {
  label: string;
  amount: number;
  note?: string;
}

export interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
}

export interface QuoteRequest {
  reference: string;
  createdAt: string;
  type: 'custom-quote';
  pickup: Place;
  dropoff: Place;
  scheduledFor: string;
  adults: number;
  children: number;
  babySeat: BabySeatType;
  carryOnBags: number;
  largeBags: number;
  vehicleId: VehicleClassId | 'recommend';
  distanceKm: number;
  durationMins: number;
  indicativeFrom: number;
  indicativeTo: number;
  customer: CustomerDetails;
  occasion: string;
  notes: string;
  status: 'received';
}

export type ReviewSubject = 'driver' | 'service';

export type TripType = 'Airport Transfer' | 'Corporate Travel' | 'Winery Tour' | 'Maxi Van' | 'Event Transfer';

export interface Review {
  id: string;
  subject: ReviewSubject;
  name: string;
  suburb: string;
  driverName?: string;
  tripType: TripType;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
  vehicle?: string;
}

export interface ContactMessage {
  reference: string;
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface ApiResult<T> {
  ok: boolean;
  data: T;
  message: string;
}
