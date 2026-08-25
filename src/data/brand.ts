export const BRAND = {
  name: 'Sunny Taxi Service',
  owner: 'Gagandeep Singh',
  city: 'Melbourne',
  fullName: 'Sunny Taxi Service – Gagandeep Singh',
  shortName: 'Sunny Taxi',
  tagline: 'Reliable, Safe & Professional Taxi & Passenger Transport Services Across Melbourne',
  dispatchPhone: '0412 456 588',
  dispatchPhoneDial: '+61412456588',
  whatsapp: '61412456588',
  email: 'info@sunnytaxi.com.au',
  abn: 'ABN Registered Passenger Transport Services',
  accreditation: 'CPVV Accredited Taxi & Passenger Transport Service Provider',
  address: '37 Kidd Street, Deanside VIC 3336, Australia',
  suburb: 'Deanside',
  postcode: '3336',
  hours: '24 Hours, 7 Days — Pre-Booked, Airport & Daily Transport',
  commitment: 'Safe, reliable, comfortable and professional transportation with punctual pickups and friendly customer service.',
} as const;

export const MELBOURNE_CENTER = { lat: -37.8136, lng: 144.9631 };
export const DEANSIDE_LOCATION = { lat: -37.7478, lng: 144.7176, label: '37 Kidd Street, Deanside VIC 3336' };

/** Bounding box used to bias geocoding results to Greater Melbourne / Victoria. */
export const VICTORIA_VIEWBOX = {
  minLng: 143.6,
  minLat: -38.6,
  maxLng: 146.1,
  maxLat: -37.2,
};

export const AIRPORT_WAIT_POLICY = {
  domesticFreeMins: 30,
  internationalFreeMins: 60,
  standardFreeMins: 10,
  waitingPerHour: 66,
};

export const SURCHARGES = {
  boosterSeat: 12,
  babyCapsule: 15,
  meetAndGreet: 20,
  extraStop: 15,
  lateNightPercent: 0.15,
  cardFeePercent: 0.014,
  tolls: 6.4,
};
