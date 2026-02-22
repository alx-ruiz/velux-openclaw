import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { stripe } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', body.job_id)
    .single();

  if (bookingError || !booking) return NextResponse.json({ error: 'Job not found' }, { status: 404 });

  const amount = body.payment_type === 'deposit' ? booking.deposit_amount_cents : booking.balance_amount_cents;

  const pi = stripe
    ? await stripe.paymentIntents.create({ amount, currency: 'usd', metadata: { job_id: String(booking.id), payment_type: body.payment_type } })
    : { id: `mock_${Date.now()}`, client_secret: 'mock_secret' };

  await supabase.from('invoices').insert({
    booking_id: booking.id,
    payment_type: body.payment_type,
    amount_cents: amount,
    status: 'pending',
    stripe_payment_intent_id: pi.id,
  });

  return NextResponse.json({ clientSecret: (pi as any).client_secret, paymentIntentId: pi.id, amount_cents: amount });
}
