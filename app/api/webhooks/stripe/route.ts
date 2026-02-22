import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const payload = await req.json();

  if (payload.type === 'payment_intent.succeeded') {
    const intentId = payload.data?.object?.id;
    if (intentId) {
      await supabase.from('invoices').update({ status: 'succeeded', paid_at: new Date().toISOString() }).eq('stripe_payment_intent_id', intentId);
    }
  }

  return NextResponse.json({ received: true });
}
