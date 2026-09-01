# REQ-006: ATS Checker

**Status:** done
**Phase:** 2 (AI + ATS)
**Priority:** p1-high
**Depends on:** [[REQ-007-auth-cloud-sync]]
**Blocks:** none

## Description

A transparent ATS (Applicant Tracking System) scoring tool that shows users exactly how their resume will be parsed by automated systems. Unlike Enhancv's opaque score, CVFairy shows a "parsed view" — the raw structured data that an ATS extracts.

## Acceptance Criteria

1. **Parsed View** — shows resume as ATS would see it (plain text, section-by-section extraction)
2. **Job Match Score** — paste a JD, get a percentage match with breakdown
3. **Keyword Analysis** — side-by-side: keywords in JD vs. keywords in resume, with gaps highlighted
4. **Section Completeness** — checks for: contact info, summary, experience, education, skills
5. **Formatting Checks** — flags potential parsing issues (if any exist)
6. **Actionable Suggestions** — each issue has a specific "fix this" action
7. Score methodology is explained (not a black box)
8. Everyone: section completeness, formatting flags, and parsed view (client-side, no account)
9. Signed-in: paste a job description for keyword match / gap (Pro billing is Phase 3)
10. Results display in a panel alongside the editor

## Data Contract

```typescript
interface ATSCheckResult {
  overallScore: number; // 0-100
  sections: {
    name: string;
    found: boolean;
    completeness: number; // 0-100
    issues: ATSIssue[];
  }[];
  keywords: {
    fromJD: string[];
    inResume: string[];
    missing: string[];
    matchPercentage: number;
  };
  formatting: {
    check: string;
    status: 'pass' | 'warn' | 'fail';
    suggestion?: string;
  }[];
  parsedView: {
    section: string;
    content: string; // Plain text as ATS would read it
  }[];
}

interface ATSIssue {
  severity: 'error' | 'warning' | 'info';
  message: string;
  fix?: { label: string; action: string };
}
```

## Affected Files

- `src/lib/ats/checker.ts` — ATS checking logic
- `src/lib/ats/keyword-extractor.ts` — Keyword extraction from JD
- `src/lib/ats/parser-simulator.ts` — Simulates ATS parsing
- `src/lib/ats/scorer.ts` — Score calculation
- `src/components/editor/ATSPanel.tsx` — ATS checker UI panel
- `src/components/editor/ParsedView.tsx` — Parsed view display
- `src/components/editor/KeywordGap.tsx` — Keyword gap visualization

## Tasks

- [[TASK-P2-006-ats-parser]] — Build ATS parser simulator
- [[TASK-P2-007-ats-scorer]] — Implement scoring algorithm
- [[TASK-P2-008-keyword-analysis]] — Build keyword extraction and gap analysis
- [[TASK-P2-009-ats-ui]] — Build ATS checker panel and parsed view UI
