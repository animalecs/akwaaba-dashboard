# Akwaaba Dashboard

A polished B2B React dashboard with Supabase auth, entitlement-aware product display, and Stripe-compatible billing flow architecture.

## Features

- Supabase authentication for sign in and sign up
- Protected dashboard routes
- Product catalog with search, filters, sorting, and responsive layout
- Premium field lock states for free users
- Product detail modal with upgrade CTA
- Billing page prepared for Stripe checkout and portal integration
- Tailwind CSS styling with professional B2B design

## Getting started

1. Install dependencies

```bash
npm install
```

2. Copy environment variables

```bash
cp .env.example .env
```

3. Start the development server

```bash
npm run dev
```

4. Open the app in your browser

Usually at `http://localhost:5173`

## Environment variables

The application expects:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

A sample `.env.example` is included.

## Backend integration notes

The frontend is set up to call backend endpoints for entitlement and billing actions:

- `GET /api/entitlements` — fetch the current plan and access flags
- `GET /api/products` — fetch product catalog data
- `POST /billing/checkout-session` — create a Stripe Checkout session
- `POST /billing/customer-portal` — create a Stripe customer portal session

### Important

- The app only uses the Supabase publishable key on the frontend.
- Stripe secret handling must remain on the backend.
- The product UI renders premium locks when entitlement data indicates restricted access, without hardcoding premium logic.

## Project structure

- `src/App.jsx` — route definitions and auth wrapper
- `src/hooks/useAuth.js` — Supabase auth context
- `src/hooks/useProducts.js` — product query hook
- `src/hooks/useEntitlement.js` — entitlement query hook
- `src/hooks/useBilling.js` — billing action hooks
- `src/api/index.js` — API layer with mock fallback data
- `src/features/auth/AuthPage.jsx` — authentication screen
- `src/features/dashboard/DashboardPage.jsx` — main dashboard layout
- `src/features/products/ProductTable.jsx` — responsive product grid/table
- `src/features/products/ProductDetailModal.jsx` — detail modal with lock states
- `src/features/billing/BillingPage.jsx` — subscription and billing section

## Notes

- The app currently falls back to mock product and entitlement data when backend endpoints are unavailable.
- TODO comments are included in the API layer where backend endpoints should be connected.
