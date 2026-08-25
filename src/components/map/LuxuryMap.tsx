import { useEffect, useMemo, useState } from 'react';
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Clock, Layers, Loader2, MapPin, Navigation, Route as RouteIcon } from 'lucide-react';
import { MELBOURNE_CENTER } from '@/data/brand';
import { useBookingStore } from '@/store/bookingStore';
import type { LatLng, Place, RouteGeometry } from '@/types';

/* ------------------------- Key Melbourne Locations / Hubs ------------------------- */

interface MelbourneHub {
  id: string;
  name: string;
  suburb: string;
  postcode: string;
  lat: number;
  lng: number;
  emoji: string;
  category: 'airport' | 'base' | 'cbd' | 'landmark' | 'suburb';
}

const melbourneHubs: MelbourneHub[] = [
  {
    id: 'mel-airport',
    name: 'Melbourne Airport (MEL)',
    suburb: 'Tullamarine',
    postcode: '3043',
    lat: -37.669,
    lng: 144.841,
    emoji: '✈️',
    category: 'airport',
  },
  {
    id: 'avv-airport',
    name: 'Avalon Airport (AVV)',
    suburb: 'Lara',
    postcode: '3212',
    lat: -38.0394,
    lng: 144.4694,
    emoji: '✈️',
    category: 'airport',
  },
  {
    id: 'deanside-base',
    name: 'Sunny Taxi Deanside Base',
    suburb: 'Deanside',
    postcode: '3336',
    lat: -37.747,
    lng: 144.7085,
    emoji: '🚕',
    category: 'base',
  },
  {
    id: 'melbourne-cbd',
    name: 'Melbourne CBD / Southern Cross',
    suburb: 'Melbourne CBD',
    postcode: '3000',
    lat: -37.818,
    lng: 144.9525,
    emoji: '🏙️',
    category: 'cbd',
  },
  {
    id: 'flinders-st',
    name: 'Flinders St & Federation Sq',
    suburb: 'Melbourne CBD',
    postcode: '3000',
    lat: -37.8183,
    lng: 144.9671,
    emoji: '🏛️',
    category: 'cbd',
  },
  {
    id: 'crown-southbank',
    name: 'Crown Melbourne & Southbank',
    suburb: 'Southbank',
    postcode: '3006',
    lat: -37.8236,
    lng: 144.9587,
    emoji: '👑',
    category: 'landmark',
  },
  {
    id: 'mcg-park',
    name: 'MCG / Melbourne Park Arena',
    suburb: 'East Melbourne',
    postcode: '3002',
    lat: -37.82,
    lng: 144.9834,
    emoji: '🏟️',
    category: 'landmark',
  },
  {
    id: 'st-kilda',
    name: 'St Kilda Beach & Acland St',
    suburb: 'St Kilda',
    postcode: '3182',
    lat: -37.8675,
    lng: 144.9721,
    emoji: '🏖️',
    category: 'landmark',
  },
  {
    id: 'brighton-beach',
    name: 'Brighton Bathing Boxes',
    suburb: 'Brighton',
    postcode: '3186',
    lat: -37.9175,
    lng: 144.987,
    emoji: '🏖️',
    category: 'suburb',
  },
  {
    id: 'chadstone',
    name: 'Chadstone Fashion Capital',
    suburb: 'Chadstone',
    postcode: '3148',
    lat: -37.886,
    lng: 145.083,
    emoji: '🛍️',
    category: 'landmark',
  },
  {
    id: 'caroline-springs',
    name: 'Caroline Springs Town Centre',
    suburb: 'Caroline Springs',
    postcode: '3023',
    lat: -37.734,
    lng: 144.739,
    emoji: '🏘️',
    category: 'suburb',
  },
  {
    id: 'werribee-hub',
    name: 'Werribee & Point Cook Hub',
    suburb: 'Werribee',
    postcode: '3030',
    lat: -37.902,
    lng: 144.663,
    emoji: '🌳',
    category: 'suburb',
  },
  {
    id: 'tarneit-truganina',
    name: 'Tarneit & Truganina Central',
    suburb: 'Tarneit',
    postcode: '3029',
    lat: -37.832,
    lng: 144.695,
    emoji: '🏘️',
    category: 'suburb',
  },
  {
    id: 'box-hill',
    name: 'Box Hill Central',
    suburb: 'Box Hill',
    postcode: '3128',
    lat: -37.819,
    lng: 145.1215,
    emoji: '🏬',
    category: 'suburb',
  },
  {
    id: 'frankston',
    name: 'Frankston & Peninsula Gateway',
    suburb: 'Frankston',
    postcode: '3199',
    lat: -38.1435,
    lng: 145.1215,
    emoji: '🌊',
    category: 'suburb',
  },
  {
    id: 'geelong',
    name: 'Geelong City Waterfront',
    suburb: 'Geelong',
    postcode: '3220',
    lat: -38.143,
    lng: 144.362,
    emoji: '⛵',
    category: 'landmark',
  },
  {
    id: 'yarra-valley',
    name: 'Yarra Valley Wine Region',
    suburb: 'Healesville',
    postcode: '3777',
    lat: -37.656,
    lng: 145.513,
    emoji: '🍷',
    category: 'landmark',
  },
  {
    id: 'mornington',
    name: 'Mornington Peninsula',
    suburb: 'Mornington',
    postcode: '3931',
    lat: -38.221,
    lng: 145.039,
    emoji: '🌊',
    category: 'landmark',
  },
];

/* ------------------------- Custom map pins ------------------------- */

const pinSvg = (fill: string, glow: string, glyph: string) => `
  <div style="position:relative;width:42px;height:52px">
    <span style="position:absolute;left:50%;top:34px;transform:translate(-50%,-50%);
      width:26px;height:26px;border-radius:50%;background:${glow};opacity:.35;
      animation:pulse-ring 2.2s cubic-bezier(.22,1,.36,1) infinite"></span>
    <svg width="42" height="52" viewBox="0 0 42 52" fill="none" xmlns="http://www.w3.org/2000/svg"
      style="position:relative;filter:drop-shadow(0 8px 14px rgba(0,0,0,.65))">
      <path d="M21 51C21 51 38 33.8 38 20.6C38 10.3 30.4 2 21 2C11.6 2 4 10.3 4 20.6C4 33.8 21 51 21 51Z"
        fill="${fill}" stroke="rgba(11,15,25,.9)" stroke-width="2"/>
      <circle cx="21" cy="20" r="8.5" fill="#0B0F19"/>
      <text x="21" y="24.5" text-anchor="middle" font-size="10" font-weight="700"
        font-family="Plus Jakarta Sans, Inter, sans-serif" fill="${fill}">${glyph}</text>
    </svg>
  </div>`;

const makeIcon = (fill: string, glow: string, glyph: string) =>
  L.divIcon({
    className: 'csc-pin-wrap',
    html: pinSvg(fill, glow, glyph),
    iconSize: [42, 52],
    iconAnchor: [21, 51],
    popupAnchor: [0, -46],
  });

const pickupIcon = makeIcon('#D4AF37', '#D4AF37', 'A');
const dropoffIcon = makeIcon('#1E293B', '#334155', 'B');

const hubIcon = (name: string, emoji: string) =>
  L.divIcon({
    className: 'csc-hub-pin',
    html: `<div style="display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:9999px;background:rgba(255,255,255,0.96);border:1.5px solid #d97706;box-shadow:0 3px 10px rgba(0,0,0,0.18);font-family:Plus Jakarta Sans,sans-serif;font-size:11px;font-weight:700;color:#0f172a;white-space:nowrap;cursor:pointer;transition:transform 0.15s ease;">
      <span>${emoji}</span>
      <span>${name}</span>
    </div>`,
    iconSize: [130, 26],
    iconAnchor: [65, 13],
  });

/* ---------------------- Camera choreography ---------------------- */

interface CameraProps {
  pickup: Place | null;
  dropoff: Place | null;
  points: LatLng[];
}

function MapCamera({ pickup, dropoff, points }: CameraProps) {
  const map = useMap();

  useEffect(() => {
    if (pickup && dropoff) {
      const coords: L.LatLngExpression[] =
        points.length > 1
          ? points.map((p) => [p.lat, p.lng])
          : [
              [pickup.lat, pickup.lng],
              [dropoff.lat, dropoff.lng],
            ];
      map.flyToBounds(L.latLngBounds(coords), {
        padding: [60, 60],
        duration: 1.5,
        easeLinearity: 0.22,
        maxZoom: 15,
      });
      return;
    }

    const single = pickup ?? dropoff;
    if (single) {
      map.flyTo([single.lat, single.lng], 15, { duration: 1.4, easeLinearity: 0.24 });
    }
  }, [map, pickup, dropoff, points]);

  return null;
}

/** Keeps Leaflet's internal size correct when the split-screen layout reflows. */
function ResizeGuard() {
  const map = useMap();
  useEffect(() => {
    const invalidate = () => map.invalidateSize();
    const id = window.setTimeout(invalidate, 260);
    window.addEventListener('resize', invalidate);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener('resize', invalidate);
    };
  }, [map]);
  return null;
}

/* --------------------------- Component --------------------------- */

interface LuxuryMapProps {
  pickup: Place | null;
  dropoff: Place | null;
  geometry: RouteGeometry | null;
  routing?: boolean;
  className?: string;
  showOverlay?: boolean;
  interactive?: boolean;
  zoom?: number;
}

export function LuxuryMap({
  pickup,
  dropoff,
  geometry,
  routing = false,
  className = '',
  showOverlay = true,
  interactive = true,
  zoom = 12,
}: LuxuryMapProps) {
  const { setPickup, setDropoff } = useBookingStore();
  const [mapLayer, setMapLayer] = useState<'osm' | 'voyager'>('osm');

  const line = useMemo<L.LatLngExpression[]>(
    () => (geometry?.points ?? []).map((p) => [p.lat, p.lng]),
    [geometry],
  );

  return (
    <div
      data-lenis-prevent
      className={`relative overflow-hidden rounded-3xl border border-line shadow-card ${className}`}
    >
      <MapContainer
        center={[MELBOURNE_CENTER.lat, MELBOURNE_CENTER.lng]}
        zoom={zoom}
        scrollWheelZoom={interactive}
        dragging={interactive}
        doubleClickZoom={interactive}
        zoomControl={interactive}
        attributionControl
        className="h-full w-full"
      >
        {mapLayer === 'osm' ? (
          <TileLayer
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
            maxZoom={19}
            tileSize={256}
          />
        ) : (
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener noreferrer">CARTO</a>'
            subdomains="abcd"
            maxZoom={20}
            tileSize={256}
          />
        )}

        <ResizeGuard />
        <MapCamera pickup={pickup} dropoff={dropoff} points={geometry?.points ?? []} />

        {/* Detailed Melbourne Location Hubs (Interactive) */}
        {melbourneHubs.map((hub) => (
          <Marker
            key={hub.id}
            position={[hub.lat, hub.lng]}
            icon={hubIcon(hub.name.split('/')[0].trim(), hub.emoji)}
          >
            <Popup>
              <div className="p-1 min-w-[200px]">
                <div className="flex items-center gap-1.5">
                  <span className="text-base">{hub.emoji}</span>
                  <strong className="text-slate-900 font-bold text-sm leading-tight">{hub.name}</strong>
                </div>
                <p className="mt-1 text-xs text-slate-600 font-medium">
                  {hub.suburb}, VIC {hub.postcode}
                </p>
                <div className="mt-2.5 flex items-center gap-1.5 pt-2 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() =>
                      setPickup({
                        label: `${hub.name}, ${hub.suburb} VIC ${hub.postcode}`,
                        lat: hub.lat,
                        lng: hub.lng,
                        suburb: hub.suburb,
                        postcode: hub.postcode,
                      })
                    }
                    className="flex-1 rounded-md bg-gold-gradient py-1 px-2 text-[0.68rem] font-bold text-obsidian text-center transition hover:brightness-105 active:scale-95"
                  >
                    Set as Pickup
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setDropoff({
                        label: `${hub.name}, ${hub.suburb} VIC ${hub.postcode}`,
                        lat: hub.lat,
                        lng: hub.lng,
                        suburb: hub.suburb,
                        postcode: hub.postcode,
                      })
                    }
                    className="flex-1 rounded-md bg-slate-900 py-1 px-2 text-[0.68rem] font-bold text-white text-center transition hover:bg-slate-800 active:scale-95"
                  >
                    Set as Destination
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {line.length > 1 && (
          <>
            {/* Outer golden halo */}
            <Polyline positions={line} pathOptions={{ color: '#F59E0B', weight: 10, opacity: 0.3 }} />
            {/* Main high-contrast gold route */}
            <Polyline positions={line} pathOptions={{ color: '#D97706', weight: 4.5, opacity: 0.95 }} />
            {/* Clean dark center spine */}
            <Polyline
              positions={line}
              pathOptions={{
                className: 'route-line-flow',
                color: '#0F172A',
                weight: 2,
                opacity: 0.85,
              }}
            />
          </>
        )}

        {pickup && (
          <Marker position={[pickup.lat, pickup.lng]} icon={pickupIcon}>
            <Popup>
              <strong className="text-gold-ink font-bold">Pickup Point</strong>
              <br />
              <span className="text-slate-800 font-semibold">{pickup.label}</span>
            </Popup>
          </Marker>
        )}

        {dropoff && (
          <Marker position={[dropoff.lat, dropoff.lng]} icon={dropoffIcon}>
            <Popup>
              <strong className="text-slate-900 font-bold">Destination</strong>
              <br />
              <span className="text-slate-800 font-semibold">{dropoff.label}</span>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Map Layer Switcher (Top Left) */}
      <div className="absolute top-2.5 left-2.5 z-[500] flex items-center gap-1 rounded-xl border border-line bg-white/95 p-1 shadow-md backdrop-blur">
        <button
          type="button"
          onClick={() => setMapLayer('osm')}
          className={`flex items-center gap-1 rounded-lg px-2 py-1 text-[0.68rem] font-bold transition ${
            mapLayer === 'osm'
              ? 'bg-gold-gradient text-obsidian shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          title="OpenStreetMap Detailed Street View"
        >
          <Layers className="h-3 w-3" />
          <span>Detailed Streets</span>
        </button>
        <button
          type="button"
          onClick={() => setMapLayer('voyager')}
          className={`flex items-center gap-1 rounded-lg px-2 py-1 text-[0.68rem] font-bold transition ${
            mapLayer === 'voyager'
              ? 'bg-gold-gradient text-obsidian shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          title="Voyager HD Navigation View"
        >
          <Navigation className="h-3 w-3" />
          <span>Navigation HD</span>
        </button>
      </div>

      {/* Route info overlay */}
      {showOverlay && (
        <div className="pointer-events-none absolute inset-x-2 bottom-2 z-[500] sm:inset-x-4 sm:bottom-4">
          <div className="rounded-xl border border-line/90 bg-white/95 px-2.5 py-1.5 shadow-lift backdrop-blur sm:rounded-2xl sm:px-4 sm:py-3">
            {routing ? (
              <div className="flex items-center gap-2 text-[0.72rem] sm:text-fluid-xs text-ink-muted">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-gold-deep" />
                Measuring route…
              </div>
            ) : geometry && pickup && dropoff ? (
              <div>
                {/* Mobile compact 1-line badge */}
                <div className="flex sm:hidden items-center justify-between gap-2 text-xs font-semibold">
                  <div className="flex items-center gap-2 text-ink shrink-0">
                    <span className="flex items-center gap-1">
                      <RouteIcon className="h-3.5 w-3.5 text-gold-deep" />
                      {geometry.distanceKm.toFixed(1)} km
                    </span>
                    <span className="text-ink-muted">·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-gold-deep" />
                      {geometry.durationMins}m
                    </span>
                  </div>
                  <p className="min-w-0 truncate text-[0.68rem] font-medium text-ink-muted text-right">
                    {pickup.suburb ?? pickup.label.split(',')[0]} → {dropoff.suburb ?? dropoff.label.split(',')[0]}
                  </p>
                </div>

                {/* Tablet / Desktop expanded stats */}
                <div className="hidden sm:flex flex-wrap items-center gap-x-6 gap-y-2">
                  <div>
                    <p className="text-[0.65rem] uppercase tracking-label text-ink-muted leading-tight">Distance</p>
                    <p className="flex items-center gap-1.5 text-fluid-lg font-bold text-ink leading-tight">
                      <RouteIcon className="h-4 w-4 text-gold-deep" />
                      {geometry.distanceKm.toFixed(1)} km
                    </p>
                  </div>
                  <div>
                    <p className="text-[0.65rem] uppercase tracking-label text-ink-muted leading-tight">Travel time</p>
                    <p className="flex items-center gap-1.5 text-fluid-lg font-bold text-ink leading-tight">
                      <Clock className="h-4 w-4 text-gold-deep" />
                      {geometry.durationMins} min
                    </p>
                  </div>
                  <div className="min-w-0 flex-1 basis-full sm:basis-auto">
                    <p className="text-[0.65rem] uppercase tracking-label text-ink-muted leading-tight">Route</p>
                    <p className="truncate text-fluid-xs font-medium text-ink-soft leading-tight">
                      {pickup.suburb ?? pickup.label} → {dropoff.suburb ?? dropoff.label}
                      {geometry.source === 'estimate' && ' · estimated'}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-[0.68rem] sm:text-fluid-xs text-ink-muted leading-tight">
                {pickup
                  ? 'Add a destination to preview your route on the map.'
                  : 'Click any location on the map or type an address to preview your route.'}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
