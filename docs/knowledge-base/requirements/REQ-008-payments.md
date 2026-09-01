# REQ-008: Payments & Pricing

**Status:** todo
**Phase:** 3 (Full Platform)
**Priority:** p1-high
**Depends on:** [[REQ-007-auth-cloud-sync]]
**Blocks:** [[REQ-009-cover-letter]], [[REQ-010-job-tracker]]

## Description

Stripe integration for subscription and one-time lifetime purchases. Three tiers: Free (no payment), Pro (monthly/annual subscription), Lifetime (one-time purchase). Transparent pricing, no dark patterns.

## Acceptance Criteria

1. **Free tier** — no payment needed, 3 templates, PDF export, 5 AI/day
2. **Pro Monthly** — $9.99/month, all templates, all exports, unlimited AI, ATS checker
3. **Pro Annual** — $59.99/year (~$5/month), same as Pro Monthly
4. **Lifetime** — $149 one-time, everything in Pro, forever
5. Stripe Checkout for payment (hosted payment page)
6. Stripe Customer Portal for managing subscription (cancel, update card)
7. Webhook handling for payment events (subscription created, cancelled, payment failed)
8. User tier reflected immediately after payment
9. Downgrade to free preserves all data, just limits features
10. Pricing page with clear feature comparison table
11. No surprise charges, no auto-renewal traps (clear cancellation flow)
12. Receipt emails via Stripe

## Affected Files

- `src/lib/stripe/config.ts` — Stripe client and price IDs
- `src/lib/stripe/checkout.ts` — Create checkout sessions
- `src/lib/stripe/portal.ts` — Customer portal sessions
- `src/lib/stripe/webhooks.ts` — Webhook event handlers
- `src/app/api/stripe/checkout/route.ts` — Checkout API
- `src/app/api/stripe/portal/route.ts` — Portal API
- `src/app/api/stripe/webhooks/route.ts` — Webhook endpoint
- `src/app/(marketing)/pricing/page.tsx` — Pricing page
- `src/lib/hooks/use-user-tier.ts` — Hook to check user's current tier
- `src/components/shared/UpgradePrompt.tsx` — Upgrade nudge component

## Tasks

- [[TASK-P3-001-stripe-setup]] — Configure Stripe products, prices, webhooks
- [[TASK-P3-002-checkout-flow]] — Implement checkout and portal flows
- [[TASK-P3-003-tier-gating]] — Implement feature gating based on tier
- [[TASK-P3-004-pricing-page]] — Build pricing page
