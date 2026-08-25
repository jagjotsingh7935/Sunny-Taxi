import type { Vehicle } from '@/types';

export const mockVehicles: Vehicle[] = [
  {
    id: 'silver-sedan',
    name: 'Sedan Taxi',
    tagline: 'Reliable, comfortable everyday city & airport travel',
    description:
      'Our primary Melbourne taxi fleet. Spotless hybrid sedans with air-conditioned comfort, punctual service, and fixed upfront pricing for airport transfers and daily city travel.',
    models: ['Toyota Camry Hybrid', 'Lexus ES 300h', 'Toyota Aurion'],
    image:
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
    passengers: 4,
    carryOn: 2,
    largeSuitcases: 2,
    baseFare: 12,
    perKm: 2.35,
    minimumFare: 42,
    multiplier: 1,
    wifi: true,
    babySeatCompatible: true,
    tintedGlass: false,
    features: [
      'Clean, comfortable air-conditioned cabin',
      'Phone charging and bottled water',
      'Fits 2 large suitcases plus carry-on',
      'Child restraint anchor points available',
    ],
    badge: 'Popular choice',
  },
  {
    id: 'prestige-suv',
    name: 'SUV / 7-Seater Vehicle',
    tagline: 'Spacious 6–7 seats for families, luggage & group comfort',
    description:
      'Generous boot space, flexible seating, and a smooth ride across Melbourne. The ideal vehicle when families travel together or require extra room for suitcases and prams.',
    models: ['Toyota Kluger', 'Audi Q7', 'Kia Carnival 7-Seat'],
    image:
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80',
    passengers: 7,
    carryOn: 4,
    largeSuitcases: 4,
    baseFare: 20,
    perKm: 3.2,
    minimumFare: 68,
    multiplier: 1.35,
    wifi: true,
    babySeatCompatible: true,
    tintedGlass: true,
    features: [
      'Seats up to 7 passengers comfortably',
      'Generous boot space for 4 large suitcases',
      'Child seats and booster compatible',
      'Comfortable elevated seating position',
    ],
    badge: 'Families & extra luggage',
  },
  {
    id: 'maxi-van',
    name: 'Maxi / Large Passenger Van',
    tagline: '7 to 11 seats — group transport & wheelchair assistance',
    description:
      'High-capacity transport for large families, corporate teams, events, and community groups. Wheelchair / passenger assistance available where suitable (subject to availability).',
    models: ['Toyota HiAce Commuter', 'Mercedes-Benz Sprinter', 'Kia Carnival Platinum'],
    image:
      'https://images.unsplash.com/photo-1600661653561-629509216228?auto=format&fit=crop&w=1200&q=80',
    passengers: 11,
    carryOn: 6,
    largeSuitcases: 8,
    baseFare: 25,
    perKm: 3.75,
    minimumFare: 95,
    multiplier: 1.65,
    wifi: true,
    babySeatCompatible: true,
    tintedGlass: true,
    features: [
      'Up to 11 seated passengers',
      'Wheelchair / passenger assistance where suitable',
      'Walk-in headroom and large luggage capacity',
      'Ideal for events, airport groups & sports travel',
    ],
    badge: 'Groups & accessibility',
  },
  {
    id: 'european-premium',
    name: 'Executive Sedan',
    tagline: 'Premium corporate & business travel',
    description:
      'For business meetings, corporate accounts, and VIP transfers that demand an executive touch. Premium leather upholstery, privacy glass, and professional door-to-door service.',
    models: ['Mercedes-Benz E-Class', 'Lexus ES Luxury', 'BMW 5-Series'],
    image:
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80',
    passengers: 4,
    carryOn: 2,
    largeSuitcases: 2,
    baseFare: 22,
    perKm: 3.5,
    minimumFare: 80,
    multiplier: 1.5,
    wifi: true,
    babySeatCompatible: true,
    tintedGlass: true,
    features: [
      'Premium interior with climate control',
      'Privacy tinted glass',
      'Corporate account billing available',
      'Punctual, professional driver presentation',
    ],
    badge: 'Corporate travel',
  },
];

export const getVehicle = (id: string): Vehicle =>
  mockVehicles.find((v) => v.id === id) ?? mockVehicles[0];
