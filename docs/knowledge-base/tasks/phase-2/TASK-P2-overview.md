# Phase 2 Tasks — Auth, Cloud Sync, AI, ATS

**Status:** done
**Phase:** ship
**Priority:** p1-high
**Depends on:** Phase 1 complete
**Requirements:** [[REQ-007-auth-cloud-sync]] [[REQ-005-ai-features]] [[REQ-006-ats-checker]]

## TASK-P2-010 — Auth.js setup

**Status:** done

Auth.js v5 (`next-auth@5.0.0-beta.32`) with Google, GitHub, and Resend magic link. A provider is enabled only when its env vars exist. JWT sessions, 30-day `maxAge`. D1 via `@auth/drizzle-adapter`. Login at `/login`. Sign-in is optional — editor, landing, and local dashboard stay public.

## TASK-P2-011 — D1 schema

**Status:** done

Drizzle tables: Auth.js `user` / `account` / `session` / `verificationToken` / `authenticator`, plus app fields on `user` (`tier`, AI usage, Stripe id) and `cloud_resumes`. SQL migration: `drizzle/0000_phase2_auth.sql`.

Apply locally with Node 22+: `npm run db:migrate:local`. Wrangler 4 refuses Node 20.

## TASK-P2-012 — Cloud sync

**Status:** done

Bidirectional sync API (`GET`/`POST`/`DELETE` `/api/sync`). Last-write-wins using `version` then `updatedAt`. Dashboard pulls cloud copies on sign-in and can upload local-only resumes. Per-resume status: local-only, syncing, synced, conflict. Unsync deletes the cloud copy and keeps the local one. Deleting a resume while signed in also removes the cloud copy.

## TASK-P2-013 — Route protection

**Status:** done

`src/proxy.ts` gates `/api/sync`, `/api/ai`, `/api/account`. Editor, landing, and local dashboard stay public. Handlers still call `auth()`. `/account` redirects to `/login` when signed out.

## TASK-P2-001–005 — AI

**Status:** done (non-streaming)

Workers AI via `env.AI.run("@cf/meta/llama-3.1-8b-instruct")` (JSON, not token streaming). `workers-ai-provider` needs AI SDK v7, which is outside the stack lock (`ai@6`). Prompt templates, 5 req/day for free accounts in D1, Pro skips the cap. AI panel + inline improve-with-accept/discard on summary.

## TASK-P2-006–009 — ATS

**Status:** done

Client-side parser, completeness + keyword scoring, parsed view, editor panel. Completeness and parsed view for everyone. JD keyword match when signed in (Pro billing is Phase 3).

## Verification

- `npx tsc --noEmit` passes
- `npx eslint src --max-warnings 0` passes
- OAuth buttons appear only after keys are set in `.dev.vars` / Cloudflare
- Local D1 + Workers AI need Wrangler bindings (`initOpenNextCloudflareForDev` in `next.config.ts`) and the SQL migration
