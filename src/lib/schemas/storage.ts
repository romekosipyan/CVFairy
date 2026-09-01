import { z } from "zod";

import { Resume } from "./resume";
import { ResumeSettings } from "./settings";

export const SYNC_STATUSES = [
  "local-only",
  "syncing",
  "synced",
  "conflict",
] as const;

/** IndexedDB / backup envelope around a resume document. */
export const StoredResume = z.object({
  id: z.string().min(1, { error: "Resume id is required" }),
  title: z.string().default("Untitled resume"),
  data: Resume.default(() => Resume.parse({})),
  settings: ResumeSettings.default(() => ResumeSettings.parse({})),
  createdAt: z.iso.datetime({ error: "createdAt must be an ISO datetime" }),
  updatedAt: z.iso.datetime({ error: "updatedAt must be an ISO datetime" }),
  syncedAt: z.iso.datetime().optional(),
  version: z.int().min(1).default(1),
  syncStatus: z.enum(SYNC_STATUSES).default("local-only"),
});

export type StoredResume = z.infer<typeof StoredResume>;
