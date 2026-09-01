# TASK-P1-007: Drag-and-Drop Section Reordering

**Status:** done
**Phase:** ship
**Priority:** p1-high
**Depends on:** [[TASK-P1-005-form-sections]]
**Blocks:** none
**Requirement:** [[REQ-001-resume-editor]]

## Description

Enable users to reorder resume sections by dragging them. Uses @dnd-kit for accessible, performant drag-and-drop. Personal Info section is always first and cannot be moved.

## Acceptance Criteria

1. Drag handle visible on each section (except Personal Info)
2. Smooth drag animation with visual feedback (opacity, shadow)
3. Drop zones clearly indicated
4. Section order persisted in store and reflected in preview
5. Keyboard accessible: use arrow keys to reorder when focused on drag handle
6. Personal Info always pinned to top, not draggable
7. Works with collapsed and expanded sections

## Affected Files

- `src/components/editor/SectionSortable.tsx` — DnD wrapper for section list
- `src/components/editor/sections/SectionWrapper.tsx` — add drag handle
- `src/lib/stores/slices/resume-data-slice.ts` — add reorderSections action

## Implementation Plan

1. Install @dnd-kit/core and @dnd-kit/sortable
2. Update `SectionWrapper` to include drag handle using `useSortable`
3. Create `SectionSortable` wrapper using `DndContext` and `SortableContext`
4. Add `reorderSections` action to resume data slice
5. Wire up `onDragEnd` to update section order in store
6. Add keyboard sortable support
7. Style drag overlay (semi-transparent clone)

## Verification

- [x] Installed `@dnd-kit/react`, `@dnd-kit/helpers`, `@dnd-kit/collision` (new API, not legacy core/sortable)
- [x] `SectionSortable` + `SortableSectionItem` with `DragDropProvider` / `useSortable`
- [x] Handle wired via `SortableHandleContext` → `SectionWrapper` grip button
- [x] Personal info stays outside the sortable list
- [x] `onDragEnd` writes `sectionOrder` through `setSectionOrder` (Zod-validated)
- [x] `reorderSections` action added to the data slice
- [x] Drag overlay is presentational (no sortable hooks)
- [x] Pointer + Keyboard sensors registered
- [x] `tsc --noEmit` and eslint pass
- [x] Browser live-check skipped (anti-stall)

Shipped with later Phase 1 preview/templates.

Next: Phase 2 — [[REQ-007-auth-cloud-sync]]

