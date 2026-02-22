import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const dbPath = process.env.DATABASE_URL || './velux.db';
const absoluteDbPath = path.isAbsolute(dbPath) ? dbPath : path.join(process.cwd(), dbPath);

if (!fs.existsSync(path.dirname(absoluteDbPath))) {
  fs.mkdirSync(path.dirname(absoluteDbPath), { recursive: true });
}

export const db = new Database(absoluteDbPath);
db.pragma('journal_mode = WAL');

export type Customer = {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  email?: string;
  address: string;
};

export type Job = {
  id: number;
  customer_id: number;
  service_type: string;
  status: string;
  quoted_amount_cents: number;
  deposit_amount_cents: number;
  balance_amount_cents: number;
};

export function ensureSchema() {
  const schema = fs.readFileSync(path.join(process.cwd(), 'schema.sql'), 'utf-8');
  db.exec(schema);
}
