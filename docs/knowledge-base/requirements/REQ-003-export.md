# REQ-003: Multi-Format Export

**Status:** done
**Phase:** 1 (MVP)
**Priority:** p0-critical
**Depends on:** [[REQ-001-resume-editor]], [[REQ-002-templates]]
**Blocks:** none (standalone after dependencies met)

## Description

Export resumes in multiple formats, all generated client-side (no server cost). This is a key differentiator: Enhancv only exports PDF (and charges for unbranded export). CVFairy exports PDF, DOCX, HTML, Markdown, TXT, and JSON — all free, all without watermarks.

## Acceptance Criteria

1. **PDF export** — pixel-accurate match to preview, uses @react-pdf/renderer
2. **DOCX export** — structured Word document with proper headings, lists, and formatting
3. **HTML export** — clean, semantic HTML with inline styles
4. **Markdown export** — standard Markdown format
5. **Plain Text export** — formatted text suitable for copy-paste into forms
6. **JSON export** — full resume data for backup/import
7. All exports trigger browser download (no server round-trip)
8. PDF supports US Letter and A4 page sizes
9. No watermarks, branding, or "Made with CVFairy" on any export
10. Filename defaults to `{full_name}_Resume.{ext}` (configurable)
11. Export button shows format picker dropdown
12. Export completes in < 3 seconds for a typical 1-page resume

## Data Contract

```typescript
type ExportFormat = 'pdf' | 'docx' | 'html' | 'markdown' | 'txt' | 'json';

interface ExportOptions {
  format: ExportFormat;
  pageSize: 'a4' | 'letter';
  filename?: string;
}

// Each export engine implements this interface
interface ExportEngine {
  export(resume: Resume, settings: ResumeSettings, options: ExportOptions): Promise<Blob>;
}
```

## Edge Cases

1. Very long resume (5+ pages) — PDF pagination must work correctly
2. Special characters in filename — sanitize for filesystem
3. Font not available in DOCX — use closest system font mapping
4. Photo in resume — embedded in PDF, referenced in DOCX
5. Export while editing — use snapshot of current state
6. Large resume data — JSON export must not crash browser
7. Mobile browser — download may behave differently, provide fallback

## Affected Files

- `src/lib/export/pdf-engine.ts` — PDF generation with @react-pdf/renderer
- `src/lib/export/docx-engine.ts` — DOCX generation with docx library
- `src/lib/export/html-engine.ts` — HTML export
- `src/lib/export/markdown-engine.ts` — Markdown export
- `src/lib/export/text-engine.ts` — Plain text export
- `src/lib/export/json-engine.ts` — JSON export
- `src/lib/export/index.ts` — Unified export interface
- `src/components/editor/ExportButton.tsx` — Export UI with format picker
- `src/lib/utils/download.ts` — Browser download trigger utility

## Tasks

- [[TASK-P1-014-export-interface]] — Define export engine interface and download utility
- [[TASK-P1-015-pdf-export]] — Implement PDF export engine
- [[TASK-P1-016-docx-export]] — Implement DOCX export engine
- [[TASK-P1-017-other-exports]] — Implement HTML, Markdown, TXT, JSON exports
- [[TASK-P1-018-export-ui]] — Build export button with format picker
