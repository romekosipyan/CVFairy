# CVFairy Agentic SDLC Framework

> A Spec-Driven Agentic Development (SDAD) methodology for building a SaaS product with Next.js on Cloudflare, optimized for AI-agent-driven development in 2026.

## Foundational Principles

This framework synthesizes three converging paradigms:

1. **Spec-Driven Agentic Development (SDAD)** — the specification is the source of truth; code is a regenerable build artifact. When implementation is cheap, the spec becomes the scarce, valuable artifact because it's where judgment lives.
2. **Test-Driven Agentic Development (TDAD)** — tests are the behavioral contract. Separate the test author role from the implementation agent. Tests written first prevent the agent from "cheating" by modifying tests to pass.
3. **Codified Context Infrastructure** — three-tier knowledge architecture (hot memory, domain specialists, cold storage) that makes agent sessions coherent across long-running projects.

### Design Axioms

| # | Axiom | Rationale |
|---|-------|-----------|
| 1 | Specification before implementation | Agent output quality degrades sharply without rigorous up-front spec (empirically measured: 3-5x velocity with spec, unpredictable without) |
| 2 | Deterministic gates over advisory prompts | A prompt is advisory — the agent can drift from it. A gate that fails closed is structural |
| 3 | Cross-harness independence | The implementer cannot also be the sole reviewer. Use independent review (sub-agent, CI, or human) |
| 4 | Small units of work | Scope work in tasks an agent can complete in minutes to hours, with human review at the boundary |
| 5 | Progressive context disclosure | Agents start with minimal context and retrieve additional knowledge as needed, not front-loaded |
| 6 | Living knowledge, not documentation | Every approved plan, release, and decision improves context for the next task |

---

## The Agentic SDLC Cycle

```
INTENT → SPEC → PLAN → IMPLEMENT → VERIFY → DOCUMENT → SHIP
  ↑                                                        |
  └────────────── ITERATE (feedback loop) ─────────────────┘
```

Each phase has explicit **entry criteria**, **activities**, **deliverables**, **quality gates**, and **exit criteria**. The agent must not advance to the next phase until exit criteria and quality gates are satisfied.

---

## Phase 0: INTENT (Requirements Capture)

**Purpose:** Capture what to build and why, before deciding how.

**Entry criteria:** A user story, feature request, bug report, or business objective exists.

**Activities:**
1. Structured human-agent dialogue to elicit requirements, constraints, and business rules
2. Identify the user persona and their goal
3. Identify success metrics (how will we know this works?)
4. Identify constraints (performance budgets, accessibility requirements, security boundaries)
5. Surface ambiguities — list questions that must be answered before proceeding
6. Check for duplicates and overlaps with existing tasks

**Deliverables:**
- An Intent Record in `docs/knowledge-base/intents/` containing:
  - **User Story:** "As a [persona], I want [capability] so that [benefit]"
  - **Success Metrics:** measurable outcomes
  - **Constraints:** non-functional requirements
  - **Open Questions:** anything that must be answered before spec
  - **Priority:** p0-critical | p1-high | p2-medium | p3-low

**Quality Gate — Definition of Ready (DoR):**

| Check | Type | Severity |
|-------|------|----------|
| Has at least one acceptance criterion | Deterministic | Hard-mandatory |
| All references are resolvable (linked tasks exist) | Deterministic | Hard-mandatory |
| Description is ≥ 50 characters | Deterministic | Soft-mandatory |
| No open questions remain unanswered | Deterministic | Hard-mandatory |
| Acceptance criteria are verifiable (not vague) | Semantic | Soft-mandatory |
| No overlap with in-flight tasks | Semantic | Advisory |

**Exit criteria:** DoR gate passes. All open questions are resolved. Intent record committed to knowledge base.

---

## Phase 1: SPEC (Specification)

**Purpose:** Convert the intent into a machine-interpretable blueprint that the agent can implement against deterministically.

**Entry criteria:** Intent phase complete. DoR gate passed.

**Activities:**
1. Read the intent record and all linked knowledge base nodes
2. Define acceptance criteria as numbered, verifiable conditions
3. Define the data contract (TypeScript interfaces, Zod schemas, API request/response shapes)
4. Define edge cases and error states with expected behavior for each
5. Define the UI contract (if applicable): component hierarchy, state management, user interactions
6. List affected files and components with what changes in each
7. Identify dependencies on other tasks (blocking and blocked-by)
8. Identify security considerations (auth, input validation, data exposure)
9. Define the testing contract: what tests will prove the spec is satisfied

**Deliverables:**
- A Spec Document in `docs/knowledge-base/specs/` using the Spec Template (see appendix)

**Rules:**
- Specs are written for AI consumption: explicit code patterns, file paths, parameter names, expected behavior
- Every acceptance criterion must be testable — if you can't write a test for it, rewrite the criterion
- Data contracts use Zod schemas (source of truth) with TypeScript types derived from them
- Edge cases include: empty states, error states, boundary values, concurrent access, and permission denied
- The spec is version-controlled and treated as a living document

**Quality Gate — Spec Review:**

| Check | Type | Severity |
|-------|------|----------|
| All acceptance criteria are testable | Semantic | Hard-mandatory |
| Data contract has Zod schemas (not just TS types) | Deterministic | Hard-mandatory |
| At least 3 edge cases identified | Deterministic | Soft-mandatory |
| Affected files list is complete | Semantic | Soft-mandatory |
| Security considerations documented | Semantic | Advisory |
| No TBDs remain in any section | Deterministic | Hard-mandatory |

**Exit criteria:** Spec review gate passes. All sections filled. No TBDs. Human sign-off on acceptance criteria.

---

## Phase 2: PLAN (Technical Design)

**Purpose:** Convert the spec into an ordered, file-by-file task list where each step is independently verifiable.

**Entry criteria:** Spec phase complete. All quality gates passed.

**Activities:**
1. Design the implementation approach (patterns, libraries, architectural decisions)
2. Break the spec into ordered sub-steps (max 5-8 steps per task)
3. For each sub-step, identify:
   - Specific file changes (create, modify, delete)
   - What the step consumes from previous steps (inputs)
   - What the step produces for subsequent steps (outputs)
   - How to verify the step is complete (test or check)
4. Identify which steps can run in parallel (no data dependencies)
5. Design the test strategy using the RED-GREEN-REFACTOR pattern:
   - Which tests to write first (before implementation)
   - Which test framework and utilities to use
   - Mock strategy for external dependencies
6. Consider performance implications (bundle size, runtime, Cloudflare Worker limits)
7. Consider accessibility (ARIA, keyboard navigation, screen readers)
8. Document any architectural decisions and trade-offs (ADRs)

**Deliverables:**
- `## Implementation Plan` added to the spec document:
  - Ordered list of sub-steps with file paths
  - Dependency graph between steps (which can parallelize)
  - Test plan: TEST-IMPL pairs (red-green cycle)
  - Any new patterns or utilities to introduce
  - Migration steps if changing existing behavior

**Rules:**
- Each step must reference specific files
- Independent steps should be identified for potential parallel execution
- If a step requires a decision not covered in the spec, go back to SPEC phase
- Plan for rollback: every change should be reversible

**Quality Gate — Plan Review:**

| Check | Type | Severity |
|-------|------|----------|
| Each step references specific files | Deterministic | Hard-mandatory |
| TEST steps precede IMPL steps | Deterministic | Hard-mandatory |
| Each step has a verification method | Deterministic | Soft-mandatory |
| No step exceeds ~100 lines of change | Semantic | Advisory |
| Dependency graph has no cycles | Deterministic | Hard-mandatory |

**Exit criteria:** Plan review gate passes. Ordered steps with file references. Test plan defined. Human sign-off on architectural decisions.

---

## Phase 3: IMPLEMENT (Code)

**Purpose:** Execute the plan using strict Test-Driven Development with the agent.

**Entry criteria:** Plan phase complete. Dependencies resolved. All prerequisite tasks are done.

### The TDD Agent Loop

For each feature phase in the plan, implementation follows alternating TEST-IMPL pairs:

```
[TEST-01] Write failing test  →  Run test (must FAIL for right reason)
[IMPL-01] Write minimal code  →  Run test (must PASS)
[REFACTOR] Clean up           →  Run test (must still PASS)
                               ↓
[TEST-02] Write next test     →  Run test (must FAIL)
[IMPL-02] Implement           →  Run test (must PASS)
...repeat until feature complete...
```

**Activities:**
1. For each TEST-IMPL pair in the plan:
   a. **RED:** Write a failing test that captures one acceptance criterion or edge case
   b. Run the test — it must fail. If it passes, the test is wrong or the behavior already exists
   c. **GREEN:** Write the minimum code to make the test pass
   d. Run the test — it must pass without modifying the test file
   e. **REFACTOR:** Clean up the implementation while keeping tests green
   f. Run all tests to confirm no regressions
2. Write types/schemas FIRST (Zod schemas, TypeScript interfaces)
3. Follow all Cursor rules for the relevant technology
4. Run linter after each file edit
5. Keep changes small and focused — one concern per file change

**Rules:**
- Never skip a step in the plan
- If the plan needs to change, go back to PLAN phase and update it first
- Never modify a test to make it pass — fix the implementation
- Create files only when necessary; prefer editing existing files
- No TODO comments in shipped code — either implement it or create a new task
- Every function that can fail must handle errors explicitly
- Use early returns to reduce nesting
- Cloudflare-specific: respect Worker CPU time limits (50ms default), memory limits, and Durable Object transaction boundaries
- Checksums on test files: if a test file changes during implementation (outside of the RED phase), flag it as a violation

**Implementation Order for Next.js on Cloudflare:**
1. Zod schemas and TypeScript types (`src/lib/schemas/`)
2. Database schema changes / D1 migrations (`migrations/`)
3. Server-side logic: API routes, server actions (`app/api/`, server functions)
4. Cloudflare bindings: KV, D1, R2, Durable Objects (`worker/`)
5. Shared utilities and hooks (`src/lib/`, `src/hooks/`)
6. UI components (`src/components/`)
7. Page compositions (`app/[route]/page.tsx`)
8. Integration tests and E2E tests

**Exit criteria:** All TEST-IMPL pairs complete. All tests pass. Linter passes. No test files were modified during IMPL steps (checksum verified).

---

## Phase 4: VERIFY (Quality Assurance)

**Purpose:** Independently verify that the implementation satisfies the spec. The verifier should be independent from the implementer (cross-harness principle).

**Entry criteria:** Implementation is complete. All tests pass. Linter passes.

**Activities:**
1. **Spec Compliance Review:** Re-read every acceptance criterion from the spec. Verify each is satisfied by specific code and tests.
2. **Type Safety:** Run `tsc --noEmit` — zero errors
3. **Lint:** Run ESLint — zero errors, zero warnings in changed files
4. **Test Suite:** Run full test suite — zero failures, no skipped tests in new code
5. **Security Scan:** Check for:
   - Hardcoded secrets (API keys, passwords, tokens)
   - SQL injection (parameterized queries only for D1)
   - XSS (proper sanitization, React's built-in escaping)
   - Auth bypass (middleware coverage for protected routes)
6. **Performance Check:**
   - Bundle size impact (no single route > 300KB JS)
   - Worker CPU time within limits
   - No N+1 queries against D1
7. **Accessibility Check:**
   - Semantic HTML and ARIA attributes
   - Keyboard navigation works
   - Color contrast meets WCAG 2.1 AA
8. **Edge Case Trace:** Walk through each edge case from the spec mentally and verify handling
9. **Adversarial Review:** Attempt to break the implementation — malformed inputs, missing data, race conditions, unauthorized access

**Deliverables:**
- `## Verification` section added to spec document using the Verification Checklist (see appendix)

**Quality Gate — Verification:**

| Check | Type | Severity |
|-------|------|----------|
| All acceptance criteria verified | Manual | Hard-mandatory |
| `tsc --noEmit` passes | Automated | Hard-mandatory |
| ESLint passes | Automated | Hard-mandatory |
| Full test suite passes | Automated | Hard-mandatory |
| No hardcoded secrets | Automated | Hard-mandatory |
| Bundle size within budget | Automated | Soft-mandatory |
| Accessibility audit passes | Automated | Soft-mandatory |
| Adversarial review completed | Manual | Advisory |

**Exit criteria:** All hard-mandatory gates pass. Verification checklist committed. Human sign-off on spec compliance.

---

## Phase 5: DOCUMENT (Knowledge Capture)

**Purpose:** Capture decisions, trade-offs, and architectural changes so future agent sessions maintain coherence.

**Entry criteria:** Verification complete. All hard-mandatory gates pass.

**Activities:**
1. **Architecture Decision Records:** If the change affects system design, create or update an ADR in `docs/architecture/decisions/`
2. **Knowledge Base Updates:**
   - Update the knowledge graph (add links between related nodes)
   - Update subsystem specs if behavior changed
   - Add learnings that would help future agent sessions
3. **API Documentation:** JSDoc on public API functions and exported types (not internal implementation)
4. **README Updates:** If user-facing behavior changed
5. **Changelog Entry:** Add to CHANGELOG.md following Keep a Changelog format

**Rules:**
- Only document non-obvious decisions and trade-offs
- Never add comments that just narrate what code does
- Architecture docs use Mermaid diagrams where helpful
- Knowledge base entries are written for AI consumption: explicit, precise, actionable
- Don't document commands the agent already knows (use a linter instead of style guides)
- Don't duplicate what's already in the codebase

**What to Document (Keep):**
- Pitfalls and gotchas ("D1 doesn't support X, use Y instead")
- Rationale for non-obvious choices ("We use X instead of Y because...")
- Conventions that differ from framework defaults
- Security boundaries and trust assumptions
- Performance constraints and why they exist

**What NOT to Document (Drop):**
- Directory layouts (the filesystem is the layout)
- Dependency lists (package.json is the list)
- Generic architecture overviews (they go stale immediately)
- Commands the agent can discover by reading config files

**Exit criteria:** Knowledge base updated. Architecture docs current. No stale references.

---

## Phase 6: SHIP (Commit & Review)

**Purpose:** Package changes into a reviewable, mergeable unit.

**Entry criteria:** Documentation complete. All checks pass.

**Activities:**
1. Stage relevant files (never stage secrets, generated files, or node_modules)
2. Write a commit message following conventional commits format
3. Commit with granular, logical commits (not one giant commit)
4. Create a Pull Request using the PR Template (see appendix)
5. Respond to review feedback (may cycle back to IMPLEMENT or PLAN)
6. Update task status to `done`

**Commit Message Format:**
```
<type>(<scope>): <description>

[optional body: explain WHY, not WHAT]

[optional footer: BREAKING CHANGE, Closes #issue]
```

Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `perf`, `ci`
Scope: the subsystem or feature area (e.g., `auth`, `cv-parser`, `api`)

**Quality Gate — Ship:**

| Check | Type | Severity |
|-------|------|----------|
| Commit message follows conventional format | Automated | Hard-mandatory |
| No secrets in staged files | Automated | Hard-mandatory |
| CI pipeline passes (lint + types + tests) | Automated | Hard-mandatory |
| PR has description with spec link | Deterministic | Hard-mandatory |
| At least 1 human reviewer approved | Manual | Hard-mandatory |
| No unresolved review comments | Deterministic | Soft-mandatory |

**Exit criteria:** PR merged. Task node marked done. CI green on main.

---

## Phase 7: ITERATE (Feedback Loop)

**Purpose:** Handle feedback, bugs, and feature changes systematically.

**Entry criteria:** A shipped feature receives feedback, a bug report, or a change request.

**Activities:**
1. **Triage:** Classify the feedback:
   - Bug: unexpected behavior vs. spec → fix implementation
   - Spec gap: spec didn't cover this case → update spec, then implement
   - Feature change: requirements changed → new intent, back to Phase 0
   - Performance issue: meets spec but too slow → new task with perf constraints
2. **Root Cause Analysis:** For bugs, trace back to which phase failed:
   - Spec missed an edge case? → Improve spec process
   - Test didn't cover the scenario? → Add test coverage
   - Implementation diverged from spec? → Improve verification
3. **Create Follow-up Tasks:** New intent records referencing the original spec
4. **Update Knowledge Base:** Add the learning to prevent recurrence

**Feedback Classification Matrix:**

| Signal | Classification | Re-entry Phase |
|--------|---------------|----------------|
| "It crashes when..." | Bug | SPEC (add edge case) → IMPLEMENT |
| "It should also do X" | Feature change | INTENT → full cycle |
| "It's too slow" | Performance | SPEC (add perf constraint) → PLAN |
| "The API changed" | External dependency | PLAN → IMPLEMENT |
| "Users are confused by..." | UX issue | INTENT → SPEC → PLAN |

**Exit criteria:** Follow-up tasks created. Knowledge base updated with learnings.

---

## Project Knowledge Base Architecture

### Three-Tier Context Infrastructure

```
┌─────────────────────────────────────────────────┐
│  TIER 1: Hot Memory (Always Loaded)             │
│  AGENTS.md — ~100 lines, project constitution   │
│  .cursor/rules/*.mdc — glob-scoped rules        │
│  Loaded automatically every session             │
├─────────────────────────────────────────────────┤
│  TIER 2: Domain Specialists (Loaded Per-Task)   │
│  docs/knowledge-base/specs/ — task specs        │
│  docs/knowledge-base/subsystems/ — subsystem    │
│  docs/architecture/decisions/ — ADRs            │
│  Loaded when the agent works on that area        │
├─────────────────────────────────────────────────┤
│  TIER 3: Cold Storage (On-Demand Retrieval)     │
│  docs/knowledge-base/reference/ — API docs      │
│  docs/knowledge-base/learnings/ — past lessons  │
│  docs/knowledge-base/intents/ — historical      │
│  Retrieved only when explicitly needed           │
└─────────────────────────────────────────────────┘
```

### Tier 1: Hot Memory — AGENTS.md

The `AGENTS.md` file at the repository root is the single source of truth for project context. It is the only file that Cursor, Copilot, Codex, Claude Code, and most other AI coding tools all read without configuration.

**Structure (~100 lines, 4 sections):**

```markdown
# AGENTS.md

## Project
CVFairy is a SaaS platform for [purpose]. Built with Next.js (via vinext)
on Cloudflare Workers. Uses D1 for database, R2 for file storage, KV for
caching, Durable Objects for real-time features.

## Commands
- `pnpm dev` — start dev server (vinext + Cloudflare local runtime)
- `pnpm test` — run Vitest test suite
- `pnpm test:e2e` — run Playwright E2E tests
- `pnpm lint` — ESLint + Prettier check
- `pnpm typecheck` — TypeScript strict mode check
- `pnpm db:migrate` — apply D1 migrations locally
- `pnpm deploy` — deploy to Cloudflare Workers

## Conventions
- Zod schemas are the source of truth for data shapes; derive TS types with z.infer<>
- Server actions use the `actionClient` wrapper from src/lib/safe-action.ts
- API routes return { success, data, error } envelope
- Error handling: use Result<T, E> pattern, never throw in business logic
- File naming: kebab-case for files, PascalCase for components, camelCase for utilities
- Every new export in src/lib/ gets a test file next to it
- Database queries use Drizzle ORM; raw SQL only for D1-specific features
- Environment variables: Cloudflare bindings via env param, never process.env

## Pitfalls
- D1 has no ALTER COLUMN; use create-new-table + copy pattern for migrations
- Workers have 128MB memory limit; stream large files through R2, don't buffer
- KV is eventually consistent; don't use for data requiring read-after-write
- Durable Object transactions auto-retry on conflict; make handlers idempotent
- vinext requires vite.config.ts, not next.config.js, for Cloudflare-specific config
```

**Key rules for AGENTS.md:**
- Keep it under 100 lines — detailed knowledge goes in Tier 3
- Every instruction must be checkable ("every new export gets a test" not "write clean code")
- Update commands when scripts change — stale commands teach the agent to improvise
- Don't duplicate what's in the codebase (linter config, tsconfig, etc.)

### Tier 1: Hot Memory — Cursor Rules (.mdc)

Use `.cursor/rules/*.mdc` files for glob-scoped rules that activate only when relevant files are in context:

```
.cursor/rules/
├── always-on.mdc          # alwaysApply: true — repo-wide constants
├── api-routes.mdc         # globs: ["app/api/**"] — API conventions
├── components.mdc         # globs: ["src/components/**"] — React patterns
├── database.mdc           # globs: ["src/lib/db/**", "migrations/**"]
├── cloudflare.mdc         # globs: ["worker/**", "wrangler.jsonc"]
├── testing.mdc            # globs: ["**/*.test.*", "**/*.spec.*"]
└── commit-style.mdc       # description: "Commit message format" — agent-requested
```

**Rule:** Keep only one file with `alwaysApply: true`. Everything else should be glob-scoped so it only loads when relevant.

### Tier 2: Domain Specialists

Subsystem documentation in `docs/knowledge-base/subsystems/`, one file per subsystem:

```
docs/knowledge-base/subsystems/
├── auth.md                # Authentication system: flows, session handling
├── cv-parser.md           # CV parsing: file handling, extraction, validation
├── api-layer.md           # API design: envelope format, error codes, middleware
├── database.md            # D1 schema, migration patterns, query patterns
├── storage.md             # R2 file storage: upload, download, presigned URLs
├── real-time.md           # Durable Objects: WebSocket, live collaboration
└── deployment.md          # CI/CD, preview environments, production deploy
```

**Rules for subsystem docs:**
- Written for AI consumption: explicit code patterns with file paths and parameter names
- Scoped to a single subsystem (targeted retrieval, not monolithic)
- Living documents: updated by the agent at developer's direction
- Max ~500 lines each; split if larger

### Tier 3: Cold Storage

Reference material retrieved on-demand:
- `docs/knowledge-base/reference/` — external API docs, library guides
- `docs/knowledge-base/learnings/` — post-mortem insights, pattern discoveries
- `docs/knowledge-base/intents/` — historical intent records
- `docs/architecture/decisions/` — Architecture Decision Records

### Knowledge Base Node Linking

Use `[[wiki-links]]` between nodes to create a navigable graph:

```markdown
## Dependencies
- [[auth]] — requires authenticated user session
- [[TASK-042-user-profile]] — blocked by profile schema migration

## Related
- [[cv-parser]] — parsed data feeds into this feature
- [[ADR-007-zod-validation]] — rationale for validation approach
```

---

## Task Dependency Graph

### Structure

Tasks form a directed acyclic graph (DAG) based on their data and schema dependencies:

```
                    ┌──────────────┐
                    │  Foundation  │
                    │  (schemas,   │
                    │   types,     │
                    │   db tables) │
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
        ┌──────────┐ ┌──────────┐ ┌──────────┐
        │  Server  │ │  Server  │ │  Server  │
        │  Logic A │ │  Logic B │ │  Logic C │
        └────┬─────┘ └────┬─────┘ └────┬─────┘
             │             │             │
             ▼             ▼             ▼
        ┌──────────┐ ┌──────────┐ ┌──────────┐
        │   UI A   │ │   UI B   │ │   UI C   │  ← parallelizable
        └────┬─────┘ └────┬─────┘ └────┬─────┘
             │             │             │
             └─────────────┼─────────────┘
                           ▼
                    ┌──────────────┐
                    │  Integration │
                    │  & E2E Tests │
                    └──────────────┘
```

### Dependency Rules

1. **Schema tasks** have no dependencies and should be completed first
2. **Server logic** depends on schemas but not on UI
3. **UI components** depend on server logic (need API contracts) but can parallelize with each other
4. **Integration tests** depend on both server and UI being complete
5. A task cannot start until all its `Depends on` tasks are `done`
6. Circular dependencies indicate a spec problem — break the cycle by extracting a shared schema task

### Task Dispatch Order

When multiple tasks are ready (all dependencies met), prioritize:
1. Foundation/schema tasks (unblock the most downstream work)
2. Tasks on the critical path (longest chain to completion)
3. Higher priority tasks (p0 > p1 > p2 > p3)
4. Smaller tasks (faster feedback loops)

---

## Context Window Management

### The Problem

Large SaaS projects exceed AI context windows. A 200-file Next.js codebase can't be loaded all at once. Without strategy, the agent loses coherence, forgets conventions, and repeats mistakes.

### Strategies

#### 1. Progressive Disclosure

Agents start with minimal context and retrieve knowledge just-in-time:

```
Session Start:
  Load: AGENTS.md (~100 lines)
  Load: .cursor/rules/*.mdc (only glob-matched ones)
  Load: Current task spec (~200 lines)
  Total: ~500 lines ← fits easily

During Work:
  Load: Subsystem doc for the area being modified (~500 lines)
  Load: Referenced files as needed
  Total: ~2000-3000 lines at peak ← well within limits
```

#### 2. Task Scoping

- Each task is self-contained: the spec has all context needed
- Cross-references use `[[wiki-links]]` — the agent loads referenced docs only when needed
- Complete one task fully before starting the next (don't context-switch)

#### 3. Knowledge Tiering

| Tier | Loading Strategy | Size Budget |
|------|-----------------|-------------|
| Hot (AGENTS.md + active rules) | Always loaded | < 200 lines total |
| Warm (current task spec) | Loaded at task start | < 300 lines |
| Cold (subsystem docs, ADRs) | Loaded on demand | < 500 lines each |
| Archive (historical intents) | Rarely loaded | No limit |

#### 4. Context Hygiene

- Subsystem docs are max 500 lines; split if larger
- Task specs are max 300 lines; break into sub-tasks if larger
- AGENTS.md is max 100 lines; use pointers to detailed docs
- Cursor rules are max 50 lines each; use glob scoping

#### 5. Session Boundaries

- Start each session by reading the task spec (re-establish context)
- End each session by updating the task spec with current status
- If a task spans multiple sessions, the spec is the serialization format
- Small, frequent commits preserve progress if context is lost

---

## Quality Gates Summary

### Gate Enforcement Levels

| Level | Behavior | Override? |
|-------|----------|-----------|
| **Advisory** | Warn but don't block | N/A |
| **Soft-mandatory** | Block, but human can override with justification | Yes |
| **Hard-mandatory** | Block, no override | No |

### Gates by Phase

| Phase | Gate | Automated? | Enforcement |
|-------|------|------------|-------------|
| INTENT → SPEC | DoR: has acceptance criteria | Yes | Hard |
| INTENT → SPEC | DoR: no open questions | Yes | Hard |
| INTENT → SPEC | DoR: criteria are verifiable | Semantic | Soft |
| SPEC → PLAN | Has Zod schemas | Yes | Hard |
| SPEC → PLAN | Has ≥3 edge cases | Yes | Soft |
| SPEC → PLAN | No TBDs remain | Yes | Hard |
| PLAN → IMPLEMENT | Each step references files | Yes | Hard |
| PLAN → IMPLEMENT | TEST steps before IMPL | Yes | Hard |
| IMPLEMENT → VERIFY | All tests pass | Yes | Hard |
| IMPLEMENT → VERIFY | Linter passes | Yes | Hard |
| IMPLEMENT → VERIFY | Test files unchanged during IMPL | Yes | Hard |
| VERIFY → DOCUMENT | `tsc --noEmit` passes | Yes | Hard |
| VERIFY → DOCUMENT | No secrets in code | Yes | Hard |
| VERIFY → DOCUMENT | Bundle size within budget | Yes | Soft |
| VERIFY → DOCUMENT | Acceptance criteria all verified | Manual | Hard |
| DOCUMENT → SHIP | Knowledge base updated | Manual | Soft |
| SHIP → MERGE | CI pipeline green | Yes | Hard |
| SHIP → MERGE | Human reviewer approved | Manual | Hard |
| SHIP → MERGE | Conventional commit format | Yes | Hard |

---

## Appendix A: Spec Document Template

```markdown
# Spec: [Feature/Fix Title]

**Status:** draft | review | approved | implemented | verified
**Priority:** p0-critical | p1-high | p2-medium | p3-low
**Intent:** [[link-to-intent-record]]
**Author:** [human or agent]
**Created:** YYYY-MM-DD
**Last Updated:** YYYY-MM-DD

## Summary
[2-3 sentences: what this does and why it matters to the user]

## User Story
As a [persona], I want [capability] so that [benefit].

## Acceptance Criteria
1. GIVEN [context] WHEN [action] THEN [expected result]
2. GIVEN [context] WHEN [action] THEN [expected result]
3. ...

## Data Contract

### Input Schema
‍```typescript
import { z } from "zod";

export const FeatureInputSchema = z.object({
  // fields with validation
});

export type FeatureInput = z.infer<typeof FeatureInputSchema>;
‍```

### Output Schema
‍```typescript
export const FeatureOutputSchema = z.object({
  // fields
});

export type FeatureOutput = z.infer<typeof FeatureOutputSchema>;
‍```

### API Endpoint (if applicable)
- **Method:** POST
- **Path:** `/api/v1/feature`
- **Auth:** Required (session token)
- **Request:** `FeatureInputSchema`
- **Response:** `{ success: boolean, data: FeatureOutput, error?: string }`

## Edge Cases
1. **Empty input:** [expected behavior]
2. **Invalid data:** [expected behavior — validation errors]
3. **Unauthorized access:** [expected behavior — 401/403]
4. **Concurrent modification:** [expected behavior]
5. **Large payload:** [expected behavior — size limits]

## Security Considerations
- [ ] Input validation via Zod (never trust client data)
- [ ] Auth middleware protects the endpoint
- [ ] No PII logged
- [ ] SQL parameterized (Drizzle ORM handles this)

## Affected Files
- `src/lib/schemas/feature.ts` — CREATE: Zod schemas
- `app/api/v1/feature/route.ts` — CREATE: API route handler
- `src/lib/actions/feature.ts` — CREATE: server action
- `src/components/feature/FeatureForm.tsx` — CREATE: UI component
- `src/components/feature/FeatureForm.test.tsx` — CREATE: tests

## Dependencies
- [[TASK-XXX-user-auth]] — requires authenticated session (DONE)
- [[TASK-YYY-database-schema]] — requires user table migration (DONE)

## Blocks
- [[TASK-ZZZ-dashboard]] — dashboard needs this feature's output

## Implementation Plan

### Phase 1: Foundation
- [TEST-FND-01] Test Zod schema validation (valid input, invalid input, edge cases)
- [IMPL-FND-01] Create Zod schemas in `src/lib/schemas/feature.ts`

### Phase 2: Server Logic
- [TEST-SRV-01] Test server action: happy path returns correct output
- [TEST-SRV-02] Test server action: invalid input returns validation error
- [TEST-SRV-03] Test server action: unauthorized returns 401
- [IMPL-SRV-01] Create server action in `src/lib/actions/feature.ts`
- [IMPL-SRV-02] Create API route in `app/api/v1/feature/route.ts`

### Phase 3: UI
- [TEST-UI-01] Test component renders form fields
- [TEST-UI-02] Test component shows validation errors
- [TEST-UI-03] Test component submits data and shows success
- [IMPL-UI-01] Create FeatureForm component
- [IMPL-UI-02] Integrate with server action

## Verification
- [ ] AC1: [description] — PASS/FAIL
- [ ] AC2: [description] — PASS/FAIL
- [ ] Edge case 1: [description] — PASS/FAIL
- [ ] TypeScript: `tsc --noEmit` — PASS/FAIL
- [ ] Lint: `eslint .` — PASS/FAIL
- [ ] Tests: `pnpm test` — PASS/FAIL
- [ ] Security: no secrets, no SQL injection — PASS/FAIL

## Notes
[Decisions, trade-offs, and context for future reference]
```

---

## Appendix B: Pull Request Template

```markdown
## Summary
[1-3 bullet points describing what changed and why]

## Spec
Link: [[SPEC-XXX-feature-name]]

## Changes
- `path/to/file.ts` — [what changed]
- `path/to/file.ts` — [what changed]

## Type of Change
- [ ] Feature (new capability)
- [ ] Bug fix (corrects existing behavior)
- [ ] Refactor (no behavior change)
- [ ] Performance improvement
- [ ] Documentation

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] E2E tests added/updated (if UI-facing)
- [ ] Manual testing completed
- [ ] All existing tests pass

## Verification Checklist
- [ ] All acceptance criteria from spec are met
- [ ] Edge cases from spec are handled
- [ ] `tsc --noEmit` passes
- [ ] `eslint .` passes
- [ ] No hardcoded secrets
- [ ] Bundle size within budget
- [ ] Accessibility checked (if UI change)

## Cloudflare-Specific
- [ ] Worker CPU time within limits
- [ ] D1 queries are parameterized
- [ ] No buffering of large files (stream via R2)
- [ ] KV usage is read-heavy (not write-heavy)
- [ ] Durable Object handlers are idempotent

## Screenshots (if UI change)
[Before/After screenshots]

## Breaking Changes
[List any breaking changes and migration steps, or "None"]

## Deployment Notes
[Any special deployment steps, feature flags, or migration order]
```

---

## Appendix C: Architecture Decision Record Template

```markdown
# ADR-NNN: [Title]

**Status:** proposed | accepted | deprecated | superseded
**Date:** YYYY-MM-DD
**Supersedes:** [ADR-XXX, if applicable]

## Context
[What is the situation? What problem are we solving? What constraints exist?]

## Decision
[What did we decide? Be specific about the approach chosen.]

## Consequences

### Positive
- [Benefit 1]
- [Benefit 2]

### Negative
- [Trade-off 1]
- [Trade-off 2]

### Risks
- [Risk and mitigation]

## Alternatives Considered

### Option A: [Name]
- Pro: [advantage]
- Con: [disadvantage]
- Rejected because: [reason]

### Option B: [Name]
- Pro: [advantage]
- Con: [disadvantage]
- Rejected because: [reason]
```

---

## Appendix D: Testing Checklist by Layer

### Unit Tests (Vitest)

```markdown
## Schema Tests
- [ ] Valid input passes validation
- [ ] Each required field rejects undefined/null
- [ ] String fields reject non-string types
- [ ] Number fields reject NaN, Infinity, negative (if applicable)
- [ ] Enum fields reject invalid values
- [ ] Optional fields accept undefined
- [ ] Default values are applied correctly
- [ ] Transform functions work correctly

## Server Action Tests
- [ ] Happy path: valid input → correct output
- [ ] Invalid input: Zod validation error returned (not thrown)
- [ ] Unauthorized: returns auth error (not 500)
- [ ] Not found: returns 404-equivalent (not null pointer)
- [ ] Conflict: concurrent modification handled
- [ ] Database error: graceful error message (no stack trace to client)

## Component Tests (React Testing Library)
- [ ] Renders without crashing
- [ ] Displays initial state correctly
- [ ] User interaction triggers expected behavior
- [ ] Loading state shown during async operations
- [ ] Error state shown on failure
- [ ] Empty state shown when no data
- [ ] Form validation errors displayed
- [ ] Accessibility: has proper ARIA labels
- [ ] Accessibility: keyboard navigation works

## Hook Tests
- [ ] Returns expected initial state
- [ ] Updates state correctly on trigger
- [ ] Handles error cases
- [ ] Cleanup runs on unmount (no memory leaks)
```

### Integration Tests (Vitest + Miniflare)

```markdown
- [ ] API endpoint accepts valid request and returns correct response
- [ ] API endpoint rejects invalid request with proper error
- [ ] API endpoint enforces authentication
- [ ] Database operations persist and retrieve correctly
- [ ] KV cache hits and misses work correctly
- [ ] R2 file upload and download work correctly
- [ ] Durable Object state persists across requests
```

### E2E Tests (Playwright)

```markdown
- [ ] User can complete the happy path end-to-end
- [ ] Error messages display correctly
- [ ] Navigation between pages works
- [ ] Responsive: works on mobile viewport
- [ ] Performance: page loads under performance budget
- [ ] Cross-browser: Chrome, Firefox, Safari
```

---

## Appendix E: Next.js on Cloudflare — Platform-Specific Rules

### Architecture

```
┌─────────────────────────────────────────────┐
│              Cloudflare Edge                 │
├──────────┬──────────┬──────────┬────────────┤
│  Workers │    D1    │    R2    │     KV     │
│  (compute│ (SQL DB) │ (files)  │  (cache)   │
│  + SSR)  │          │          │            │
├──────────┴──────────┴──────────┴────────────┤
│         Durable Objects (stateful)          │
├─────────────────────────────────────────────┤
│    vinext (Next.js API on Vite/Workers)     │
├─────────────────────────────────────────────┤
│        Next.js App Router (RSC/SSR)         │
└─────────────────────────────────────────────┘
```

### Binding Rules

| Binding | Access Pattern | Use Case |
|---------|---------------|----------|
| D1 | `env.DB` in server functions | Relational data, transactions |
| KV | `env.CACHE` in server functions | Read-heavy cache, session data |
| R2 | `env.STORAGE` in server functions | File uploads, large objects |
| Durable Objects | `env.DO.get(id)` | Real-time state, WebSockets, rate limiting |
| Workers AI | `env.AI.run()` | LLM inference, embeddings |
| Queues | `env.QUEUE.send()` | Background jobs, event processing |

### Performance Budgets

| Metric | Budget | Enforcement |
|--------|--------|-------------|
| Worker CPU time | < 50ms (free) / < 30s (paid) | Hard |
| Worker memory | < 128MB | Hard |
| D1 query time | < 100ms per query | Soft |
| D1 result size | < 10MB per query | Hard |
| KV value size | < 25MB | Hard |
| R2 object size | < 5GB (multipart) | Hard |
| Bundle size (per route) | < 300KB JS | Soft |
| First Contentful Paint | < 1.5s | Soft |
| Largest Contentful Paint | < 2.5s | Soft |

### Migration Patterns for D1

D1 does not support `ALTER COLUMN`. Use this pattern:

```sql
-- 1. Create new table with desired schema
CREATE TABLE users_new (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL DEFAULT ''  -- changed column
);

-- 2. Copy data with transformation
INSERT INTO users_new (id, email, name)
SELECT id, email, COALESCE(name, '') FROM users;

-- 3. Drop old table
DROP TABLE users;

-- 4. Rename new table
ALTER TABLE users_new RENAME TO users;
```

### vinext Configuration

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import { vinext } from "@nicovj/vinext";
import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  plugins: [
    vinext({
      // Next.js API shims
    }),
    cloudflare({
      viteEnvironment: {
        name: "rsc",
        childEnvironments: ["ssr"],
      },
    }),
  ],
});
```

---

## Appendix F: Recommended File Structure

```
CVFairy/
├── AGENTS.md                          # Tier 1: always-on project context
├── .cursor/
│   └── rules/                         # Tier 1: glob-scoped Cursor rules
│       ├── always-on.mdc
│       ├── api-routes.mdc
│       ├── components.mdc
│       ├── database.mdc
│       ├── cloudflare.mdc
│       └── testing.mdc
├── docs/
│   ├── sdlc/
│   │   └── agentic-sdlc.md            # This document
│   ├── knowledge-base/
│   │   ├── intents/                    # Phase 0 intent records
│   │   ├── specs/                      # Phase 1 spec documents
│   │   ├── subsystems/                 # Tier 2: domain knowledge
│   │   ├── learnings/                  # Tier 3: historical insights
│   │   └── reference/                  # Tier 3: external API docs
│   └── architecture/
│       └── decisions/                  # ADRs
├── app/                               # Next.js App Router
│   ├── api/                           # API routes
│   ├── (auth)/                        # Auth-required route group
│   └── layout.tsx                     # Root layout
├── src/
│   ├── components/                    # React components
│   ├── hooks/                         # Custom React hooks
│   └── lib/
│       ├── schemas/                   # Zod schemas (source of truth)
│       ├── actions/                   # Server actions
│       ├── db/                        # Drizzle ORM schema + queries
│       └── utils/                     # Shared utilities
├── worker/                            # Cloudflare Worker entry + DOs
├── migrations/                        # D1 SQL migrations
├── tests/
│   ├── integration/                   # Integration tests (Miniflare)
│   └── e2e/                           # Playwright E2E tests
├── vite.config.ts                     # vinext + Cloudflare config
├── wrangler.jsonc                     # Cloudflare bindings
├── drizzle.config.ts                  # Drizzle ORM config
└── vitest.config.ts                   # Test config
```

---

## Appendix G: Glossary

| Term | Definition |
|------|-----------|
| **SDAD** | Spec-Driven Agentic Development — methodology where specs are the source of truth and code is a regenerable artifact |
| **TDAD** | Test-Driven Agentic Development — TDD applied to agentic workflows with separated test-author and implementer roles |
| **DoR** | Definition of Ready — pre-execution gate that refuses tasks the operator hasn't fully decided yet |
| **Quality Gate** | A checkpoint with graduated enforcement (advisory, soft-mandatory, hard-mandatory) |
| **Cross-harness independence** | The implementer cannot also be the sole reviewer; use independent verification |
| **Hot memory** | Context loaded every session (AGENTS.md, active rules) |
| **Cold storage** | Knowledge retrieved on-demand, not pre-loaded |
| **Intent record** | The "why" — user story, success metrics, constraints |
| **Spec document** | The "what" — acceptance criteria, data contracts, edge cases |
| **ADR** | Architecture Decision Record — documents a decision, alternatives, and trade-offs |
| **TEST-IMPL pair** | One red-green-refactor cycle: write failing test, then implement until it passes |
| **vinext** | Vite-based reimplementation of Next.js API, native Cloudflare Workers support |

---

## References

- [Spec-Driven Agentic Development (SDAD)](https://arxiv.org/html/2608.20341v1) — academic framework formalizing spec-first agentic development (2026)
- [AI-SDLC Framework](https://ai-sdlc.io/) — open-source declarative governance for autonomous development
- [The Agentic SDLC Handbook](https://danielmeppiel.github.io/agentic-sdlc-handbook/) — governance and decision matrices
- [Codified Context Infrastructure](https://arxiv.org/html/2602.20478v1) — three-tier knowledge architecture (hot/warm/cold)
- [Spec-First Development](https://aiarch.dev/workflows/spec-first-development) — brainstorm → spec → plan → implement workflow
- [Agentic TDD](https://github.com/narailabs/claude-agentic-tdd) — enforced TDD with anti-cheat guardrails
- [Spec Mint TDD](https://github.com/ngvoicu/specmint-tdd) — strict red-green-refactor enforcement for AI agents
- [Beyond Autocomplete: Best Agentic Coding Workflow in 2026](https://kilo.ai/articles/beyond-autocomplete) — hybrid workflow patterns
- [AGENTS.md Best Practices](https://agentpatterns.ai/standards/agents-md/) — project-level README for AI coding agents
- [Agentic-Oriented Development (AOD)](https://www.agentic-oriented-development.com/) — from context to knowledge management
- [vinext](https://vinext.dev/) — Next.js API surface reimplemented on Vite for Cloudflare Workers
- [Cloudflare Project Think](https://blog.cloudflare.com/project-think/) — next-generation agent primitives on Cloudflare
