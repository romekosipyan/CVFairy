# REQ-007: Authentication & Cloud Sync

**Status:** done
**Phase:** 2 (AI + ATS)
**Priority:** p1-high
**Depends on:** [[REQ-004-local-storage]]
**Blocks:** [[REQ-005-ai-features]], [[REQ-006-ats-checker]], [[REQ-008-payments]]

## Description

Optional authentication for cloud features. Users can use CVFairy fully without an account (local-first). Signing in enables: cloud sync across devices, AI features (rate limited to account), ATS checker, and future Pro features.

## Acceptance Criteria

1. Auth providers: Google, GitHub, email magic link (no passwords to store)
2. Signing in is optional — all local features work without it
3. On first sign-in, offer to sync existing local resumes to cloud
4. Cloud sync is bidirectional: local changes push up, cloud changes pull down
5. Conflict resolution: last-write-wins with version numbers
6. User can see sync status per resume (synced, syncing, conflict, local-only)
7. User can explicitly unsync a resume (remove from cloud, keep local)
8. User can delete their account and all cloud data (GDPR compliance)
9. Session persists for 30 days with refresh tokens
10. Protected APIs: `/api/sync`, `/api/ai`, `/api/account` require auth. ATS scoring is client-side and does not use an API.
11. Public routes: editor (local mode), templates, landing page, and local dashboard work without auth. `/account` requires a session.

## Data Contract

```typescript
// Database schema (Drizzle + D1)
const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  image: text('image'),
  tier: text('tier', { enum: ['free', 'pro'] }).default('free'),
  stripeCustomerId: text('stripe_customer_id'),
  aiUsageToday: integer('ai_usage_today').default(0),
  aiUsageResetAt: text('ai_usage_reset_at'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

const cloudResumes = sqliteTable('cloud_resumes', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  data: text('data').notNull(), // JSON stringified Resume
  settings: text('settings').notNull(), // JSON stringified ResumeSettings
  version: integer('version').notNull().default(1),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});
```

## Affected Files

- `src/auth.ts` / `src/auth.config.ts` — Auth.js configuration
- `src/lib/db/schema.ts` — Drizzle schema definitions
- `src/lib/db/client.ts` — D1 database client
- `src/lib/sync/cloud-sync.ts` — Sync engine
- `src/lib/sync/conflict-resolver.ts` — Conflict resolution logic
- `src/app/api/auth/[...nextauth]/route.ts` — Auth API routes
- `src/app/api/sync/route.ts` — Sync API endpoints
- `src/proxy.ts` — Route protection (Next.js 16; middleware is deprecated)
- `src/components/shared/AuthButton.tsx` — Sign in/out button

## Tasks

- [[TASK-P2-010-auth-setup]] — Configure Auth.js with Google, GitHub, email
- [[TASK-P2-011-db-schema]] — Define and migrate Drizzle schema on D1
- [[TASK-P2-012-sync-engine]] — Build cloud sync engine
- [[TASK-P2-013-protected-routes]] — Set up middleware for protected routes
