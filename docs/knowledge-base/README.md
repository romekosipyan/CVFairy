# CVFairy Knowledge Base

This is an Obsidian-compatible knowledge graph for the CVFairy project. Each `.md` file is a node. Nodes link to each other using `[[wiki-links]]`.

## Structure

```
knowledge-base/
  index.md                    # Root node — project overview and navigation
  requirements/               # Feature requirements (what to build)
    REQ-001-resume-editor.md
    REQ-002-templates.md
    REQ-003-export.md
    REQ-004-local-storage.md
    REQ-005-ai-features.md
    REQ-006-ats-checker.md
    REQ-007-auth-cloud-sync.md
    REQ-008-payments.md
    REQ-009-cover-letter.md
    REQ-010-job-tracker.md
    REQ-011-i18n.md
    REQ-012-landing-page.md
  architecture/               # Architecture decisions (how to build it)
    ADR-001-local-first.md
    ADR-002-cloudflare-stack.md
    ADR-003-pdf-engine.md
    ADR-004-state-management.md
    ADR-005-ai-integration.md
  tasks/                      # Implementation tasks (units of work)
    phase-1/                  # MVP tasks
    phase-2/                  # AI + ATS tasks
    phase-3/                  # Full platform tasks
  glossary.md                 # Domain terms
```

## Conventions

- Node IDs use prefixes: `REQ-` (requirement), `ADR-` (architecture decision), `TASK-` (implementation task)
- Links use double brackets: `[[REQ-001-resume-editor]]`
- Tags use YAML frontmatter: `tags: [phase-1, editor, component]`
- Status uses YAML frontmatter: `status: todo | in-progress | done | blocked`
