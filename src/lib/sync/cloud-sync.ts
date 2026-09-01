import { and, eq } from "drizzle-orm";

import { cloudResumes } from "@/lib/db/schema";
import { Resume, ResumeSettings } from "@/lib/schemas";

import { decideWrite } from "./conflict-resolver";
import { parseCloudRow, type SyncResumeInput } from "./types";

import type { Database } from "@/lib/db/client";
import type { StoredResume } from "@/lib/schemas";

export async function listCloudResumes(
  db: Database,
  userId: string,
): Promise<StoredResume[]> {
  const rows = await db
    .select()
    .from(cloudResumes)
    .where(eq(cloudResumes.userId, userId))
    .all();
  return rows
    .map((row) => parseCloudRow(row))
    .filter((item): item is StoredResume => item !== null);
}

export async function upsertCloudResume(
  db: Database,
  userId: string,
  incoming: SyncResumeInput,
): Promise<{ status: "ok"; resume: StoredResume } | { status: "conflict"; resume: StoredResume }> {
  const existing = await db
    .select()
    .from(cloudResumes)
    .where(and(eq(cloudResumes.id, incoming.id), eq(cloudResumes.userId, userId)))
    .get();

  if (decideWrite(incoming, existing) === "reject" && existing) {
    const cloud = parseCloudRow(existing);
    if (cloud) {
      return { status: "conflict", resume: { ...cloud, syncStatus: "conflict" } };
    }
  }

  const version = existing ? existing.version + 1 : incoming.version;
  const now = new Date().toISOString();
  await db
    .insert(cloudResumes)
    .values({
      id: incoming.id,
      userId,
      title: incoming.title,
      data: incoming.data,
      settings: incoming.settings,
      version,
      createdAt: incoming.createdAt,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: cloudResumes.id,
      set: {
        title: incoming.title,
        data: incoming.data,
        settings: incoming.settings,
        version,
        updatedAt: now,
      },
    });

  return {
    status: "ok",
    resume: {
      ...incoming,
      data: Resume.parse(incoming.data),
      settings: ResumeSettings.parse(incoming.settings),
      version,
      updatedAt: now,
      syncedAt: now,
      syncStatus: "synced",
    },
  };
}

export async function deleteCloudResume(
  db: Database,
  userId: string,
  id: string,
): Promise<boolean> {
  const result = await db
    .delete(cloudResumes)
    .where(and(eq(cloudResumes.id, id), eq(cloudResumes.userId, userId)))
    .returning({ id: cloudResumes.id })
    .get();
  return Boolean(result);
}
