import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { splitPayment } from '@/lib/stripe';
import { createCalendarEvent } from '@/lib/google-calendar';

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('bookings')
    .select(`
      *,
      customers (first_name, last_name, phone, email)
    `)
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const quote = Number(body.quoted_amount_cents || 0);
  const { deposit, balance } = splitPayment(quote);

  const { data, error } = await supabaseAdmin
    .from('bookings')
    .insert({
      customer_id: body.customer_id,
      service_type: body.service_type,
      status: body.status || 'lead',
      quoted_amount_cents: quote,
      deposit_amount_cents: deposit,
      balance_amount_cents: balance,
      scheduled_start: body.scheduled_start || null,
      scheduled_end: body.scheduled_end || null,
      notes: body.notes || null,
    })
    .select('id')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (body.scheduled_start && body.scheduled_end) {
    await createCalendarEvent(
      `Velux: ${body.service_type}`,
      body.scheduled_start,
      body.scheduled_end,
      body.notes
    ).catch(() => null); // non-fatal if calendar fails
  }

  return NextResponse.json(
    { id: data?.id, deposit_amount_cents: deposit, balance_amount_cents: balance },
    { status: 201 }
  );
}
