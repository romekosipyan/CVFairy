# TASK-P1-008: Template Registry and Rendering System

**Status:** done
**Phase:** ship
**Priority:** p0-critical
**Depends on:** [[TASK-P1-006-preview]]
**Blocks:** [[TASK-P1-009-classic-template]], [[TASK-P1-010-modern-template]], [[TASK-P1-011-minimal-template]]
**Requirement:** [[REQ-002-templates]]

## Description

Build the template system: a registry that maps template IDs to render functions, a shared configuration layer, and the rendering pipeline that both preview and PDF export use.

## Acceptance Criteria

1. Template registry exports all available templates with metadata
2. Each template has: id, name, description, thumbnail, tier, columns, render, renderPdf
3. Template render functions accept (resume, settings) and return React elements
4. Templates share a common config layer for derived values (computed spacing, font sizes, etc.)
5. Template switching preserves all resume data
6. Template thumbnails are static images (pre-rendered)

## Affected Files

- `src/templates/registry.ts` — Template registry
- `src/templates/types.ts` — TemplateDefinition interface
- `src/templates/shared/config.ts` — Shared template configuration utilities
- `src/templates/shared/pdf-primitives.tsx` — Reusable @react-pdf/renderer primitives

## Implementation Plan

1. Define `TemplateDefinition` interface in `types.ts`
2. Create shared config utilities (font size calculator, spacing calculator, color utilities)
3. Create PDF primitives (reusable View, Text, Section components for react-pdf)
4. Create `registry.ts` that exports template map and lookup functions
5. Integrate registry with `ResumePreview` component (preview uses render function)
6. Integrate registry with export engine (PDF export uses renderPdf function)

## Verification

- [x] `TemplateDefinition` in `src/templates/types.ts`
- [x] Registry + catalog: Classic, Modern, Minimal
- [x] Shared `deriveTemplateConfig` for fonts, spacing, page size
- [x] Shared HTML sections and PDF primitives
- [x] Static SVG thumbnails in `public/templates/`
- [x] Template switch only changes `settings.templateId` (data preserved)
- [x] `tsc --noEmit` and eslint pass

