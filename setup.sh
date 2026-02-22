#!/bin/bash
# ============================================================
# VELUX CRM — One-Shot Setup Script
# Run after getting your credentials from Supabase + Stripe
# ============================================================

set -e

echo "🚀 Velux CRM Setup"
echo "==================="
echo ""
echo "You'll need:"
echo "  1. Supabase service_role key (Settings → API)"
echo "  2. Stripe secret key (Developers → API keys)"
echo "  3. Stripe webhook secret (after deploy)"
echo "  4. Twilio credentials (optional)"
echo ""

# Collect credentials
read -p "SUPABASE_SERVICE_ROLE_KEY: " SUPABASE_SERVICE_ROLE_KEY
read -p "STRIPE_SECRET_KEY: " STRIPE_SECRET_KEY
read -p "STRIPE_PUBLISHABLE_KEY (pk_...): " STRIPE_PUB_KEY
read -p "TWILIO_ACCOUNT_SID (or press enter to skip): " TWILIO_SID
read -p "TWILIO_AUTH_TOKEN (or press enter to skip): " TWILIO_TOKEN
read -p "TWILIO_FROM_NUMBER (or press enter to skip): " TWILIO_FROM

# Write .env.local
cat > .env.local << EOF
NEXT_PUBLIC_SUPABASE_URL=https://vcxjdigvzlrrdjadfywq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_UNKVeyTwZnKXzbnzAc-kNw_Z76V5nx1
SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=${STRIPE_PUB_KEY}
STRIPE_WEBHOOK_SECRET=whsec_placeholder
TWILIO_ACCOUNT_SID=${TWILIO_SID}
TWILIO_AUTH_TOKEN=${TWILIO_TOKEN}
TWILIO_FROM_NUMBER=${TWILIO_FROM}
NEXT_PUBLIC_APP_URL=https://velux-crm.vercel.app
EOF

echo ""
echo "✅ .env.local written"

# Test Supabase connection
echo ""
echo "Testing Supabase connection..."
RESULT=$(curl -s "https://vcxjdigvzlrrdjadfywq.supabase.co/rest/v1/customers?limit=0" \
  -H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}")

if echo "$RESULT" | grep -q "error\|PGRST"; then
  echo "⚠️  Supabase error: ${RESULT}"
  echo "   → Run schema.sql in Supabase SQL editor first!"
else
  echo "✅ Supabase: connected"
fi

# Deploy to Vercel
echo ""
echo "Deploying to Vercel..."
if ! command -v vercel &> /dev/null; then
  npm install -g vercel
fi

vercel login
vercel --prod \
  --env NEXT_PUBLIC_SUPABASE_URL="https://vcxjdigvzlrrdjadfywq.supabase.co" \
  --env NEXT_PUBLIC_SUPABASE_ANON_KEY="sb_publishable_UNKVeyTwZnKXzbnzAc-kNw_Z76V5nx1" \
  --env SUPABASE_SERVICE_ROLE_KEY="${SUPABASE_SERVICE_ROLE_KEY}" \
  --env STRIPE_SECRET_KEY="${STRIPE_SECRET_KEY}" \
  --env NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="${STRIPE_PUB_KEY}" \
  --env TWILIO_ACCOUNT_SID="${TWILIO_SID}" \
  --env TWILIO_AUTH_TOKEN="${TWILIO_TOKEN}" \
  --env TWILIO_FROM_NUMBER="${TWILIO_FROM}" \
  --yes

echo ""
echo "🎉 Done! Your CRM is live."
echo ""
echo "Next: Set your Stripe webhook URL in Stripe dashboard:"
echo "  https://dashboard.stripe.com/webhooks"
echo "  Endpoint: https://[your-vercel-url]/api/webhooks/stripe"
echo "  Events: payment_intent.succeeded"
echo "  Then copy the signing secret → update STRIPE_WEBHOOK_SECRET in Vercel"
