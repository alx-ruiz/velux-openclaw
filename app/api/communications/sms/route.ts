import { NextRequest, NextResponse } from 'next/server';
import { db, ensureSchema } from '@/lib/db';
import { sendSms } from '@/lib/twilio';

export async function POST(req: NextRequest) {
  ensureSchema();
  const body = await req.json();

  const customer = db.prepare('SELECT * FROM customers WHERE id = ?').get(body.customer_id) as any;
  if (!customer) return NextResponse.json({ error: 'Customer not found' }, { status: 404 });

  const sms = await sendSms(customer.phone, body.body);

  db.prepare(`
    INSERT INTO communications (customer_id, job_id, direction, channel, body, provider_id)
    VALUES (?, ?, 'outbound', 'sms', ?, ?)
  `).run(customer.id, body.job_id || null, body.body, (sms as any)?.sid || null);

  return NextResponse.json({ ok: true, provider: sms });
}
