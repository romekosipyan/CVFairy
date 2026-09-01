import type { SyncResumeInput } from "./types";
import type { CloudResumeRow } from "@/lib/db/schema";

export type ConflictDecision = "accept" | "reject";

/** Last-write-wins: higher version wins; equal versions compare updatedAt. */
export function decideWrite(
  incoming: SyncResumeInput,
  existing: CloudResumeRow | undefined,
): ConflictDecision {
  if (!existing) {
    return "accept";
  }
  if (incoming.version < existing.version) {
    return "reject";
  }
  if (incoming.version > existing.version) {
    return "accept";
  }
  return incoming.updatedAt >= existing.updatedAt ? "accept" : "reject";
}
