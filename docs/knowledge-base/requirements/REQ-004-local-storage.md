# REQ-004: Local-First Storage

**Status:** done
**Phase:** 1 (MVP)
**Priority:** p0-critical
**Depends on:** [[REQ-001-resume-editor]]
**Blocks:** [[REQ-007-auth-cloud-sync]]

## Description

Resume data persists in the browser by default (IndexedDB). No account needed. Users can create, edit, and export resumes without ever signing up. This is the privacy and trust advantage over Enhancv (which requires an account to do anything).

## Acceptance Criteria

1. Resume data auto-saves to IndexedDB within 2 seconds of last edit
2. Save status indicator visible to user (Saved / Saving... / Unsaved changes)
3. Multiple resumes can be stored locally (up to browser storage limits)
4. Resume list page shows all locally stored resumes with last-edited timestamp
5. Resumes persist across browser sessions (page refresh, tab close, reopen)
6. User can manually delete a resume from local storage
7. User can duplicate a resume
8. User can export all resumes as a JSON backup file
9. User can import resumes from a JSON backup file
10. No account or login required for any local-only features
11. Clear warning when approaching browser storage limits

## Data Contract

```typescript
interface StoredResume {
  id: string; // UUID
  title: string;
  data: Resume; // Full resume data
  settings: ResumeSettings;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  syncedAt?: string; // Last cloud sync timestamp (if user has account)
  version: number; // For conflict resolution
}

interface LocalStorageService {
  listResumes(): Promise<StoredResume[]>;
  getResume(id: string): Promise<StoredResume | null>;
  saveResume(resume: StoredResume): Promise<void>;
  deleteResume(id: string): Promise<void>;
  duplicateResume(id: string): Promise<StoredResume>;
  exportAll(): Promise<Blob>; // JSON blob
  importAll(blob: Blob): Promise<number>; // Returns count imported
  getStorageUsage(): Promise<{ used: number; quota: number }>;
}
```

## Edge Cases

1. IndexedDB not available (private browsing in some browsers) — fallback to localStorage with size warning
2. Storage quota exceeded — warn user, suggest exporting JSON backup
3. Corrupted data in IndexedDB — graceful recovery, don't crash editor
4. Multiple tabs editing same resume — last-write-wins with warning toast
5. Browser data cleared by user — data is lost (warn in UI about backup)
6. Import with duplicate IDs — generate new IDs, don't overwrite

## Affected Files

- `src/lib/storage/indexed-db.ts` — IndexedDB wrapper using idb library
- `src/lib/storage/local-storage-service.ts` — High-level storage service
- `src/lib/storage/backup.ts` — JSON backup export/import
- `src/lib/stores/resume-store.ts` — Integration with Zustand store
- `src/components/shared/SaveIndicator.tsx` — Save status display
- `src/app/(app)/dashboard/page.tsx` — Resume list with local resumes

## Tasks

- [[TASK-P1-019-indexeddb]] — Set up IndexedDB with idb library
- [[TASK-P1-020-storage-service]] — Implement LocalStorageService
- [[TASK-P1-021-autosave]] — Integrate autosave with Zustand store
- [[TASK-P1-022-resume-list]] — Build resume list/dashboard page
- [[TASK-P1-023-backup]] — Implement JSON backup export/import
