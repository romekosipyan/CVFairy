import { z } from "zod";

/** One school or program. */
export const EducationEntry = z.object({
  id: z.string().min(1, { error: "Entry id is required" }),
  degree: z.string().default(""),
  school: z.string().default(""),
  location: z.string().default(""),
  startDate: z.string().default(""),
  endDate: z.string().default(""),
  gpa: z.string().default(""),
  bullets: z.array(z.string()).default([]),
});

export type EducationEntry = z.infer<typeof EducationEntry>;

export const Education = z.object({
  entries: z.array(EducationEntry).default([]),
});

export type Education = z.infer<typeof Education>;
