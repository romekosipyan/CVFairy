import { z } from "zod";

/** Accepts a real URL or an empty draft string. */
const DraftUrl = z.union([
  z.url({ error: "Enter a valid URL" }),
  z.literal(""),
]);

/** Accepts a valid email or an empty draft string. */
const DraftEmail = z.union([
  z.email({ error: "Enter a valid email" }),
  z.literal(""),
]);

/** Contact block shown at the top of every resume. Always present; not reorderable. */
export const PersonalInfo = z.object({
  fullName: z.string().default(""),
  email: DraftEmail.default(""),
  phone: z.string().default(""),
  location: z.string().default(""),
  linkedin: DraftUrl.default(""),
  website: DraftUrl.default(""),
  photoUrl: z.string().default(""),
});

export type PersonalInfo = z.infer<typeof PersonalInfo>;
