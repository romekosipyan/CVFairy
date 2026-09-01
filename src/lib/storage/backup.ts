import { downloadBlob } from "@/lib/utils/download";

import { localStorageService } from "./local-storage-service";

export async function downloadResumeBackup(): Promise<void> {
  const blob = await localStorageService.exportAll();
  downloadBlob(blob, "cvfairy-resumes-backup.json");
}

export async function importResumeBackup(file: File): Promise<number> {
  return localStorageService.importAll(file);
}
