-- ============================================================
-- VELUX CRM — Supabase Postgres Schema
-- Run this in the Supabase SQL Editor to reset all tables
-- ============================================================

-- Drop old tables if they exist (clean slate)
DROP TABLE IF EXISTS sms_log CASCADE;
DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS jobs CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS communications CASCADE;

-- ── Customers ─────────────────────────────────────────────
CREATE TABLE customers (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name   TEXT NOT NULL,
  last_name    TEXT NOT NULL,
  phone        TEXT NOT NULL UNIQUE,
  email        TEXT,
  address      TEXT,
  city         TEXT,
  state        TEXT,
  zip          TEXT,
  preferred_channel TEXT NOT NULL DEFAULT 'sms',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Bookings (jobs) ───────────────────────────────────────
CREATE TABLE bookings (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id         UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  service_type        TEXT NOT NULL,
  status              TEXT NOT NULL DEFAULT 'lead',
  quoted_amount_cents INTEGER NOT NULL DEFAULT 0,
  deposit_amount_cents INTEGER NOT NULL DEFAULT 0,
  balance_amount_cents INTEGER NOT NULL DEFAULT 0,
  scheduled_start     TIMESTAMPTZ,
  scheduled_end       TIMESTAMPTZ,
  notes               TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Invoices (payments) ───────────────────────────────────
CREATE TABLE invoices (
  id                         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id                 UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  payment_type               TEXT NOT NULL,  -- 'deposit' or 'balance'
  amount_cents               INTEGER NOT NULL,
  status                     TEXT NOT NULL DEFAULT 'pending',  -- pending | succeeded | failed
  stripe_payment_intent_id   TEXT UNIQUE,
  paid_at                    TIMESTAMPTZ,
  created_at                 TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── SMS Log ───────────────────────────────────────────────
CREATE TABLE sms_log (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  booking_id  UUID REFERENCES bookings(id) ON DELETE SET NULL,
  direction   TEXT NOT NULL DEFAULT 'outbound',  -- 'outbound' | 'inbound'
  channel     TEXT NOT NULL DEFAULT 'sms',
  body        TEXT NOT NULL,
  provider_id TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Indexes ───────────────────────────────────────────────
CREATE INDEX idx_bookings_customer_id  ON bookings(customer_id);
CREATE INDEX idx_bookings_status       ON bookings(status);
CREATE INDEX idx_invoices_booking_id   ON invoices(booking_id);
CREATE INDEX idx_sms_log_customer_id   ON sms_log(customer_id);

-- ── Disable RLS (private CRM, no public access needed) ────
ALTER TABLE customers DISABLE ROW LEVEL SECURITY;
ALTER TABLE bookings  DISABLE ROW LEVEL SECURITY;
ALTER TABLE invoices  DISABLE ROW LEVEL SECURITY;
ALTER TABLE sms_log   DISABLE ROW LEVEL SECURITY;

-- ── Auto-update updated_at ────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER customers_updated_at BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
