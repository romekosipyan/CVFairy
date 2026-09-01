"use client";

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import { emptyResume, Resume, ResumeSettings } from "@/lib/schemas";
import { localStorageService } from "@/lib/storage/local-storage-service";

import { createEditorSlice } from "./slices/editor-slice";
import { createLibrarySlice } from "./slices/library-slice";
import { createResumeDataSlice } from "./slices/resume-data-slice";
import { createSaveSlice } from "./slices/save-slice";
import { createSettingsSlice } from "./slices/settings-slice";
import {
  bindAfterSave,
  bindSaveEvents,
  createResumePersistStorage,
} from "./storage-adapter";
import type { ResumeStore } from "./types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readString(value: unknown, fallback: string): string {
  return typeof value === "string" && value.length > 0 ? value : fallback;
}

function readSyncStatus(
  value: unknown,
  fallback: ResumeStore["syncStatus"],
): ResumeStore["syncStatus"] {
  if (
    value === "local-only" ||
    value === "syncing" ||
    value === "synced" ||
    value === "conflict"
  ) {
    return value;
  }
  return fallback;
}

function mergePersistedResume(
  persisted: unknown,
  current: ResumeStore,
): ResumeStore {
  const blob = isRecord(persisted) ? persisted : {};
  const data = Resume.safeParse(blob.data);
  const settings = ResumeSettings.safeParse(blob.settings);
  const valid = data.success && settings.success;

  return {
    ...current,
    data: data.success ? data.data : emptyResume(),
    settings: settings.success ? settings.data : current.settings,
    resumeId: readString(blob.resumeId, current.resumeId),
    title: readString(blob.title, current.title),
    createdAt: readString(blob.createdAt, current.createdAt),
    version: typeof blob.version === "number" && blob.version >= 1 ? blob.version : current.version,
    syncStatus: readSyncStatus(blob.syncStatus, current.syncStatus),
    saveStatus: valid ? current.saveStatus : "error",
    saveError: valid ? current.saveError : "Could not restore the saved resume",
  };
}

const persistStorage = createResumePersistStorage();

export const useResumeStore = create<ResumeStore>()(
  devtools(
    persist(
      immer((...args) => ({
        ...createResumeDataSlice(...args),
        ...createSettingsSlice(...args),
        ...createEditorSlice(...args),
        ...createLibrarySlice(...args),
        ...createSaveSlice(...args),
      })),
      {
        name: "cvfairy-resume",
        storage: persistStorage,
        skipHydration: true,
        partialize: (state) => ({
          data: state.data,
          settings: state.settings,
          resumeId: state.resumeId,
          title: state.title,
          createdAt: state.createdAt,
          version: state.version,
          syncStatus: state.syncStatus,
        }),
        merge: (persisted, current) => mergePersistedResume(persisted, current),
        onRehydrateStorage: () => (state, error) => {
          if (error) {
            state?.markError("Could not restore the saved resume");
            state?.setHasHydrated(true);
            return;
          }
          state?.setHasHydrated(true);
        },
        version: 2,
      },
    ),
    { name: "ResumeStore", enabled: process.env.NODE_ENV === "development" },
  ),
);

bindSaveEvents({
  onSaving: () => {
    useResumeStore.getState().markSaving();
  },
  onSaved: () => {
    useResumeStore.getState().markSaved();
  },
  onError: (message) => {
    useResumeStore.getState().markError(message);
  },
});

bindAfterSave(() => {
  const state = useResumeStore.getState();
  void localStorageService
    .saveResume({
      id: state.resumeId,
      title: state.title,
      data: state.data,
      settings: state.settings,
      createdAt: state.createdAt,
      updatedAt: new Date().toISOString(),
      version: state.version,
      syncStatus: state.syncStatus,
    })
    .catch((error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Failed to save resume library";
      useResumeStore.getState().markError(message);
    });
});

export function resetAllStores(): void {
  useResumeStore.getState().reset();
}
