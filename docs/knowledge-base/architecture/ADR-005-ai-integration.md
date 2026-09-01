# ADR-005: AI Integration Strategy

**Status:** accepted
**Date:** 2026-09-01
**Relates to:** [[REQ-005-ai-features]]

## Context

AI features are a key differentiator. Need to support:
- Free tier users (limited AI, using Cloudflare Workers AI)
- Pro users (unlimited AI, using Workers AI or user's own API key)
- Future: support multiple AI providers

## Decision

Use **Vercel AI SDK** (provider-agnostic) with **Cloudflare Workers AI** as the default backend. AI requests proxy through a Next.js API route for rate limiting and key management.

### Model Selection

| Tier | Model | Provider | Cost |
|------|-------|----------|------|
| Free | @cf/meta/llama-3.1-8b-instruct | Workers AI | Free (10K neurons/day) |
| Pro | @cf/meta/llama-3.3-70b-instruct-fp8-fast | Workers AI | Free tier included |
| Pro (BYOK) | gpt-4o-mini or claude-3.5-sonnet | OpenAI/Anthropic | User's API key |

### Rate Limiting

| Tier | Limit | Window |
|------|-------|--------|
| Free (no account) | 3 requests | per day (IP-based via KV) |
| Free (account) | 5 requests | per day (user ID-based via D1) |
| Pro | Unlimited | fair use (100 requests/hour) |

## Consequences

**Positive:**
- Workers AI free tier gives us AI features at $0 cost
- Vercel AI SDK is available for future streaming / BYOK (`ai@6` stack lock)
- Rate limiting protects against abuse

**Negative:**
- Workers AI models are smaller/less capable than GPT-4o/Claude
- Phase 2 calls `env.AI.run` directly (full JSON). Token streaming needs `workers-ai-provider` + AI SDK v7, which would break the stack lock
- Need to proxy all AI requests through API routes (can't call Workers AI from client)
