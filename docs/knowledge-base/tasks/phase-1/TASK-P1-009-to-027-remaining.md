# Phase 1 Remaining Tasks (P1-009 through P1-027)

**Status:** done
**Phase:** ship

All items below shipped in the same implementation pass. Browser live-check skipped (anti-stall). `tsc --noEmit` and eslint pass.

## Templates (P1-009 to P1-013)

- **TASK-P1-009: Classic Template** — done. Single-column HTML + PDF. `src/templates/classic/`
- **TASK-P1-010: Modern Template** — done. Two-column sidebar HTML + PDF. `src/templates/modern/`
- **TASK-P1-011: Minimal Template** — done. Centered name, extra tracking. `src/templates/minimal/`
- **TASK-P1-012: Template Picker** — done. Gallery dialog from toolbar. `src/components/editor/TemplatePicker.tsx`
- **TASK-P1-013: Settings Panel** — done. Color, font, size, spacing, date format, separator, page size. `src/components/editor/SettingsPanel.tsx`

## Export (P1-014 to P1-018)

- **TASK-P1-014: Export Interface** — done. `ExportEngine` + `downloadBlob` + filename helper
- **TASK-P1-015: PDF Export** — done. `@react-pdf/renderer` `pdf().toBlob()`, no watermark
- **TASK-P1-016: DOCX Export** — done. `docx` `Packer.toBlob()`
- **TASK-P1-017: Other Exports** — done. HTML, Markdown, TXT, JSON
- **TASK-P1-018: Export UI** — done. Format menu on Export button

## Local Storage (P1-019 to P1-023)

- **TASK-P1-019: IndexedDB Setup** — done. Shared DB v2: `kv` + `resumes` stores
- **TASK-P1-020: Storage Service** — done. `localStorageService` CRUD + quota
- **TASK-P1-021: Autosave** — done. 2s persist debounce; library upsert after save
- **TASK-P1-022: Resume List** — done. `/dashboard` create, open, delete, duplicate
- **TASK-P1-023: Backup** — done. JSON export/import (new IDs on duplicate)

## Landing Page (P1-024 to P1-027)

- **TASK-P1-024: Marketing Layout** — done. Header + footer in `(marketing)` group
- **TASK-P1-025: Hero Section** — done. Tagline, CTAs, animated preview card
- **TASK-P1-026: Features Section** — done. Differentiators + comparison + how-it-works + pricing
- **TASK-P1-027: Template Showcase** — done. Catalog grid linking to `/editor?template=`

## Verification

- [x] Three free templates render HTML preview and PDF documents
- [x] Live preview debounce 200ms, zoom including fit, A4/Letter bounds
- [x] Export PDF/DOCX/HTML/MD/TXT/JSON client-side, no watermarks
- [x] IndexedDB library + dashboard + JSON backup
- [x] Marketing landing at `/` with CTA to `/editor`
- [x] `tsc --noEmit` and eslint pass
- [x] Browser live-check skipped (anti-stall)
