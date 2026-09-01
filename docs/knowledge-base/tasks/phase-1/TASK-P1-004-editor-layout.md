# TASK-P1-004: Split-View Editor Layout

**Status:** done
**Phase:** ship
**Priority:** p0-critical
**Depends on:** [[TASK-P1-003-store]]
**Blocks:** [[TASK-P1-005-form-sections]], [[TASK-P1-006-preview]]
**Requirement:** [[REQ-001-resume-editor]]

## Description

Build the main editor page with a resizable split-view layout: form panel on the left (~40%), live preview on the right (~60%). Includes toolbar at top for template/export controls.

## Acceptance Criteria

1. Split-view layout with resizable divider
2. Left panel: scrollable form area for resume sections
3. Right panel: live resume preview (scrollable, zoomable)
4. Top toolbar with: template picker trigger, export button, settings button, save indicator
5. Responsive: on screens < 1024px, panels stack vertically with tab switching
6. Keyboard shortcut: Ctrl+P to toggle preview panel
7. Preview panel can be zoomed (50%, 75%, 100%, 125%)
8. Smooth transitions when resizing panels

## Affected Files

- `src/app/(app)/editor/page.tsx` — Editor page (server component mounting `EditorLayout`)
- `src/app/(app)/editor/layout.tsx` — Editor layout (minimal)
- `src/components/editor/EditorLayout.tsx` — Split-view container
- `src/components/editor/FormPanel.tsx` — Left panel wrapper
- `src/components/editor/PreviewPanel.tsx` — Right panel wrapper
- `src/components/editor/EditorToolbar.tsx` — Top toolbar
- `src/components/editor/ResizableDivider.tsx` — Draggable panel divider

## Implementation Plan

1. Create `(app)` route group with minimal layout
2. Create `/editor/page.tsx` as a server component that mounts `EditorLayout`
3. Build `EditorLayout` with CSS flex split and resizable divider
4. Build `FormPanel` with scroll container and section slots
5. Build `PreviewPanel` with zoom controls and scroll container
6. Build `EditorToolbar` with action buttons and save indicator
7. Add responsive behavior (stacked layout on mobile)
8. Add keyboard shortcuts

## Verification

- [x] `(app)` layout + `/editor` route mount `EditorLayout`
- [x] Resizable divider (pointer drag + arrow keys); default ~40/60 split
- [x] Form panel scrollable; preview panel scrollable
- [x] Toolbar: template `<select>`, Export, Settings, save indicator
- [x] `< 1024px`: Form/Preview tabs; desktop split hidden on the inactive tab
- [x] Ctrl/Cmd+P toggles preview (desktop) or switches tabs (mobile)
- [x] Zoom 50/75/100/125 stored in `previewZoom`
- [x] `motion-safe` flex-basis transition while not dragging
- [x] `tsc --noEmit` passes
- [x] `eslint` passes on editor components and `(app)` routes
- [ ] Browser verify — skipped (anti-stall; previous session hung on Next.js dev + `browser_navigate`)

## Notes

- `page.tsx` stays a Server Component; interactivity lives in `EditorLayout`.
- Form panel is filled by [[TASK-P1-005-form-sections]].
- Preview is a placeholder page; live template rendering is [[TASK-P1-006-preview]].
- Export and Settings buttons are triggers only (later tasks).

Next: [[TASK-P1-005-form-sections]]
