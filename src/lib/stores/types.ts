import type { StateCreator } from "zustand";

import type { Resume, ResumeSettings, SectionId, StoredResume } from "@/lib/schemas";
import type { EducationEntry } from "@/lib/schemas/education";
import type { ExperienceEntry } from "@/lib/schemas/experience";
import type { PersonalInfo } from "@/lib/schemas/personal-info";
import type { SkillGroup } from "@/lib/schemas/skills";

export type EditorSectionId = "personalInfo" | SectionId;
export type PreviewZoom = 50 | 75 | 100 | 125 | "fit";
export type MobileEditorTab = "form" | "preview";
export type SyncStatus = "local-only" | "syncing" | "synced" | "conflict";
export type SaveStatus = "idle" | "saving" | "saved" | "error";

export interface ResumeDataSlice {
  data: Resume;
  setPersonalInfo: (patch: Partial<PersonalInfo>) => void;
  setSummary: (content: string) => void;
  addExperience: () => void;
  updateExperience: (id: string, patch: Partial<ExperienceEntry>) => void;
  removeExperience: (id: string) => void;
  moveExperience: (from: number, to: number) => void;
  addEducation: () => void;
  updateEducation: (id: string, patch: Partial<EducationEntry>) => void;
  removeEducation: (id: string) => void;
  moveEducation: (from: number, to: number) => void;
  addSkillGroup: () => void;
  updateSkillGroup: (id: string, patch: Partial<SkillGroup>) => void;
  removeSkillGroup: (id: string) => void;
  moveSkillGroup: (from: number, to: number) => void;
  setSectionOrder: (order: SectionId[]) => void;
  reorderSections: (from: number, to: number) => void;
}

export interface SettingsSlice {
  settings: ResumeSettings;
  setSettings: (patch: Partial<ResumeSettings>) => void;
}

export interface EditorSlice {
  activeSectionId: EditorSectionId;
  previewZoom: PreviewZoom;
  previewVisible: boolean;
  mobileTab: MobileEditorTab;
  settingsOpen: boolean;
  templatePickerOpen: boolean;
  atsOpen: boolean;
  aiOpen: boolean;
  setActiveSection: (id: EditorSectionId) => void;
  setPreviewZoom: (zoom: PreviewZoom) => void;
  setPreviewVisible: (visible: boolean) => void;
  togglePreviewPanel: () => void;
  setMobileTab: (tab: MobileEditorTab) => void;
  setSettingsOpen: (open: boolean) => void;
  setTemplatePickerOpen: (open: boolean) => void;
  setAtsOpen: (open: boolean) => void;
  setAiOpen: (open: boolean) => void;
}

export interface LibrarySlice {
  resumeId: string;
  title: string;
  createdAt: string;
  version: number;
  syncStatus: SyncStatus;
  setTitle: (title: string) => void;
  setSyncStatus: (status: SyncStatus) => void;
  loadStoredResume: (stored: StoredResume) => void;
  startNewResume: () => void;
}

export interface SaveSlice {
  saveStatus: SaveStatus;
  saveError: string | null;
  _hasHydrated: boolean;
  markSaving: () => void;
  markSaved: () => void;
  markError: (message: string) => void;
  setHasHydrated: (value: boolean) => void;
  reset: () => void;
}

export type ResumeStore = ResumeDataSlice &
  SettingsSlice &
  EditorSlice &
  LibrarySlice &
  SaveSlice;

export type ResumeSlice<T> = StateCreator<
  ResumeStore,
  [
    ["zustand/devtools", never],
    ["zustand/persist", unknown],
    ["zustand/immer", never],
  ],
  [],
  T
>;
