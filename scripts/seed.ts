import { supabase } from '../lib/supabase';
import { splitPayment } from '../lib/stripe';

async function seed() {
  const quote = 150000;
  const { deposit, balance } = splitPayment(quote);

  await supabase.from('sms_log').delete().neq('id', '');
  await supabase.from('invoices').delete().neq('id', '');
  await supabase.from('bookings').delete().neq('id', '');
  await supabase.from('customers').delete().neq('id', '');

  const { data: customer } = await supabase
    .from('customers')
    .insert({
      first_name: 'Jordan',
      last_name: 'Miles',
      phone: '+15551234567',
      email: 'jordan@example.com',
      address: '123 Cedar St',
      city: 'Austin',
      state: 'TX',
      zip: '78701',
      preferred_channel: 'sms',
    })
    .select('id')
    .single();

  const { data: booking } = await supabase
    .from('bookings')
    .insert({
      customer_id: customer?.id,
      service_type: 'Full Exterior + Interior Detail',
      status: 'scheduled',
      quoted_amount_cents: quote,
      deposit_amount_cents: deposit,
      balance_amount_cents: balance,
      scheduled_start: new Date(Date.now() + 86400000).toISOString(),
      scheduled_end: new Date(Date.now() + 3 * 86400000).toISOString(),
      notes: 'Customer requested SMS updates only.',
    })
    .select('id')
    .single();

  await supabase.from('sms_log').insert({
    customer_id: customer?.id,
    booking_id: booking?.id,
    direction: 'outbound',
    channel: 'sms',
    body: 'Thanks for booking with Velux. Your 20% deposit link is ready.',
  });

  console.log('Seed complete');
}

seed();
