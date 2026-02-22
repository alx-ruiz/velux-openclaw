import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendSms } from '@/lib/twilio';

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { data: customer } = await supabase.from('customers').select('*').eq('id', body.customer_id).single();
  if (!customer) return NextResponse.json({ error: 'Customer not found' }, { status: 404 });

  const sms = await sendSms(customer.phone, body.body);

  await supabase.from('sms_log').insert({
    customer_id: customer.id,
    booking_id: body.job_id || null,
    direction: 'outbound',
    channel: 'sms',
    body: body.body,
    provider_id: (sms as any)?.sid || null,
  });

  return NextResponse.json({ ok: true, provider: sms });
}
