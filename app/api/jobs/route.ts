import { NextRequest, NextResponse } from 'next/server';
import { db, ensureSchema } from '@/lib/db';
import { splitPayment } from '@/lib/stripe';
import { createCalendarEvent } from '@/lib/google-calendar';

export async function GET() {
  ensureSchema();
  const rows = db.prepare('SELECT * FROM jobs ORDER BY id DESC').all();
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  ensureSchema();
  const body = await req.json();
  const quote = Number(body.quoted_amount_cents || 0);
  const { deposit, balance } = splitPayment(quote);

  const result = db.prepare(`
    INSERT INTO jobs (customer_id, service_type, status, quoted_amount_cents, deposit_amount_cents, balance_amount_cents, scheduled_start, scheduled_end, notes)
    VALUES (@customer_id, @service_type, @status, @quoted_amount_cents, @deposit_amount_cents, @balance_amount_cents, @scheduled_start, @scheduled_end, @notes)
  `).run({
    customer_id: body.customer_id,
    service_type: body.service_type,
    status: body.status || 'lead',
    quoted_amount_cents: quote,
    deposit_amount_cents: deposit,
    balance_amount_cents: balance,
    scheduled_start: body.scheduled_start || null,
    scheduled_end: body.scheduled_end || null,
    notes: body.notes || null
  });

  if (body.scheduled_start && body.scheduled_end) {
    await createCalendarEvent(`Velux: ${body.service_type}`, body.scheduled_start, body.scheduled_end, body.notes);
  }

  return NextResponse.json({ id: result.lastInsertRowid, deposit_amount_cents: deposit, balance_amount_cents: balance }, { status: 201 });
}
