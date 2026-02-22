import { NextRequest, NextResponse } from 'next/server';
import { db, ensureSchema } from '@/lib/db';
import { stripe } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  ensureSchema();
  const body = await req.json();
  const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(body.job_id) as any;
  if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 });

  const amount = body.payment_type === 'deposit' ? job.deposit_amount_cents : job.balance_amount_cents;

  const pi = stripe
    ? await stripe.paymentIntents.create({ amount, currency: 'usd', metadata: { job_id: String(job.id), payment_type: body.payment_type } })
    : { id: `mock_${Date.now()}`, client_secret: 'mock_secret' };

  db.prepare(`
    INSERT INTO payments (job_id, payment_type, amount_cents, status, stripe_payment_intent_id)
    VALUES (?, ?, ?, ?, ?)
  `).run(job.id, body.payment_type, amount, 'pending', pi.id);

  return NextResponse.json({ clientSecret: (pi as any).client_secret, paymentIntentId: pi.id, amount_cents: amount });
}
