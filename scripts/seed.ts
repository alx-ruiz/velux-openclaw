import { db, ensureSchema } from '../lib/db';
import { splitPayment } from '../lib/stripe';

ensureSchema();

db.prepare('DELETE FROM communications').run();
db.prepare('DELETE FROM payments').run();
db.prepare('DELETE FROM jobs').run();
db.prepare('DELETE FROM customers').run();

const customer = db.prepare(`
  INSERT INTO customers (first_name, last_name, phone, email, address, city, state, zip, preferred_channel)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'sms')
`).run('Jordan', 'Miles', '+15551234567', 'jordan@example.com', '123 Cedar St', 'Austin', 'TX', '78701');

const quote = 150000;
const { deposit, balance } = splitPayment(quote);

const job = db.prepare(`
  INSERT INTO jobs (customer_id, service_type, status, quoted_amount_cents, deposit_amount_cents, balance_amount_cents, scheduled_start, scheduled_end, notes)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(customer.lastInsertRowid, 'Full Exterior + Interior Detail', 'scheduled', quote, deposit, balance, new Date(Date.now()+86400000).toISOString(), new Date(Date.now()+3*86400000).toISOString(), 'Customer requested SMS updates only.');

db.prepare(`
  INSERT INTO communications (customer_id, job_id, direction, channel, body)
  VALUES (?, ?, 'outbound', 'sms', ?)
`).run(customer.lastInsertRowid, job.lastInsertRowid, 'Thanks for booking with Velux. Your 20% deposit link is ready.');

console.log('Seed complete');
