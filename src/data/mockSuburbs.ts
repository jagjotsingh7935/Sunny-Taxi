import type { SuburbFare } from '@/types';

/**
 * [ suburb, postcode, region, lat, lng, fare to CBD, fare to Tullamarine, km from CBD ]
 * Fares are the fixed upfront Silver Sedan price in AUD. Other vehicle classes apply
 * the multiplier defined in mockVehicles.ts.
 */
type Row = [string, string, string, number, number, number, number, number];

const rows: Row[] = [
  ['Deanside', '3336', 'West', -37.7478, 144.7176, 58, 62, 25.0],
  ['Caroline Springs', '3023', 'West', -37.7348, 144.7397, 56, 58, 23.5],
  ['Melton', '3337', 'West', -37.6833, 144.5833, 78, 72, 38.0],
  ['Melbourne CBD', '3000', 'Central', -37.8136, 144.9631, 0, 65, 0],
  ['Southbank', '3006', 'Central', -37.8226, 144.9648, 42, 68, 1.6],
  ['Docklands', '3008', 'Central', -37.8149, 144.9464, 42, 62, 2.3],
  ['East Melbourne', '3002', 'Central', -37.8156, 144.9868, 42, 69, 2.1],
  ['Carlton', '3053', 'Inner North', -37.8001, 144.9674, 44, 62, 2.5],
  ['Fitzroy', '3065', 'Inner North', -37.7987, 144.978, 45, 66, 3.0],
  ['Collingwood', '3066', 'Inner North', -37.8027, 144.9843, 45, 68, 3.3],
  ['Brunswick', '3056', 'Inner North', -37.7667, 144.96, 48, 58, 5.4],
  ['Coburg', '3058', 'Inner North', -37.7411, 144.9663, 52, 55, 8.1],
  ['Preston', '3072', 'North', -37.742, 145.0, 58, 62, 9.4],
  ['Reservoir', '3073', 'North', -37.7167, 145.0, 62, 64, 12.0],
  ['Bundoora', '3083', 'North', -37.7, 145.05, 72, 76, 16.4],
  ['Epping', '3076', 'North', -37.6417, 145.0333, 82, 78, 21.6],
  ['Craigieburn', '3064', 'North', -37.6, 144.9333, 88, 62, 26.4],
  ['Tullamarine', '3043', 'North West', -37.7, 144.8833, 62, 15, 17.8],
  ['Essendon', '3040', 'North West', -37.7522, 144.9147, 52, 42, 9.8],
  ['Moonee Ponds', '3039', 'North West', -37.7647, 144.9186, 50, 46, 7.6],
  ['Ascot Vale', '3032', 'North West', -37.7783, 144.9186, 48, 48, 6.2],
  ['Keilor', '3036', 'North West', -37.7233, 144.8375, 68, 32, 18.9],
  ['Sunshine', '3020', 'West', -37.7883, 144.8317, 62, 46, 12.1],
  ['Footscray', '3011', 'West', -37.8, 144.9, 46, 52, 6.4],
  ['Yarraville', '3013', 'West', -37.815, 144.89, 48, 58, 7.2],
  ['Williamstown', '3016', 'West', -37.8639, 144.8975, 58, 68, 11.2],
  ['Altona', '3018', 'West', -37.8667, 144.8333, 66, 72, 15.1],
  ['Point Cook', '3030', 'West', -37.9147, 144.7483, 88, 96, 24.6],
  ['Werribee', '3030', 'West', -37.9, 144.6614, 105, 115, 32.1],
  ['Hoppers Crossing', '3029', 'West', -37.8833, 144.7, 98, 104, 28.4],
  ['Geelong', '3220', 'Regional', -38.1439, 144.3617, 175, 199, 75.2],
  ['South Yarra', '3141', 'Inner South East', -37.8397, 144.9927, 44, 79, 4.1],
  ['Prahran', '3181', 'Inner South East', -37.8514, 144.99, 46, 82, 5.2],
  ['Toorak', '3142', 'Inner South East', -37.8411, 145.0139, 48, 84, 5.9],
  ['Windsor', '3181', 'Inner South East', -37.8564, 144.9903, 46, 84, 5.6],
  ['St Kilda', '3182', 'Bayside', -37.8683, 144.9797, 52, 85, 6.6],
  ['Elwood', '3184', 'Bayside', -37.8811, 144.9836, 55, 89, 8.1],
  ['Brighton', '3186', 'Bayside', -37.9186, 144.9877, 62, 96, 11.4],
  ['Sandringham', '3191', 'Bayside', -37.9506, 145.0119, 72, 105, 15.2],
  ['Mentone', '3194', 'Bayside', -37.9825, 145.0631, 82, 118, 20.1],
  ['Mordialloc', '3195', 'Bayside', -37.9997, 145.0864, 88, 124, 22.4],
  ['Frankston', '3199', 'South East', -38.1435, 145.1224, 118, 155, 41.2],
  ['Mornington', '3931', 'Peninsula', -38.2186, 145.0386, 145, 182, 51.6],
  ['Red Hill', '3937', 'Peninsula', -38.3874, 145.0139, 195, 232, 68.9],
  ['Sorrento', '3943', 'Peninsula', -38.3403, 144.7422, 215, 248, 91.4],
  ['Richmond', '3121', 'Inner East', -37.8183, 145.0006, 44, 72, 3.4],
  ['Hawthorn', '3122', 'Inner East', -37.8221, 145.0353, 50, 78, 6.4],
  ['Camberwell', '3124', 'Inner East', -37.8422, 145.0586, 56, 84, 9.1],
  ['Box Hill', '3128', 'East', -37.8194, 145.1219, 66, 92, 14.2],
  ['Doncaster', '3108', 'East', -37.7867, 145.1237, 62, 88, 14.6],
  ['Templestowe', '3106', 'East', -37.7561, 145.1289, 68, 88, 16.3],
  ['Ringwood', '3134', 'East', -37.8144, 145.2294, 82, 108, 23.1],
  ['Glen Waverley', '3150', 'South East', -37.8783, 145.1644, 78, 108, 20.4],
  ['Clayton', '3168', 'South East', -37.9244, 145.1206, 74, 105, 18.2],
  ['Dandenong', '3175', 'South East', -37.9878, 145.2147, 98, 132, 30.6],
  ['Berwick', '3806', 'South East', -38.0333, 145.35, 125, 158, 43.1],
  ['Narre Warren', '3805', 'South East', -38.0264, 145.3033, 118, 148, 38.4],
  ['Cranbourne', '3977', 'South East', -38.1, 145.2833, 128, 162, 43.6],
  ['Yarra Glen', '3775', 'Yarra Valley', -37.6588, 145.3766, 165, 175, 49.8],
  ['Healesville', '3777', 'Yarra Valley', -37.6542, 145.5158, 195, 205, 63.2],
  ['Lilydale', '3140', 'Yarra Valley', -37.7561, 145.3489, 128, 142, 35.4],
  ['Daylesford', '3460', 'Regional', -37.3436, 144.1417, 289, 265, 108.6],
  ['Cowes (Phillip Island)', '3922', 'Regional', -38.4517, 145.2385, 345, 378, 122.4],
  ['Ballarat', '3350', 'Regional', -37.5622, 143.8503, 315, 285, 114.7],
  ['Bendigo', '3550', 'Regional', -36.7589, 144.2794, 395, 365, 151.2],
];

export const mockSuburbs: SuburbFare[] = rows.map(
  ([suburb, postcode, region, lat, lng, toCbd, toTullamarine, distanceFromCbdKm]) => ({
    suburb,
    postcode,
    region,
    lat,
    lng,
    toCbd,
    toTullamarine,
    distanceFromCbdKm,
  }),
);

export const suburbNames = mockSuburbs.map((s) => s.suburb);

export const footerSuburbs = [
  'Deanside',
  'Caroline Springs',
  'Melbourne CBD',
  'South Yarra',
  'St Kilda',
  'Brighton',
  'Tullamarine',
  'Melton',
  'Frankston',
  'Doncaster',
  'Southbank',
  'Docklands',
  'Richmond',
  'Toorak',
  'Werribee',
  'Geelong',
  'Mornington',
  'Box Hill',
];

export const searchSuburbs = (query: string): SuburbFare[] => {
  const q = query.trim().toLowerCase();
  if (!q) return mockSuburbs;
  return mockSuburbs.filter(
    (s) =>
      s.suburb.toLowerCase().includes(q) ||
      s.postcode.includes(q) ||
      s.region.toLowerCase().includes(q),
  );
};
