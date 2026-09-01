"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { localStorageService } from "@/lib/storage/local-storage-service";
import { pushCloudResumes } from "@/lib/sync/client";

import type { ReactElement } from "react";
import type { StoredResume } from "@/lib/schemas";

interface CloudSyncBannerProps {
  resumes: StoredResume[];
  onDone: () => void;
}

export function CloudSyncBanner({ resumes, onDone }: CloudSyncBannerProps): ReactElement | null {
  const { status } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const pending = resumes.filter((item) => item.syncStatus !== "synced");

  if (status !== "authenticated" || pending.length === 0) {
    return null;
  }

  async function upload(): Promise<void> {
    setBusy(true);
    setError(null);
    try {
      await pushCloudResumes(
        pending.map((item) => ({
          id: item.id,
          title: item.title,
          data: item.data,
          settings: item.settings,
          version: item.version,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        })),
      );
      await Promise.all(
        pending.map((item) =>
          localStorageService.saveResume({
            ...item,
            syncStatus: "synced",
            syncedAt: new Date().toISOString(),
          }),
        ),
      );
      onDone();
    } catch (caught: unknown) {
      setError(caught instanceof Error ? caught.message : "Could not sync resumes");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm">
      <p>
        You have {pending.length} local resume{pending.length === 1 ? "" : "s"}. Upload them
        to the cloud for this account?
      </p>
      {error ? <p className="mt-1 text-destructive">{error}</p> : null}
      <div className="mt-2 flex gap-2">
        <Button type="button" size="sm" disabled={busy} onClick={() => void upload()}>
          {busy ? "Uploading…" : "Sync to cloud"}
        </Button>
      </div>
    </div>
  );
}
