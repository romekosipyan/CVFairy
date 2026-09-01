# TASK-P1-001: Project Scaffolding

**Status:** done
**Phase:** ship
**Priority:** p0-critical
**Depends on:** none
**Blocks:** all other tasks
**Requirement:** [[REQ-001-resume-editor]]

## Description

Initialize the CVFairy project: git repo, Next.js 16 with TypeScript, Tailwind CSS 4, shadcn/ui, and all core dependencies. Configure for Cloudflare Pages deployment.

## Acceptance Criteria

1. Git repo initialized with `.gitignore`
2. Next.js 16 project created with App Router and TypeScript strict mode
3. Tailwind CSS 4 configured with CSS-first approach
4. shadcn/ui initialized with default theme
5. All core dependencies installed (see list below)
6. `@opennextjs/cloudflare` configured for Cloudflare Pages deployment
7. `wrangler.jsonc` configured for D1, R2, KV bindings
8. Directory structure matches project conventions in core rules
9. ESLint + Prettier configured
10. `dev` script works locally (`npm run dev`)
11. TypeScript compiles without errors (`tsc --noEmit`)

## Dependencies to Install

### Core
- `next@16` `react@19` `react-dom@19`
- `typescript` `@types/react` `@types/react-dom`

### Styling
- `tailwindcss@4` `@tailwindcss/postcss`
- shadcn/ui (via `npx shadcn@latest init`)

### State & Validation
- `zustand` `immer`
- `zod`

### Cloudflare
- `@opennextjs/cloudflare` `wrangler`

### Utilities
- `clsx` `tailwind-merge` `class-variance-authority`
- `lucide-react` (icons)
- `nanoid` (ID generation, edge-compatible)

## Affected Files

- `package.json` — all dependencies
- `tsconfig.json` — TypeScript strict mode, path aliases
- `next.config.ts` — Next.js configuration
- `wrangler.jsonc` — Cloudflare bindings
- `src/app/layout.tsx` — Root layout
- `src/app/page.tsx` — Placeholder home page
- `src/app/globals.css` — Tailwind imports and CSS variables
- `src/lib/utils.ts` — cn() utility (from shadcn/ui)
- `.gitignore` — standard Next.js + Cloudflare ignores
- `.eslintrc.json` — ESLint config
- `open-next.config.ts` — OpenNext Cloudflare config

## Implementation Plan

1. Initialize git repo and create `.gitignore`
2. Run `npx create-next-app@latest` with TypeScript, App Router, Tailwind, src/ directory
3. Install additional dependencies
4. Initialize shadcn/ui
5. Configure `@opennextjs/cloudflare`
6. Create `wrangler.jsonc` with D1, R2, KV bindings
7. Set up directory structure per conventions
8. Configure path aliases (`@/` → `src/`)
9. Verify `npm run dev` works
10. Verify `tsc --noEmit` passes

## Verification

- [x] Git repo initialized with `.gitignore` (Cloudflare + env files ignored)
- [x] Next.js 16.3.4 + React 19.2.8 + TypeScript strict + App Router + `src/`
- [x] Tailwind CSS 4 CSS-first (`@import "tailwindcss"`, `@theme inline`)
- [x] shadcn/ui initialized (`base-nova`, Button primitive, `cn()`)
- [x] Core deps: zustand, immer, zod v4, idb, drizzle-orm, lucide-react, nanoid, cva, clsx, tailwind-merge
- [x] `@opennextjs/cloudflare` + wrangler + `wrangler.jsonc` + `open-next.config.ts`
- [x] Directory structure matches `.cursor/rules/000-project-core.mdc`
- [x] ESLint configured (`eslint.config.mjs`)
- [x] `tsc --noEmit` passes
- [x] `eslint .` passes

## Notes

- Wrangler 4 wants Node >= 22. Local Node is 20.19.0 — `npm run dev` is fine; `wrangler`/`deploy` may warn. Upgrade Node before first Cloudflare deploy.
- D1 / R2 / KV IDs in `wrangler.jsonc` are placeholders. Create real resources with `wrangler d1 create`, `wrangler r2 bucket create`, `wrangler kv namespace create` before deploy.
- Next implementation task: [[TASK-P1-002-schemas]]
