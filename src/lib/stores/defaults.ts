import { nanoid } from "nanoid";

import { emptyResume, ResumeSettings } from "@/lib/schemas";
import { EducationEntry } from "@/lib/schemas/education";
import { ExperienceEntry } from "@/lib/schemas/experience";
import { SkillGroup } from "@/lib/schemas/skills";
import type { Resume } from "@/lib/schemas";

export const defaultResume: Resume = emptyResume();
export const defaultSettings: ResumeSettings = ResumeSettings.parse({});

export function createExperienceEntry(): ExperienceEntry {
  return ExperienceEntry.parse({ id: nanoid() });
}

export function createEducationEntry(): EducationEntry {
  return EducationEntry.parse({ id: nanoid() });
}

export function createSkillGroup(): SkillGroup {
  return SkillGroup.parse({ id: nanoid() });
}

export function createResumeMeta(): {
  resumeId: string;
  title: string;
  createdAt: string;
} {
  return {
    resumeId: nanoid(),
    title: "Untitled resume",
    createdAt: new Date().toISOString(),
  };
}
