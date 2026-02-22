import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { stripe } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { data: booking, error: bookingError } = await supabaseAdmin
    .from('bookings')
    .select('*')
    .eq('id', body.job_id)
    .single();

  if (bookingError || !booking) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 });
  }

  const amount =
    body.payment_type === 'deposit'
      ? booking.deposit_amount_cents
      : booking.balance_amount_cents;

  if (!amount || amount <= 0) {
    return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
  }

  let pi: { id: string; client_secret?: string | null };

  if (stripe) {
    pi = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      metadata: { job_id: String(booking.id), payment_type: body.payment_type },
    });
  } else {
    // Dev mode without Stripe key
    pi = { id: `mock_${Date.now()}`, client_secret: 'mock_secret' };
  }

  await supabaseAdmin.from('invoices').insert({
    booking_id: booking.id,
    payment_type: body.payment_type,
    amount_cents: amount,
    status: 'pending',
    stripe_payment_intent_id: pi.id,
  });

  return NextResponse.json({
    clientSecret: pi.client_secret,
    paymentIntentId: pi.id,
    amount_cents: amount,
  });
}
