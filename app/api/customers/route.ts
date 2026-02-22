import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { data, error } = await supabaseAdmin
    .from('customers')
    .insert({
      first_name: body.first_name,
      last_name: body.last_name,
      phone: body.phone,
      email: body.email || null,
      address: body.address,
      city: body.city || null,
      state: body.state || null,
      zip: body.zip || null,
      preferred_channel: body.preferred_channel || 'sms',
    })
    .select('id')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ id: data?.id }, { status: 201 });
}
