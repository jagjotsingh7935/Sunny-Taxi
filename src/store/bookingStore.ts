import { create } from 'zustand';
import { MELBOURNE_CENTER } from '@/data/brand';
import { getRoute } from '@/data/mockRoutes';
import { fetchRoute } from '@/services/geo';
import type { LatLng, Place, RouteGeometry, VehicleClassId } from '@/types';

export type BookingTab = 'fixed' | 'custom';

interface BookingState {
  tab: BookingTab;
  pickup: Place | null;
  dropoff: Place | null;
  selectedRouteId: string | null;
  vehicleId: VehicleClassId;
  geometry: RouteGeometry | null;
  routing: boolean;
  mapFocus: LatLng;
  lastReference: string | null;

  setTab: (tab: BookingTab) => void;
  setPickup: (place: Place | null) => void;
  setDropoff: (place: Place | null) => void;
  setVehicle: (id: VehicleClassId) => void;
  applyRoute: (routeId: string) => void;
  swapEnds: () => void;
  resetTrip: () => void;
  setLastReference: (ref: string | null) => void;
  recalculate: () => Promise<void>;
}

let recalcTimer: ReturnType<typeof setTimeout> | undefined;

export const useBookingStore = create<BookingState>((set, get) => ({
  tab: 'fixed',
  pickup: null,
  dropoff: null,
  selectedRouteId: null,
  vehicleId: 'silver-sedan',
  geometry: null,
  routing: false,
  mapFocus: MELBOURNE_CENTER,
  lastReference: null,

  setTab: (tab) => set({ tab }),

  setPickup: (place) => {
    const prev = get().pickup;
    if (prev && place && prev.lat === place.lat && prev.lng === place.lng && prev.label === place.label) {
      return;
    }
    set({
      pickup: place,
      selectedRouteId: null,
      mapFocus: place ? { lat: place.lat, lng: place.lng } : get().mapFocus,
    });
    if (recalcTimer) clearTimeout(recalcTimer);
    recalcTimer = setTimeout(() => {
      void get().recalculate();
    }, 180);
  },

  setDropoff: (place) => {
    const prev = get().dropoff;
    if (prev && place && prev.lat === place.lat && prev.lng === place.lng && prev.label === place.label) {
      return;
    }
    set({
      dropoff: place,
      selectedRouteId: null,
      mapFocus: place ? { lat: place.lat, lng: place.lng } : get().mapFocus,
    });
    if (recalcTimer) clearTimeout(recalcTimer);
    recalcTimer = setTimeout(() => {
      void get().recalculate();
    }, 180);
  },

  setVehicle: (vehicleId) => set({ vehicleId }),

  applyRoute: (routeId) => {
    const route = getRoute(routeId);
    if (!route) return;
    set({
      selectedRouteId: routeId,
      pickup: route.from,
      dropoff: route.to,
      mapFocus: { lat: route.from.lat, lng: route.from.lng },
    });
    void get().recalculate();
  },

  swapEnds: () => {
    const { pickup, dropoff } = get();
    set({ pickup: dropoff, dropoff: pickup, selectedRouteId: null });
    void get().recalculate();
  },

  resetTrip: () =>
    set({
      pickup: null,
      dropoff: null,
      selectedRouteId: null,
      geometry: null,
      mapFocus: MELBOURNE_CENTER,
    }),

  setLastReference: (lastReference) => set({ lastReference }),

  recalculate: async () => {
    const { pickup, dropoff } = get();
    if (!pickup || !dropoff) {
      set({ geometry: null, routing: false });
      return;
    }
    set({ routing: true });
    const geometry = await fetchRoute(pickup, dropoff);
    set({ geometry, routing: false });
  },
}));
