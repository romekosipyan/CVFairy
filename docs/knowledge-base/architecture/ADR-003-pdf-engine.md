# ADR-003: Client-Side PDF Engine

**Status:** accepted
**Date:** 2026-09-01
**Relates to:** [[REQ-003-export]], [[REQ-002-templates]]

## Context

Resume builders need to generate PDFs. Two approaches:
1. **Server-side** — use Puppeteer/Chromium to render HTML to PDF (heavy, expensive)
2. **Client-side** — use @react-pdf/renderer to generate PDF in the browser (free, fast)

## Decision

Use **@react-pdf/renderer** for client-side PDF generation.

Each template has two render functions:
- `render()` — returns React/HTML for the live preview
- `renderPdf()` — returns @react-pdf/renderer components for PDF export

Both functions consume the same resume data and settings, ensuring visual consistency.

## Consequences

**Positive:**
- Zero server cost for PDF generation
- No Puppeteer/Chromium dependency (saves ~300MB+ per server instance)
- Works offline (PDFs generated entirely in the browser)
- Fast generation (<2 seconds for typical resume)

**Negative:**
- Two render paths per template (HTML preview + PDF) — more code to maintain
- @react-pdf/renderer has its own styling system (not CSS, not Tailwind)
- Font handling requires explicit registration
- Some CSS features not available in @react-pdf/renderer

## Template Architecture

```
templates/classic/
  ClassicPreview.tsx     # HTML/React for live preview (uses Tailwind)
  ClassicPdf.tsx         # @react-pdf/renderer components for PDF
  classic.config.ts      # Shared configuration (colors, spacing, fonts)
  thumbnail.png          # Template thumbnail for picker
```

Both `ClassicPreview` and `ClassicPdf` import from `classic.config.ts` to stay in sync.
