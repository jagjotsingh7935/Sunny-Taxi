import { mockReviews } from '@/data/mockReviews';
import type {
  ApiResult,
  Booking,
  ContactMessage,
  QuoteRequest,
  Review,
} from '@/types';
import { STORAGE_KEYS, storage } from './storage';

/**
 * Every function below mirrors a REST endpoint one-for-one. To go live, replace the
 * `mock*` body with a fetch against `API_BASE_URL` — the signatures and return shapes
 * are already what the UI expects, so no component needs to change.
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

const latency = (ms = 850) => new Promise((resolve) => setTimeout(resolve, ms));

const pad = (n: number, len = 4) => String(n).padStart(len, '0');

/** Booking references look like MEL-2026-8942. */
export function makeReference(prefix: 'MEL' | 'QTE' | 'REV' | 'MSG' = 'MEL'): string {
  const year = new Date().getFullYear();
  const serial = pad(Math.floor(1000 + Math.random() * 8999));
  return `${prefix}-${year}-${serial}`;
}

/* ------------------------------ Bookings ------------------------------ */
/** POST /bookings */
export async function createBooking(
  draft: Omit<Booking, 'reference' | 'createdAt' | 'status'>,
): Promise<ApiResult<Booking>> {
  await latency();
  const booking: Booking = {
    ...draft,
    reference: makeReference('MEL'),
    createdAt: new Date().toISOString(),
    status: 'confirmed',
  };
  storage.push(STORAGE_KEYS.bookings, booking);
  return {
    ok: true,
    data: booking,
    message: `Booking ${booking.reference} confirmed. Your chauffeur details arrive 12 hours before pickup.`,
  };
}

/** GET /bookings */
export async function listBookings(): Promise<Booking[]> {
  await latency(200);
  return storage.read<Booking[]>(STORAGE_KEYS.bookings, []);
}

/* ------------------------------- Quotes ------------------------------- */
/** POST /quotes */
export async function createQuote(
  draft: Omit<QuoteRequest, 'reference' | 'createdAt' | 'status'>,
): Promise<ApiResult<QuoteRequest>> {
  await latency();
  const quote: QuoteRequest = {
    ...draft,
    reference: makeReference('QTE'),
    createdAt: new Date().toISOString(),
    status: 'received',
  };
  storage.push(STORAGE_KEYS.quotes, quote);
  return {
    ok: true,
    data: quote,
    message: `Quote ${quote.reference} received. Dispatch replies within 30 minutes, 24 hours a day.`,
  };
}

/** GET /quotes */
export async function listQuotes(): Promise<QuoteRequest[]> {
  await latency(200);
  return storage.read<QuoteRequest[]>(STORAGE_KEYS.quotes, []);
}

/* ------------------------------- Reviews ------------------------------ */
/** GET /reviews */
export async function listReviews(): Promise<Review[]> {
  await latency(150);
  const submitted = storage.read<Review[]>(STORAGE_KEYS.reviews, []);
  return [...submitted, ...mockReviews];
}

/** POST /reviews */
export async function createReview(
  draft: Omit<Review, 'id' | 'date' | 'verified'>,
): Promise<ApiResult<Review>> {
  await latency();
  const review: Review = {
    ...draft,
    id: makeReference('REV'),
    date: new Date().toISOString().slice(0, 10),
    verified: false,
  };
  storage.push(STORAGE_KEYS.reviews, review);
  return {
    ok: true,
    data: review,
    message: 'Review received. It appears publicly once our moderation team verifies the trip.',
  };
}

/* ------------------------------ Messages ------------------------------ */
/** POST /messages */
export async function sendMessage(
  draft: Omit<ContactMessage, 'reference' | 'createdAt'>,
): Promise<ApiResult<ContactMessage>> {
  await latency();
  const message: ContactMessage = {
    ...draft,
    reference: makeReference('MSG'),
    createdAt: new Date().toISOString(),
  };
  storage.push(STORAGE_KEYS.messages, message);
  return {
    ok: true,
    data: message,
    message: `Message ${message.reference} sent. Dispatch replies within 30 minutes.`,
  };
}

/* ------------------------------ Payments ------------------------------ */
/** POST /payments/intent — simulated Stripe card authorisation. */
export async function processCardPayment(
  amount: number,
  card: { number: string; name: string; expiry: string; cvc: string },
): Promise<ApiResult<{ id: string; last4: string; amount: number }>> {
  await latency(1600);
  const digits = card.number.replace(/\s/g, '');
  if (digits.length < 15) {
    return {
      ok: false,
      data: { id: '', last4: '', amount },
      message: 'Card number is incomplete. Check the 16 digits on the front of the card.',
    };
  }
  return {
    ok: true,
    data: {
      id: `pi_${Math.random().toString(36).slice(2, 12)}`,
      last4: digits.slice(-4),
      amount,
    },
    message: 'Card authorised. Nothing is captured until your chauffeur completes the trip.',
  };
}
