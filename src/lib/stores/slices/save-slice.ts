import { createResumeMeta, defaultResume, defaultSettings } from "../defaults";
import type { ResumeSlice, SaveSlice } from "../types";

export const createSaveSlice: ResumeSlice<SaveSlice> = (set) => ({
  saveStatus: "idle",
  saveError: null,
  _hasHydrated: false,
  markSaving: () =>
    set((state) => {
      state.saveStatus = "saving";
      state.saveError = null;
    }),
  markSaved: () =>
    set((state) => {
      state.saveStatus = "saved";
      state.saveError = null;
    }),
  markError: (message) =>
    set((state) => {
      state.saveStatus = "error";
      state.saveError = message;
    }),
  setHasHydrated: (value) =>
    set((state) => {
      state._hasHydrated = value;
    }),
  reset: () =>
    set((state) => {
      state.data = defaultResume;
      state.settings = defaultSettings;
      state.activeSectionId = "personalInfo";
      state.previewZoom = 100;
      state.previewVisible = true;
      state.mobileTab = "form";
      state.settingsOpen = false;
      state.templatePickerOpen = false;
      state.atsOpen = false;
      state.aiOpen = false;
      const meta = createResumeMeta();
      state.resumeId = meta.resumeId;
      state.title = meta.title;
      state.createdAt = meta.createdAt;
      state.version = 1;
      state.syncStatus = "local-only";
      state.saveStatus = "idle";
      state.saveError = null;
    }),
});
