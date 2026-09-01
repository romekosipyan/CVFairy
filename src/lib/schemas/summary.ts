import { z } from "zod";

/** Professional summary. Recommended max 500 characters is a UI hint, not a hard cap. */
export const Summary = z.object({
  content: z.string().default(""),
});

export type Summary = z.infer<typeof Summary>;
