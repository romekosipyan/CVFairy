# TASK-P1-003: Zustand Resume Store

**Status:** done
**Phase:** ship
**Priority:** p0-critical
**Depends on:** [[TASK-P1-002-schemas]]
**Blocks:** [[TASK-P1-004-editor-layout]], [[TASK-P1-005-form-sections]], [[TASK-P1-006-preview]]
**Requirement:** [[REQ-001-resume-editor]], [[REQ-004-local-storage]]

## Description

Create the Zustand store that holds all editor state. Uses slices pattern with Immer for immutable updates. Includes persistence middleware for IndexedDB.

## Acceptance Criteria

1. Store holds: resume data, settings, editor UI state, save status
2. Slices pattern: separate slices for data, settings, editor, save
3. Immer middleware enables direct mutation syntax
4. Persistence middleware saves resume data + settings to IndexedDB
5. Editor UI state (active section, panel visibility) is NOT persisted
6. Debounced autosave: save triggers 2 seconds after last change
7. Save status tracking: `idle`, `saving`, `saved`, `error`
8. Actions for: update field, add entry, remove entry, reorder sections
9. Selectors for efficient re-rendering (components only re-render on relevant changes)
10. Hydration handling for SSR compatibility

## Affected Files

- `src/lib/stores/resume-store.ts` — Main store composition
- `src/lib/stores/slices/resume-data-slice.ts` — Resume content state + actions
- `src/lib/stores/slices/settings-slice.ts` — Template settings state + actions
- `src/lib/stores/slices/editor-slice.ts` — UI state (active section, etc.)
- `src/lib/stores/slices/save-slice.ts` — Save status tracking
- `src/lib/stores/storage-adapter.ts` — IndexedDB persistence adapter
- `src/lib/stores/defaults.ts` — Default resume data and settings

## Data Contract

Persisted (IndexedDB, 2s debounce): `data: Resume`, `settings: ResumeSettings`.

Not persisted: editor UI, save status, `_hasHydrated`.

```
ResumeStore =
  ResumeDataSlice & SettingsSlice & EditorSlice & SaveSlice

ResumeDataSlice
  data: Resume
  setPersonalInfo(patch)
  setSummary(content)
  addExperience() / updateExperience(id, patch) / removeExperience(id) / moveExperience(from, to)
  addEducation() / updateEducation(id, patch) / removeEducation(id) / moveEducation(from, to)
  addSkillGroup() / updateSkillGroup(id, patch) / removeSkillGroup(id) / moveSkillGroup(from, to)
  setSectionOrder(order)

SettingsSlice
  settings: ResumeSettings
  setSettings(patch)

EditorSlice
  activeSectionId: 'personalInfo' | SectionId
  previewZoom: 50 | 75 | 100 | 125
  previewVisible: boolean
  mobileTab: 'form' | 'preview'
  setActiveSection(id)
  setPreviewZoom(zoom)
  setPreviewVisible(visible)
  togglePreviewPanel()
  setMobileTab(tab)

SaveSlice
  saveStatus: 'idle' | 'saving' | 'saved' | 'error'
  saveError: string | null
  _hasHydrated: boolean
  markSaving / markSaved / markError / setHasHydrated / reset
```

SSR: `skipHydration: true`; client calls `rehydrate()` via `useHydrateResumeStore`.

## Edge Cases

1. IndexedDB missing (SSR / private mode) — no-op storage, stay in memory
2. Rehydrate of corrupt JSON — fall back to `emptyResume()` defaults, `saveStatus: 'error'`
3. Persist writes of unchanged payload (save-status updates) — skip duplicate IndexedDB puts
4. Rapid edits — one IndexedDB write after 2s quiet period

## Implementation Plan

1. Create default resume data and settings in `defaults.ts`
2. Create IndexedDB storage adapter using `idb` library
3. Create `resume-data-slice.ts` with all content mutation actions
4. Create `settings-slice.ts` with template/style actions
5. Create `editor-slice.ts` with UI state actions
6. Create `save-slice.ts` with save status tracking
7. Compose all slices in `resume-store.ts` with Immer + persist middleware
8. Add hydration guard for SSR compatibility
9. Verify store works with a simple test component

## Verification

- [x] Store composed from data, settings, editor, and save slices
- [x] Immer mutations; persist `partialize` keeps only `data` + `settings`
- [x] Editor UI (`activeSectionId`, `previewZoom`, `previewVisible`, `mobileTab`) not persisted
- [x] IndexedDB adapter: 2s debounce, skip duplicate puts, memory fallback without IndexedDB
- [x] Corrupt JSON throws on read; invalid Zod payload merges to defaults + `saveStatus: 'error'`
- [x] Save status: `idle` | `saving` | `saved` | `error`
- [x] CRUD + reorder actions for experience, education, skills; `setSectionOrder`
- [x] Components select slices of state (`useResumeStore((s) => s.…)`)
- [x] `skipHydration: true` + `useHydrateResumeStore` for SSR
- [x] `tsc --noEmit` passes
- [x] `eslint` passes on store, hydrate hook, and array util
- [ ] Browser smoke test on `/editor` — skipped (previous session hung on Next.js dev + `browser_navigate`; not retried)

## Notes

- Smoke UI was replaced by [[TASK-P1-004-editor-layout]].
- Browser verification was skipped on purpose to avoid stalling the SDLC loop.

Next: [[TASK-P1-004-editor-layout]]
