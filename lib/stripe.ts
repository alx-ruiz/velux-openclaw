import Stripe from 'stripe';

const key = process.env.STRIPE_SECRET_KEY;
export const stripe = key
  ? new Stripe(key, { apiVersion: '2025-02-24.acacia' })
  : null;

export function splitPayment(totalCents: number) {
  const deposit = Math.round(totalCents * 0.2);
  const balance = totalCents - deposit;
  return { deposit, balance };
}
