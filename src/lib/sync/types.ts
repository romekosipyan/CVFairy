import { z } from "zod";

import { Resume, ResumeSettings, StoredResume } from "@/lib/schemas";
import type { CloudResumeRow } from "@/lib/db/schema";

export const SyncResumeInput = StoredResume.pick({
  id: true,
  title: true,
  data: true,
  settings: true,
  version: true,
  createdAt: true,
  updatedAt: true,
});

export type SyncResumeInput = z.infer<typeof SyncResumeInput>;

export function parseCloudRow(row: CloudResumeRow): StoredResume | null {
  const data = Resume.safeParse(row.data);
  const settings = ResumeSettings.safeParse(row.settings);
  if (!data.success || !settings.success) {
    return null;
  }
  const parsed = StoredResume.safeParse({
    id: row.id,
    title: row.title,
    data: data.data,
    settings: settings.data,
    version: row.version,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    syncedAt: row.updatedAt,
    syncStatus: "synced",
  });
  return parsed.success ? parsed.data : null;
}
