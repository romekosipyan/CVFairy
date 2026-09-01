import { z } from "zod";

/** A labeled cluster of skills, e.g. "Languages" or "Tools". */
export const SkillGroup = z.object({
  id: z.string().min(1, { error: "Group id is required" }),
  category: z.string().default(""),
  skills: z.array(z.string()).default([]),
});

export type SkillGroup = z.infer<typeof SkillGroup>;

export const Skills = z.object({
  groups: z.array(SkillGroup).default([]),
});

export type Skills = z.infer<typeof Skills>;
