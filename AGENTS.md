# CVFairy — Agent Instructions

This is the hot-memory document. Read it at the start of every session. Retrieve additional context on demand from the knowledge base.

## What This Is

CVFairy is an AI-powered resume builder SaaS. Local-first (IndexedDB default), optional cloud sync, honest free tier, multi-format export (PDF + DOCX), deployed on Cloudflare free tier.

## How to Work

Follow the Agentic SDLC in `docs/sdlc/agentic-sdlc.md`:

```
INTENT → SPEC → PLAN → IMPLEMENT → VERIFY → DOCUMENT → SHIP
```

1. Pick a task from `docs/knowledge-base/tasks/`
2. Read its spec and all linked `[[wiki-links]]`
3. Implement only that task
4. Verify against acceptance criteria
5. Update the task node status
6. Commit with conventional commits

## Where Things Live

| Need | Location |
|------|----------|
| Product requirements | `docs/knowledge-base/requirements/` |
| Architecture decisions | `docs/knowledge-base/architecture/` |
| Implementation tasks | `docs/knowledge-base/tasks/phase-N/` |
| Domain glossary | `docs/knowledge-base/glossary.md` |
| SDLC methodology | `docs/sdlc/agentic-sdlc.md` |
| Cursor rules (tech specs) | `.cursor/rules/*.mdc` |
| Index / navigation | `docs/knowledge-base/index.md` |

## Stack (Do Not Change Without an ADR)

- Next.js 16 App Router + React 19 + TypeScript strict
- Tailwind CSS 4 + shadcn/ui
- Zustand v5 + Immer + Zod v4
- @react-pdf/renderer (PDF) + docx (Word) — both client-side
- Cloudflare Pages via `@opennextjs/cloudflare`
- D1 (SQLite) + R2 + KV + Workers AI
- Auth.js v5 + Drizzle ORM
- Vercel AI SDK v6

## Absolute Constraints

- No `any`, no unexplained `as` casts
- No watermarks on any export, ever
- No secrets in source — use `.dev.vars` / Cloudflare dashboard
- Stay within Cloudflare free-tier limits (see `000-project-core.mdc`)
- Local-first: editor works without an account
- Edge-compatible packages only (no `fs`, no Puppeteer, no `bcrypt` — use `bcryptjs`)

## Current Phase

**Phase 2 — Auth, cloud sync, AI, ATS.** Complete (`docs/knowledge-base/tasks/phase-2/TASK-P2-overview.md`). Next: Phase 3 payments (`docs/knowledge-base/requirements/REQ-008-payments.md`)

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
