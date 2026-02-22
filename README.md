# Velux CRM (SMS-First)

A Next.js 14 CRM for detailing operations with:
- Lead/customer management
- Job lifecycle tracking
- 20% deposit + 80% balance Stripe payment flow
- SMS-first communication via Twilio
- Email via SendGrid
- Calendar sync via Google Calendar
- Asset upload support via S3
- SQLite persistence

## Quick Start

```bash
npm install
cp .env.example .env
npm run seed
npm run dev
```

Open http://localhost:3000

## Core Structure

- `app/` Next.js App Router pages + API routes
- `lib/` DB + third-party integrations
- `schema.sql` SQLite schema
- `scripts/seed.ts` Seed data

## Payment Model

Each job stores:
- `quoted_amount_cents`
- `deposit_amount_cents` (20%)
- `balance_amount_cents` (80%)

Deposit is collected to confirm booking; balance is collected when work is complete.

## Deploy (Vercel)

1. Push to GitHub
2. Import project in Vercel
3. Configure environment variables from `.env.example`
4. Deploy
