import { StoredResume } from "@/lib/schemas";
import { SyncResumeInput } from "@/lib/sync/types";

export async function pullCloudResumes(): Promise<StoredResume[]> {
  const response = await fetch("/api/sync");
  if (response.status === 401) {
    return [];
  }
  if (!response.ok) {
    throw new Error("Could not load cloud resumes");
  }
  const json: unknown = await response.json();
  if (typeof json !== "object" || json === null || !("resumes" in json)) {
    throw new Error("Invalid cloud response");
  }
  const resumes = json.resumes;
  if (!Array.isArray(resumes)) {
    throw new Error("Invalid cloud response");
  }
  return resumes
    .map((item) => StoredResume.safeParse(item))
    .filter((item) => item.success)
    .map((item) => item.data);
}

export async function pushCloudResume(
  resume: SyncResumeInput,
): Promise<{ status: "ok" | "conflict"; resume: StoredResume }> {  const payload = SyncResumeInput.parse(resume);
  const response = await fetch("/api/sync", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resume: payload }),
  });
  const json: unknown = await response.json().catch(() => null);
  const parsed = readSyncResult(json);
  if (response.status === 409 && parsed) {
    return { status: "conflict", resume: parsed };
  }
  if (!response.ok || !parsed) {
    throw new Error(readError(json) ?? "Sync failed");
  }
  return { status: "ok", resume: parsed };
}

export async function pushCloudResumes(resumes: SyncResumeInput[]): Promise<void> {  const response = await fetch("/api/sync", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resumes: resumes.map((item) => SyncResumeInput.parse(item)) }),
  });
  if (!response.ok) {
    const json: unknown = await response.json().catch(() => null);
    throw new Error(readError(json) ?? "Sync failed");
  }
}

export async function unsyncCloudResume(id: string): Promise<void> {
  const response = await fetch(`/api/sync?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  if (!response.ok && response.status !== 404) {
    throw new Error("Could not remove cloud copy");
  }
}

function readError(json: unknown): string | null {
  if (typeof json === "object" && json !== null && "error" in json) {
    const error = json.error;
    return typeof error === "string" ? error : null;
  }
  return null;
}

function readSyncResult(json: unknown): StoredResume | null {
  if (typeof json !== "object" || json === null) {
    return null;
  }
  if ("resume" in json) {
    const parsed = StoredResume.safeParse(json.resume);
    return parsed.success ? parsed.data : null;
  }
  if ("results" in json && Array.isArray(json.results) && json.results[0]) {
    const first: unknown = json.results[0];
    if (typeof first === "object" && first !== null && "resume" in first) {
      const parsed = StoredResume.safeParse(first.resume);
      return parsed.success ? parsed.data : null;
    }
  }
  return null;
}
