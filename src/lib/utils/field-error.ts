import type { z } from "zod";

export function fieldError(schema: z.ZodType, value: unknown): string | null {
  const result = schema.safeParse(value);
  if (result.success) {
    return null;
  }
  return result.error.issues[0]?.message ?? "Invalid value";
}
