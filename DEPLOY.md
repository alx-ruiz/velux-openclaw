# Velux CRM — Deployment Guide

> **Status:** Code is fixed and ready. Follow these steps once to go live.
> **Time:** ~10 minutes total.

---

## Step 1: Fix Supabase Schema (3 min)

The existing tables have wrong column names. Drop and recreate:

1. Go to: https://supabase.com/dashboard/project/vcxjdigvzlrrdjadfywq/sql/new
2. Paste the entire contents of `schema.sql` from this repo
3. Click **Run**

You'll see: `Success. No rows returned.`

---

## Step 2: Get Supabase Service Role Key (1 min)

1. Go to: https://supabase.com/dashboard/project/vcxjdigvzlrrdjadfywq/settings/api
2. Copy the **service_role** key (under "Project API keys")
3. Keep this secret — server-side only

---

## Step 3: Deploy to Vercel (5 min)

### Option A: Vercel Dashboard (recommended)

1. Go to https://vercel.com/new
2. Import from GitHub → select `alx-ruiz/velux-openclaw`
3. Framework preset: **Next.js** (auto-detected)
4. Add these Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL     = https://vcxjdigvzlrrdjadfywq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = sb_publishable_UNKVeyTwZnKXzbnzAc-kNw_Z76V5nx1
SUPABASE_SERVICE_ROLE_KEY    = [the key from Step 2]
STRIPE_SECRET_KEY            = sk_test_... or sk_live_...
STRIPE_WEBHOOK_SECRET        = whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_test_... or pk_live_...
TWILIO_ACCOUNT_SID           = AC...
TWILIO_AUTH_TOKEN            = [your auth token]
TWILIO_FROM_NUMBER           = +1...
```

5. Click **Deploy**

### Option B: Vercel CLI

```bash
vercel login
vercel --prod
# Follow prompts, add env vars when asked
```

---

## Step 4: Configure Stripe Webhook (2 min)

After deploy, get your Vercel URL (e.g., `https://velux-crm.vercel.app`):

1. Go to: https://dashboard.stripe.com/webhooks
2. Add endpoint: `https://velux-crm.vercel.app/api/webhooks/stripe`
3. Events to listen for: `payment_intent.succeeded`
4. Copy the **signing secret** → set as `STRIPE_WEBHOOK_SECRET` in Vercel env vars

---

## You're Live

Test it:
1. Add a customer via `/customers`
2. Create a job via `/jobs`
3. Generate a payment via `/payments` (Stripe test card: `4242 4242 4242 4242`)
4. Check the Supabase dashboard to confirm data is persisting

---

## What Was Fixed

| Issue | Fix |
|-------|-----|
| Supabase anon key couldn't write (RLS) | Added service_role admin client, RLS disabled |
| customers table had wrong columns | New schema.sql with correct columns |
| bookings table missing amount columns | New schema.sql with all required fields |
| Pages couldn't join customer names | Fixed with Supabase foreign key joins |
| Stripe webhook had deprecated config | Removed, using App Router standard |
| googleapis bundling warning | Added to serverComponentsExternalPackages |
