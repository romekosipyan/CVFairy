import { z } from "zod";

import { Education } from "./education";
import { Experience } from "./experience";
import { PersonalInfo } from "./personal-info";
import { Skills } from "./skills";
import { Summary } from "./summary";

/** Reorderable body sections. Personal info is always first and omitted here. */
export const SectionId = z.enum([
  "summary",
  "experience",
  "education",
  "skills",
]);

export type SectionId = z.infer<typeof SectionId>;

export const DEFAULT_SECTION_ORDER: SectionId[] = [
  "summary",
  "experience",
  "education",
  "skills",
];

/** Canonical resume document. Settings live on StoredResume, not here. */
export const Resume = z.object({
  personalInfo: PersonalInfo.default(() => PersonalInfo.parse({})),
  summary: Summary.default(() => Summary.parse({})),
  experience: Experience.default(() => Experience.parse({})),
  education: Education.default(() => Education.parse({})),
  skills: Skills.default(() => Skills.parse({})),
  sectionOrder: z.array(SectionId).default(DEFAULT_SECTION_ORDER),
});

export type Resume = z.infer<typeof Resume>;

/** Empty but valid resume for a new editor session. */
export function emptyResume(): Resume {
  return Resume.parse({});
}
