# CVFairy — Knowledge Base Index

**Product:** AI-powered resume builder that beats Enhancv
**Tagline:** "Your resume, your rules. No watermarks. No surprises."

## Why CVFairy Exists

Enhancv and its competitors share common problems:
- No real free tier (watermarks, paywalls, 7-day trials)
- No DOCX export (the #1 user request)
- Expensive subscriptions with no lifetime option
- Opaque ATS scoring that users don't trust
- Limited customization (fixed date formats, locked sections)
- Desktop-only, no offline support

CVFairy fixes all of these while being deployed on Cloudflare's free tier.

## Core Differentiators
1. **Honest free tier** — 3 templates, PDF export, no watermarks, ever
2. **Multi-format export** — PDF, DOCX, HTML, Markdown, TXT, JSON
3. **Transparent ATS** — show exactly what ATS software parses
4. **Local-first** — works offline, data stays on device by default
5. **Lifetime pricing** — $149 once, or $9.99/mo, or free forever

## Requirements Map

```mermaid
graph LR
    subgraph phase1 [Phase 1 — MVP]
        REQ001[[REQ-001 Resume Editor]]
        REQ002[[REQ-002 Templates]]
        REQ003[[REQ-003 Export]]
        REQ004[[REQ-004 Local Storage]]
        REQ012[[REQ-012 Landing Page]]
    end

    subgraph phase2 [Phase 2 — AI + ATS]
        REQ005[[REQ-005 AI Features]]
        REQ006[[REQ-006 ATS Checker]]
        REQ007[[REQ-007 Auth + Cloud Sync]]
    end

    subgraph phase3 [Phase 3 — Full Platform]
        REQ008[[REQ-008 Payments]]
        REQ009[[REQ-009 Cover Letter]]
        REQ010[[REQ-010 Job Tracker]]
        REQ011[[REQ-011 i18n]]
    end

    REQ001 --> REQ002
    REQ001 --> REQ003
    REQ001 --> REQ004
    REQ002 --> REQ003
    REQ004 --> REQ007
    REQ007 --> REQ005
    REQ007 --> REQ006
    REQ007 --> REQ008
    REQ008 --> REQ009
    REQ008 --> REQ010
    REQ001 --> REQ011
```

## Architecture Decisions
- [[ADR-001-local-first]] — Why local-first and how IndexedDB + cloud sync works
- [[ADR-002-cloudflare-stack]] — Why Cloudflare, what services, free tier limits
- [[ADR-003-pdf-engine]] — Why @react-pdf/renderer for client-side PDF generation
- [[ADR-004-state-management]] — Why Zustand + Immer, store architecture
- [[ADR-005-ai-integration]] — AI model selection, prompt patterns, rate limiting

## Glossary
See [[glossary]] for domain terms (ATS, resume sections, job tailoring, etc.)
