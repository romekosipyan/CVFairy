# ADR-004: State Management

**Status:** accepted
**Date:** 2026-09-01
**Relates to:** [[REQ-001-resume-editor]], [[REQ-004-local-storage]]

## Context

The resume editor needs state management for:
- Resume data (form fields, sections, entries)
- Editor UI state (active section, panel visibility, zoom level)
- Settings (template, colors, fonts)
- Save status (saved, saving, unsaved)

## Decision

Use **Zustand + Immer** for client state, with persistence middleware for IndexedDB.

Store architecture uses slices:

```typescript
// Main resume store (composed from slices)
const useResumeStore = create<ResumeStore>()(
  immer(
    persist(
      (...args) => ({
        ...createResumeDataSlice(...args),   // Resume content
        ...createSettingsSlice(...args),       // Template settings
        ...createEditorSlice(...args),         // UI state (not persisted)
        ...createSaveSlice(...args),           // Save status
      }),
      {
        name: 'cvfairy-resume',
        storage: indexedDBStorage,
        partialize: (state) => ({
          // Only persist resume data and settings, not UI state
          resumeData: state.resumeData,
          settings: state.settings,
        }),
      }
    )
  )
);
```

## Consequences

**Positive:**
- Zustand is lightweight (~1KB) and works well with Next.js
- Immer enables intuitive immutable updates (`state.data.name = 'John'`)
- Persistence middleware handles IndexedDB save/load automatically
- Selectors prevent unnecessary re-renders
- No providers needed (unlike Redux or Context)

**Negative:**
- Must be careful with SSR hydration (Zustand stores are client-side)
- Immer adds ~6KB to bundle
- Custom storage adapter needed for IndexedDB (idb library)
