# Knowledge Graph

Obsidian-compatible map of every node. Open this vault (`docs/knowledge-base/`) in Obsidian to see the graph view.

## Hub

- [[index]]
- [[glossary]]

## Requirements

- [[REQ-001-resume-editor]] → [[REQ-002-templates]] [[REQ-003-export]] [[REQ-004-local-storage]]
- [[REQ-002-templates]] → [[REQ-003-export]]
- [[REQ-004-local-storage]] → [[REQ-007-auth-cloud-sync]]
- [[REQ-007-auth-cloud-sync]] → [[REQ-005-ai-features]] [[REQ-006-ats-checker]] [[REQ-008-payments]]
- [[REQ-008-payments]] → [[REQ-009-cover-letter]] [[REQ-010-job-tracker]]
- [[REQ-001-resume-editor]] → [[REQ-011-i18n]]
- [[REQ-012-landing-page]] (independent)

## Architecture

- [[ADR-001-local-first]]
- [[ADR-002-cloudflare-stack]]
- [[ADR-003-pdf-engine]]
- [[ADR-004-state-management]]
- [[ADR-005-ai-integration]]

## Phase 1 Tasks

- [[TASK-P1-001-scaffold]] → [[TASK-P1-002-schemas]] [[TASK-P1-019-indexeddb]] [[TASK-P1-024-marketing-layout]]
- [[TASK-P1-002-schemas]] → [[TASK-P1-003-store]]
- [[TASK-P1-003-store]] → [[TASK-P1-004-editor-layout]] [[TASK-P1-005-form-sections]]
- [[TASK-P1-004-editor-layout]] → [[TASK-P1-005-form-sections]]
- [[TASK-P1-005-form-sections]] → [[TASK-P1-006-preview]] [[TASK-P1-007-dnd]]
- [[TASK-P1-006-preview]] → [[TASK-P1-008-template-system]]
- [[TASK-P1-008-template-system]] → [[TASK-P1-009-to-027-remaining]]
- [[TASK-P1-009-to-027-remaining]] (templates, export, library, marketing — shipped)

## Phase 2 Tasks

- [[TASK-P2-overview]] — shipped (auth, D1, sync, AI, ATS)

## Phase 3

- [[REQ-008-payments]] — next
