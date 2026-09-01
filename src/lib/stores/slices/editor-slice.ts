import type { EditorSlice, ResumeSlice } from "../types";

export const createEditorSlice: ResumeSlice<EditorSlice> = (set) => ({
  activeSectionId: "personalInfo",
  previewZoom: 100,
  previewVisible: true,
  mobileTab: "form",
  settingsOpen: false,
  templatePickerOpen: false,
  atsOpen: false,
  aiOpen: false,
  setActiveSection: (id) =>
    set((state) => {
      state.activeSectionId = id;
    }),
  setPreviewZoom: (zoom) =>
    set((state) => {
      state.previewZoom = zoom;
    }),
  setPreviewVisible: (visible) =>
    set((state) => {
      state.previewVisible = visible;
    }),
  togglePreviewPanel: () =>
    set((state) => {
      state.previewVisible = !state.previewVisible;
    }),
  setMobileTab: (tab) =>
    set((state) => {
      state.mobileTab = tab;
    }),
  setSettingsOpen: (open) =>
    set((state) => {
      state.settingsOpen = open;
    }),
  setTemplatePickerOpen: (open) =>
    set((state) => {
      state.templatePickerOpen = open;
    }),
  setAtsOpen: (open) =>
    set((state) => {
      state.atsOpen = open;
    }),
  setAiOpen: (open) =>
    set((state) => {
      state.aiOpen = open;
    }),
});
