# ADR-002: Cloudflare Deployment Stack

**Status:** accepted
**Date:** 2026-09-01
**Relates to:** all requirements

## Context

The project needs a deployment target. Options considered:
- **Vercel** — best Next.js support but costs scale with traffic
- **Cloudflare Pages** — generous free tier, edge deployment, integrated services
- **AWS/GCP** — overkill for an early-stage SaaS

## Decision

Deploy on **Cloudflare** using their free tier:

| Service | Usage | Free Tier Limit |
|---------|-------|-----------------|
| **Cloudflare Pages** | Host the Next.js application | 500 builds/month, unlimited bandwidth |
| **D1** | SQLite database for users, cloud resumes | 5GB, 5M reads/day, 100K writes/day |
| **R2** | Object storage for profile photos | 10GB, 1M Class A, 10M Class B ops/month |
| **KV** | Session storage, rate limiting, cache | 100K reads/day, 1K writes/day, 1GB |
| **Workers AI** | AI features (bullets, summaries) | 10K neurons/day |

Next.js on Cloudflare uses **`@opennextjs/cloudflare`** (OpenNext). `@cloudflare/next-on-pages` is archived (Sept 2025) and must not be used. Cloudflare's newer **vinext** adapter is an option for future migration (95% Next.js compatibility) but OpenNext is the stable path for this project.

## Consequences

**Positive:**
- $0/month for early stage — free tier covers substantial traffic
- Edge deployment — fast globally without CDN configuration
- Integrated services — D1, R2, KV, Workers AI all in one platform
- No cold starts (Cloudflare Workers start in <1ms)

**Negative:**
- Edge runtime limitations — no Node.js `fs`, `child_process`, etc.
- D1 is SQLite-based — no PostgreSQL features (JSON operators, etc.)
- Some npm packages don't work in edge runtime (must verify compatibility)
- @opennextjs/cloudflare is newer than Vercel's native Next.js support
- Workers AI model selection is limited compared to OpenAI/Anthropic directly

## Edge Runtime Constraints

These Node.js APIs are NOT available:
- `fs` — use R2 or D1 instead
- `child_process` — not available
- `crypto` — use Web Crypto API instead
- `net/http` — use Fetch API instead
- Dynamic `require()` — use static imports

These patterns work fine:
- `fetch()` API
- Web Crypto (`crypto.subtle`)
- `TextEncoder` / `TextDecoder`
- `URL` and `URLSearchParams`
- `Headers`, `Request`, `Response`
- Most pure-JS npm packages
