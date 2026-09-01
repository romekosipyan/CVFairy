import { defaultResume, defaultSettings, createResumeMeta } from "../defaults";
import type { LibrarySlice, ResumeSlice } from "../types";

export const createLibrarySlice: ResumeSlice<LibrarySlice> = (set) => {
  const meta = createResumeMeta();
  return {
    resumeId: meta.resumeId,
    title: meta.title,
    createdAt: meta.createdAt,
    version: 1,
    syncStatus: "local-only",
    setTitle: (title) =>
      set((state) => {
        state.title = title.trim() || "Untitled resume";
      }),
    setSyncStatus: (status) =>
      set((state) => {
        state.syncStatus = status;
      }),
    loadStoredResume: (stored) =>
      set((state) => {
        state.resumeId = stored.id;
        state.title = stored.title;
        state.createdAt = stored.createdAt;
        state.version = stored.version;
        state.syncStatus = stored.syncStatus;
        state.data = stored.data;
        state.settings = stored.settings;
        state.activeSectionId = "personalInfo";
        state.saveStatus = "saved";
        state.saveError = null;
      }),
    startNewResume: () =>
      set((state) => {
        const next = createResumeMeta();
        state.resumeId = next.resumeId;
        state.title = next.title;
        state.createdAt = next.createdAt;
        state.version = 1;
        state.syncStatus = "local-only";
        state.data = defaultResume;
        state.settings = defaultSettings;
        state.activeSectionId = "personalInfo";
        state.saveStatus = "idle";
        state.saveError = null;
      }),
  };
};
