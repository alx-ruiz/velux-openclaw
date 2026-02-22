import { NextRequest, NextResponse } from 'next/server';
import { db, ensureSchema } from '@/lib/db';

export async function POST(req: NextRequest) {
  ensureSchema();
  const payload = await req.json();

  if (payload.type === 'payment_intent.succeeded') {
    const intentId = payload.data?.object?.id;
    if (intentId) {
      db.prepare('UPDATE payments SET status = ?, paid_at = CURRENT_TIMESTAMP WHERE stripe_payment_intent_id = ?').run('succeeded', intentId);
    }
  }

  return NextResponse.json({ received: true });
}
