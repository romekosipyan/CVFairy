import { SectionId } from "@/lib/schemas";
import { moveItem } from "@/lib/utils/array";

import {
  createEducationEntry,
  createExperienceEntry,
  createSkillGroup,
  defaultResume,
} from "../defaults";
import type { ResumeDataSlice, ResumeSlice } from "../types";

export const createResumeDataSlice: ResumeSlice<ResumeDataSlice> = (set) => ({
  data: defaultResume,

  setPersonalInfo: (patch) =>
    set((state) => {
      Object.assign(state.data.personalInfo, patch);
    }),

  setSummary: (content) =>
    set((state) => {
      state.data.summary.content = content;
    }),

  addExperience: () =>
    set((state) => {
      state.data.experience.entries.push(createExperienceEntry());
    }),

  updateExperience: (id, patch) =>
    set((state) => {
      const entry = state.data.experience.entries.find((item) => item.id === id);
      if (entry) {
        Object.assign(entry, patch);
      }
    }),

  removeExperience: (id) =>
    set((state) => {
      state.data.experience.entries = state.data.experience.entries.filter(
        (item) => item.id !== id,
      );
    }),

  moveExperience: (from, to) =>
    set((state) => {
      state.data.experience.entries = moveItem(
        state.data.experience.entries,
        from,
        to,
      );
    }),

  addEducation: () =>
    set((state) => {
      state.data.education.entries.push(createEducationEntry());
    }),

  updateEducation: (id, patch) =>
    set((state) => {
      const entry = state.data.education.entries.find((item) => item.id === id);
      if (entry) {
        Object.assign(entry, patch);
      }
    }),

  removeEducation: (id) =>
    set((state) => {
      state.data.education.entries = state.data.education.entries.filter(
        (item) => item.id !== id,
      );
    }),

  moveEducation: (from, to) =>
    set((state) => {
      state.data.education.entries = moveItem(
        state.data.education.entries,
        from,
        to,
      );
    }),

  addSkillGroup: () =>
    set((state) => {
      state.data.skills.groups.push(createSkillGroup());
    }),

  updateSkillGroup: (id, patch) =>
    set((state) => {
      const group = state.data.skills.groups.find((item) => item.id === id);
      if (group) {
        Object.assign(group, patch);
      }
    }),

  removeSkillGroup: (id) =>
    set((state) => {
      state.data.skills.groups = state.data.skills.groups.filter(
        (item) => item.id !== id,
      );
    }),

  moveSkillGroup: (from, to) =>
    set((state) => {
      state.data.skills.groups = moveItem(state.data.skills.groups, from, to);
    }),

  setSectionOrder: (order) =>
    set((state) => {
      const parsed = SectionId.array().safeParse(order);
      if (parsed.success) {
        state.data.sectionOrder = parsed.data;
      }
    }),

  reorderSections: (from, to) =>
    set((state) => {
      state.data.sectionOrder = moveItem(state.data.sectionOrder, from, to);
    }),
});
