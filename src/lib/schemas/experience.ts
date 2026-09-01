import { z } from "zod";

/** One job in the work history. `endDate` is empty when `current` is true. */
export const ExperienceEntry = z.object({
  id: z.string().min(1, { error: "Entry id is required" }),
  title: z.string().default(""),
  company: z.string().default(""),
  location: z.string().default(""),
  startDate: z.string().default(""),
  endDate: z.string().default(""),
  current: z.boolean().default(false),
  bullets: z.array(z.string()).default([]),
});

export type ExperienceEntry = z.infer<typeof ExperienceEntry>;

export const Experience = z.object({
  entries: z.array(ExperienceEntry).default([]),
});

export type Experience = z.infer<typeof Experience>;
