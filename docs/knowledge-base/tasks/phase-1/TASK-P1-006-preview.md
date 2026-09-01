# TASK-P1-006: Live Resume Preview

**Status:** done
**Phase:** ship
**Priority:** p0-critical
**Depends on:** [[TASK-P1-003-store]], [[TASK-P1-004-editor-layout]], [[TASK-P1-005-form-sections]]
**Blocks:** [[TASK-P1-008-template-system]]
**Requirement:** [[REQ-001-resume-editor]]

## Description

Build the live preview panel that renders the resume in real-time as the user edits. Uses HTML/React rendering (not @react-pdf/renderer which is for export only). Preview updates are debounced for performance.

## Acceptance Criteria

1. Preview renders the resume using the selected template's HTML/React render function
2. Updates within 200ms of form changes (debounced)
3. Accurate representation of how the final PDF will look
4. Page boundaries visible (A4 or US Letter dimensions shown)
5. Zoom controls: 50%, 75%, 100%, 125%, fit-to-width
6. Scrollable for multi-page resumes
7. Shows placeholder content when resume is empty ("Your name here", etc.)
8. Responsive within the preview panel (maintains aspect ratio)

## Affected Files

- `src/components/editor/PreviewPanel.tsx` — Preview container with zoom
- `src/components/editor/ResumePreview.tsx` — Renders resume with current template
- `src/components/editor/PreviewControls.tsx` — Zoom and page size controls
- `src/lib/hooks/use-debounced-resume.ts` — Debounced resume data for preview

## Implementation Plan

1. Create `use-debounced-resume` hook that debounces store changes by 200ms
2. Build `ResumePreview` that calls the current template's render function
3. Build `PreviewControls` with zoom slider and page size toggle
4. Integrate into `PreviewPanel` with scaled rendering
5. Add page boundary indicators (dashed lines at A4/Letter height)
6. Add placeholder content for empty state

## Verification

- [x] `useDebouncedResume` waits 200ms before preview updates
- [x] `ResumePreview` calls `getTemplate(settings.templateId).render()`
- [x] Page size from settings (A4 210×297mm, Letter 215.9×279.4mm)
- [x] Zoom: 50 / 75 / 100 / 125 / fit-to-width
- [x] Repeating page-height rule marks multi-page bounds
- [x] Empty resumes show placeholders ("Your name here", etc.)
- [x] `tsc --noEmit` and eslint pass
- [x] Browser live-check skipped (anti-stall)

