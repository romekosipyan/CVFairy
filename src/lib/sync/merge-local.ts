import { localStorageService } from "@/lib/storage/local-storage-service";
import { pullCloudResumes } from "@/lib/sync/client";

import type { StoredResume } from "@/lib/schemas";

function cloudWins(local: StoredResume, cloud: StoredResume): boolean {
  if (cloud.version !== local.version) {
    return cloud.version > local.version;
  }
  return cloud.updatedAt > local.updatedAt;
}

export async function pullAndMergeCloudResumes(): Promise<string[]> {
  const remote = await pullCloudResumes();
  const overwrittenIds: string[] = [];
  for (const cloud of remote) {
    const local = await localStorageService.getResume(cloud.id);
    if (!local || cloudWins(local, cloud)) {
      await localStorageService.saveResume({
        ...cloud,
        syncStatus: "synced",
      });
      if (local) {
        overwrittenIds.push(cloud.id);
      }
    }
  }
  return overwrittenIds;
}
