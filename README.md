# Crown Silver Chauffeurs Melbourne — Frontend

Production-ready frontend for a Melbourne luxury taxi and executive chauffeur service.
Vite + React 18 + TypeScript + Tailwind CSS, with a live Leaflet booking map, GSAP scroll
choreography, Lenis inertial scrolling and a fully mocked API layer.

## Getting started

```bash
npm install
npm run dev      # http://localhost:5174
```

Other commands:

```bash
npm run build    # typecheck + production build to dist/
npm run preview  # serve the production build
npm run lint     # typecheck only
```

Node 18+ is required.

## What's included

| Route | Page | Highlights |
| --- | --- | --- |
| `/` | Home | Hero with quick-booking widget, live route teaser map, fleet showcase with spec modals, fixed-price route grid, USPs, animated counters, testimonial carousel |
| `/booking` | Booking & Map | Split-screen live map + dual-tab wizard (fixed route instant booking / custom quote), Stripe-style payment simulation, confirmation modal with confetti and downloadable trip summary |
| `/fleet-routes` | Fleet & Routes | Fleet filterable by passengers and luggage, full published-route list, searchable 62-suburb fare table |
| `/reviews` | Reviews & Ratings | Aggregate score, 5-star distribution bars, trip-type filters, write-a-review modal (driver vs service) |
| `/about` | About Us | Story, accreditation and hygiene standards, milestone timeline |
| `/contact` | Contact Us | Click-to-call hotline, WhatsApp trigger, office map, coverage regions, contact form |

## Project structure

```
src/
├── components/
│   ├── booking/     AddressInput, BookingWizard, FixedRouteTab, CustomQuoteTab,
│   │                VehicleSelector, PaymentModal, ConfirmationModal
│   ├── home/        Hero, RouteTeaser, FleetShowcase, PopularRoutes,
│   │                WhyChooseUs, StatsCounter, Testimonials
│   ├── layout/      Navbar, Footer
│   ├── map/         LuxuryMap (Leaflet + CartoDB Dark Matter)
│   └── ui/          Modal, StarRating, SectionHeading, Counter
├── data/            brand, mockVehicles, mockRoutes, mockSuburbs, mockReviews
├── hooks/           useLenis, useScrollReveal, useCountUp, useToast
├── pages/           Home, Booking, FleetRoutes, Reviews, About, Contact
├── services/        api (mock REST), geo (geocoding + routing), pricing, storage
├── store/           bookingStore (Zustand)
└── types/           Vehicle, Route, Booking, QuoteRequest, Review, ContactMessage
```

## The map

`LuxuryMap` renders CartoDB Dark Matter tiles with a desaturation filter for the obsidian
look. Behaviour:

- Typing a **pickup** drops a gold pin and flies the camera to it.
- Adding a **destination** drops a platinum pin, fits bounds to both, and draws a
  three-layer polyline (glow, gold core, animated dashed overlay).
- The overlay reports live distance in km, travel time in minutes and a route summary.

Routing hits the public OSRM demo server (`router.project-osrm.org`) and silently falls back
to a local haversine estimate with a 1.28× road factor if the request fails or times out.
Geocoding uses Nominatim with a Victoria viewbox, merged with instant local matches from
`mockSuburbs` and `landmarks` so suggestions never feel laggy.

The map container carries `data-lenis-prevent`, so Lenis smooth scrolling never fights with
map dragging or zooming.

**For production**, swap the endpoints in `src/services/geo.ts` for your own OSRM instance,
Mapbox Directions or the Google Maps JS API. Both public services above are rate-limited and
not intended for commercial traffic.

## Connecting a real backend

Every function in `src/services/api.ts` mirrors one REST endpoint and already returns the
shape the UI expects. To go live, replace each function body with a `fetch` — no component
needs to change.

```ts
// before
export async function createBooking(draft) { /* localStorage */ }

// after
export async function createBooking(draft) {
  const res = await fetch(`${API_BASE_URL}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(draft),
  });
  return res.json();
}
```

Endpoints mapped: `POST /bookings`, `GET /bookings`, `POST /quotes`, `GET /quotes`,
`GET /reviews`, `POST /reviews`, `POST /messages`, `POST /payments/intent`.

Set `VITE_API_BASE_URL` in `.env` (see `.env.example`). Until then, submissions persist to
`localStorage` under the `csc:` prefix and survive a refresh.

## Pricing engine

`src/services/pricing.ts` is the single source of truth for fares:

- A published route uses its fixed price × the vehicle class multiplier.
- Anything else uses `baseFare + km × perKm`, floored at the class minimum.
- Add-ons, CityLink tolls (trips over 12 km), a 15% late-night loading (10pm–6am) and a
  1.4% card fee are applied as itemised lines, never as a hidden multiplier.

Tune the numbers in `src/data/brand.ts` (`SURCHARGES`) and `src/data/mockVehicles.ts`.

## Rebranding

Change `src/data/brand.ts` for the name, phone, email, ABN, address and accreditation — it
propagates to the navbar, footer, contact page, trip summaries and metadata. Colours and
type live in `tailwind.config.js`; the glass, gold-gradient and button primitives are in
`src/index.css` under `@layer components`.

## Quality notes

- `npm run build` runs a full `tsc --noEmit` first — the project compiles with zero type errors.
- Mobile-first throughout; the booking page collapses the split-screen into a stacked map +
  wizard on small viewports.
- `prefers-reduced-motion` disables Lenis, GSAP reveals, counters and confetti.
- Visible gold focus rings on every interactive element; modals trap Escape and lock body scroll.
- All content is mock data. Vehicle photography is royalty-free from Unsplash.
