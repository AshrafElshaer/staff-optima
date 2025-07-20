#!/bin/bash

echo "🚀 Setting up Staff Optima Environment Variables"
echo "================================================"

# Create dashboard .env file
echo "📝 Creating apps/dashboard/.env file..."
cat > apps/dashboard/.env << 'EOF'
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/staff_optima"

# JWT
JWT_SIGN_SECRET="your-jwt-secret-key-here"

# Environment
NODE_ENV="development"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
NEXT_PUBLIC_SUPABASE_SERVICE_KEY="your-supabase-service-key"

# Stripe
STRIPE_SECRET_KEY="sk_test_your-stripe-secret-key"
STRIPE_WEBHOOK_SECRET="whsec_your-stripe-webhook-secret"

# Resend (Email)
RESEND_API_KEY="your-resend-api-key"

# Upstash Redis
UPSTASH_REDIS_REST_URL="https://your-redis-url.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-redis-token"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
EOF

echo "✅ Created apps/dashboard/.env file"
echo ""
echo "⚠️  IMPORTANT: Please update the values in apps/dashboard/.env with your actual credentials:"
echo "   - DATABASE_URL: Your PostgreSQL connection string"
echo "   - JWT_SIGN_SECRET: A secure random string for JWT signing"
echo "   - Supabase credentials from your Supabase project"
echo "   - Stripe credentials from your Stripe dashboard"
echo "   - Resend API key from your Resend account"
echo "   - Upstash Redis credentials"
echo "   - Google OAuth credentials"
echo ""
echo "🔗 Useful links:"
echo "   - Supabase: https://supabase.com"
echo "   - Stripe: https://stripe.com"
echo "   - Resend: https://resend.com"
echo "   - Upstash: https://upstash.com"
echo ""
echo "After updating the .env file, run:"
echo "  bun run auth:generate"
echo "  cd packages/supabase && bun run ts:generate" 