import { NextRequest, NextResponse } from 'next/server';
import { db, ensureSchema } from '@/lib/db';

export async function GET() {
  ensureSchema();
  const rows = db.prepare('SELECT * FROM customers ORDER BY id DESC').all();
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  ensureSchema();
  const body = await req.json();
  const stmt = db.prepare(`
    INSERT INTO customers (first_name, last_name, phone, email, address, city, state, zip, preferred_channel)
    VALUES (@first_name, @last_name, @phone, @email, @address, @city, @state, @zip, @preferred_channel)
  `);
  const result = stmt.run({
    ...body,
    preferred_channel: body.preferred_channel || 'sms'
  });
  return NextResponse.json({ id: result.lastInsertRowid }, { status: 201 });
}
