import { z } from "zod";

export const AIAction = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("generate-bullets"),
    jobTitle: z.string().min(1),
    description: z.string().min(1),
    count: z.number().int().min(3).max(5).optional(),
  }),
  z.object({
    type: z.literal("improve-bullet"),
    original: z.string().min(1),
    context: z.string().optional(),
  }),
  z.object({
    type: z.literal("write-summary"),
    resumeText: z.string().min(1),
    targetRole: z.string().optional(),
  }),
  z.object({
    type: z.literal("suggest-skills"),
    jobTitle: z.string().optional(),
    jobDescription: z.string().optional(),
  }),
  z.object({
    type: z.literal("tailor-resume"),
    resumeText: z.string().min(1),
    jobDescription: z.string().min(1),
  }),
]);

export type AIAction = z.infer<typeof AIAction>;

const FACT_RULE =
  "Never invent employers, dates, metrics, or skills the user did not provide. If information is missing, say so.";

export function buildPrompt(action: AIAction): { system: string; user: string } {
  if (action.type === "generate-bullets") {
    return {
      system: `You write resume bullets. ${FACT_RULE} Output ${action.count ?? 4} bullets, one per line, starting with a strong verb.`,
      user: `Job title: ${action.jobTitle}\nWhat they did: ${action.description}`,
    };
  }
  if (action.type === "improve-bullet") {
    return {
      system: `Rewrite one resume bullet to be stronger and quantified only if numbers are already present. ${FACT_RULE} Return only the rewritten bullet.`,
      user: `Original: ${action.original}\nContext: ${action.context ?? ""}`,
    };
  }
  if (action.type === "write-summary") {
    return {
      system: `Write a 3-4 sentence professional summary from the resume text only. ${FACT_RULE}`,
      user: `Target role: ${action.targetRole ?? "not specified"}\nResume:\n${action.resumeText}`,
    };
  }
  if (action.type === "suggest-skills") {
    return {
      system: `Suggest 8-12 skills as a comma-separated list. Prefer skills implied by the input. ${FACT_RULE}`,
      user: `Job title: ${action.jobTitle ?? ""}\nJob description: ${action.jobDescription ?? ""}`,
    };
  }
  return {
    system: `List the 5 highest-impact edits to tailor this resume to the job. ${FACT_RULE} Use a numbered list.`,
    user: `Job description:\n${action.jobDescription}\n\nResume:\n${action.resumeText}`,
  };
}
