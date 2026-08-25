import { VICTORIA_VIEWBOX } from '@/data/brand';
import { landmarks } from '@/data/mockRoutes';
import { mockSuburbs } from '@/data/mockSuburbs';
import type { LatLng, Place, RouteGeometry } from '@/types';

const EARTH_RADIUS_KM = 6371;

const toRad = (deg: number) => (deg * Math.PI) / 180;

/** Straight-line distance between two coordinates, in kilometres. */
export function haversineKm(a: LatLng, b: LatLng): number {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

/** Melbourne road networks add roughly 28% over the crow-flies distance. */
const ROAD_FACTOR = 1.28;

/** Average door-to-door speed varies with trip length (city crawl vs freeway). */
function estimateMinutes(km: number): number {
  const avgSpeed = km < 8 ? 26 : km < 25 ? 42 : km < 60 ? 62 : 78;
  return Math.max(6, Math.round((km / avgSpeed) * 60 + 4));
}

/** Gentle bezier arc so a fallback polyline still reads as a route, not a ruler line. */
function curvedLine(from: LatLng, to: LatLng, segments = 48): LatLng[] {
  const midLat = (from.lat + to.lat) / 2;
  const midLng = (from.lng + to.lng) / 2;
  const dx = to.lng - from.lng;
  const dy = to.lat - from.lat;
  const ctrl = { lat: midLat - dx * 0.09, lng: midLng + dy * 0.09 };

  const pts: LatLng[] = [];
  for (let i = 0; i <= segments; i += 1) {
    const t = i / segments;
    const inv = 1 - t;
    pts.push({
      lat: inv * inv * from.lat + 2 * inv * t * ctrl.lat + t * t * to.lat,
      lng: inv * inv * from.lng + 2 * inv * t * ctrl.lng + t * t * to.lng,
    });
  }
  return pts;
}

export function estimateRoute(from: LatLng, to: LatLng): RouteGeometry {
  const km = Number((haversineKm(from, to) * ROAD_FACTOR).toFixed(1));
  return {
    points: curvedLine(from, to),
    distanceKm: km,
    durationMins: estimateMinutes(km),
    source: 'estimate',
  };
}

const routeCache = new Map<string, RouteGeometry>();
const geocodeCache = new Map<string, Place[]>();

/**
 * Fetches a real driving line from the public OSRM demo server and falls back to a
 * local estimate if the network is unavailable. Swap the base URL for your own OSRM,
 * Mapbox Directions or Google Directions endpoint in production.
 */
export async function fetchRoute(from: LatLng, to: LatLng): Promise<RouteGeometry> {
  const cacheKey = `${from.lat.toFixed(4)},${from.lng.toFixed(4)}->${to.lat.toFixed(4)},${to.lng.toFixed(4)}`;
  if (routeCache.has(cacheKey)) {
    return routeCache.get(cacheKey)!;
  }

  const url =
    `https://router.project-osrm.org/route/v1/driving/` +
    `${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson`;

  try {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 2500);
    const res = await fetch(url, { signal: controller.signal });
    window.clearTimeout(timeout);
    if (!res.ok) throw new Error('routing unavailable');

    const json = (await res.json()) as {
      routes?: { distance: number; duration: number; geometry: { coordinates: [number, number][] } }[];
    };
    const route = json.routes?.[0];
    if (!route) throw new Error('no route');

    const result: RouteGeometry = {
      points: route.geometry.coordinates.map(([lng, lat]) => ({ lat, lng })),
      distanceKm: Number((route.distance / 1000).toFixed(1)),
      durationMins: Math.round(route.duration / 60),
      source: 'osrm',
    };
    routeCache.set(cacheKey, result);
    return result;
  } catch {
    const estimate = estimateRoute(from, to);
    routeCache.set(cacheKey, estimate);
    return estimate;
  }
}

export const popularLocations: Place[] = [
  landmarks.tullamarine,
  landmarks.avalon,
  landmarks.cbd,
  landmarks.southernCross,
  landmarks.crown,
  { label: '37 Kidd Street, Deanside VIC 3336', suburb: 'Deanside', postcode: '3336', lat: -37.7478, lng: 144.7176 },
  { label: 'Caroline Springs Town Centre, VIC 3023', suburb: 'Caroline Springs', postcode: '3023', lat: -37.7348, lng: 144.7397 },
  landmarks.stKilda,
  { label: 'Werribee Station, VIC 3030', suburb: 'Werribee', postcode: '3030', lat: -37.9, lng: 144.6614 },
  { label: 'Box Hill Central, VIC 3128', suburb: 'Box Hill', postcode: '3128', lat: -37.8194, lng: 145.1219 },
  { label: 'Tarneit Station, VIC 3029', suburb: 'Tarneit', postcode: '3029', lat: -37.832, lng: 144.695 },
  { label: 'Frankston Pier & Station, VIC 3199', suburb: 'Frankston', postcode: '3199', lat: -38.1435, lng: 145.1224 },
];

/** Local-first suggestions: landmarks and suburbs match instantly without a network hop. */
export function localSuggestions(query: string, limit = 8): Place[] {
  const q = query.trim().toLowerCase();
  if (!q) {
    return popularLocations.slice(0, limit);
  }

  const isAirport = q.includes('air') || q.includes('mel') || q.includes('avv') || q.includes('flight') || q.includes('tulla');
  const isCbd = q.includes('cbd') || q.includes('city') || q.includes('collin') || q.includes('bourke') || q.includes('flinder');
  const isStation = q.includes('stat') || q.includes('train') || q.includes('southern') || q.includes('spencer');

  const fromLandmarks: Place[] = Object.values(landmarks).filter((p) => {
    const text = `${p.label} ${p.suburb ?? ''}`.toLowerCase();
    if (text.includes(q)) return true;
    if (isAirport && (p.label.includes('Airport') || p.suburb === 'Tullamarine' || p.suburb === 'Lara')) return true;
    if (isCbd && (p.label.includes('CBD') || p.suburb === 'Melbourne')) return true;
    if (isStation && p.label.includes('Station')) return true;
    return false;
  });

  const fromSuburbs: Place[] = mockSuburbs
    .filter((s) => s.suburb.toLowerCase().includes(q) || s.postcode.includes(q) || s.region.toLowerCase().includes(q))
    .map((s) => ({
      label: `${s.suburb} VIC ${s.postcode}`,
      suburb: s.suburb,
      postcode: s.postcode,
      lat: s.lat,
      lng: s.lng,
    }));

  const seen = new Set<string>();
  const combined = [...fromLandmarks, ...fromSuburbs];

  combined.sort((a, b) => {
    const aStarts = a.label.toLowerCase().startsWith(q) || (a.suburb?.toLowerCase().startsWith(q) ?? false);
    const bStarts = b.label.toLowerCase().startsWith(q) || (b.suburb?.toLowerCase().startsWith(q) ?? false);
    if (aStarts && !bStarts) return -1;
    if (!aStarts && bStarts) return 1;
    return 0;
  });

  return combined
    .filter((p) => {
      const key = p.label.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, limit);
}

/** Nominatim geocoding, biased to the Greater Melbourne viewbox. */
export async function geocode(query: string, limit = 5): Promise<Place[]> {
  const q = query.trim().toLowerCase();
  if (q.length < 3) return [];
  if (geocodeCache.has(q)) {
    return geocodeCache.get(q)!;
  }

  const { minLng, minLat, maxLng, maxLat } = VICTORIA_VIEWBOX;
  const url =
    `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1` +
    `&limit=${limit}&countrycodes=au&bounded=1` +
    `&viewbox=${minLng},${maxLat},${maxLng},${minLat}` +
    `&q=${encodeURIComponent(q)}`;

  try {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 3000);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    window.clearTimeout(timeout);
    if (!res.ok) throw new Error('geocoder unavailable');

    const json = (await res.json()) as {
      display_name: string;
      lat: string;
      lon: string;
      address?: { suburb?: string; town?: string; city?: string; postcode?: string };
    }[];

    const results: Place[] = json.map((r) => ({
      label: r.display_name.split(',').slice(0, 3).join(',').trim(),
      suburb: r.address?.suburb ?? r.address?.town ?? r.address?.city,
      postcode: r.address?.postcode,
      lat: Number(r.lat),
      lng: Number(r.lon),
    }));

    geocodeCache.set(q, results);
    return results;
  } catch {
    return [];
  }
}

/** Merged suggestion list: instant local hits first, live geocoder results after. */
export async function suggestPlaces(query: string): Promise<Place[]> {
  const local = localSuggestions(query, 5);
  const remote = await geocode(query, 5);
  const seen = new Set(local.map((p) => p.label.toLowerCase()));
  const merged = [...local];
  remote.forEach((p) => {
    if (!seen.has(p.label.toLowerCase())) {
      seen.add(p.label.toLowerCase());
      merged.push(p);
    }
  });
  return merged.slice(0, 8);
}
