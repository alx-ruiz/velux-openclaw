import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { stripe } from '@/lib/stripe';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  // Verify signature if Stripe and webhook secret are configured
  if (stripe && webhookSecret && sig) {
    try {
      const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);

      if (event.type === 'payment_intent.succeeded') {
        const intent = event.data.object as { id: string };
        await supabaseAdmin
          .from('invoices')
          .update({ status: 'succeeded', paid_at: new Date().toISOString() })
          .eq('stripe_payment_intent_id', intent.id);

        // Also update booking status if deposit paid
        const { data: invoice } = await supabaseAdmin
          .from('invoices')
          .select('booking_id, payment_type')
          .eq('stripe_payment_intent_id', intent.id)
          .single();

        if (invoice?.booking_id) {
          const newStatus =
            invoice.payment_type === 'deposit' ? 'scheduled' : 'complete';
          await supabaseAdmin
            .from('bookings')
            .update({ status: newStatus })
            .eq('id', invoice.booking_id);
        }
      }
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }
  } else {
    // No verification — dev mode
    try {
      const payload = JSON.parse(body);
      if (payload.type === 'payment_intent.succeeded') {
        const intentId = payload.data?.object?.id;
        if (intentId) {
          await supabaseAdmin
            .from('invoices')
            .update({ status: 'succeeded', paid_at: new Date().toISOString() })
            .eq('stripe_payment_intent_id', intentId);
        }
      }
    } catch {}
  }

  return NextResponse.json({ received: true });
}
