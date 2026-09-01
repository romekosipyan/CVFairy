"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { CloudSyncBanner } from "@/components/dashboard/CloudSyncBanner";
import { AuthButton } from "@/components/shared/AuthButton";
import { Button } from "@/components/ui/button";
import { downloadResumeBackup, importResumeBackup } from "@/lib/storage/backup";
import { localStorageService } from "@/lib/storage/local-storage-service";
import { useResumeStore } from "@/lib/stores/resume-store";
import { unsyncCloudResume } from "@/lib/sync/client";
import { pullAndMergeCloudResumes } from "@/lib/sync/merge-local";

import type { ReactElement } from "react";
import type { StoredResume } from "@/lib/schemas";
import type { StorageUsage } from "@/lib/storage/local-storage-service";

const SYNC_LABEL: Record<StoredResume["syncStatus"], string> = {
  "local-only": "This device only",
  syncing: "Syncing…",
  synced: "Synced",
  conflict: "Conflict — newer cloud copy kept",
};

export function DashboardView(): ReactElement {
  const router = useRouter();
  const { status: sessionStatus } = useSession();
  const loadStoredResume = useResumeStore((state) => state.loadStoredResume);
  const startNewResume = useResumeStore((state) => state.startNewResume);
  const setSyncStatus = useResumeStore((state) => state.setSyncStatus);
  const currentId = useResumeStore((state) => state.resumeId);
  const [resumes, setResumes] = useState<StoredResume[]>([]);
  const [usage, setUsage] = useState<StorageUsage>({ used: 0, quota: 0 });
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const refresh = useCallback(async () => {
    try {
      const [list, storage] = await Promise.all([
        localStorageService.listResumes(),
        localStorageService.getStorageUsage(),
      ]);
      setResumes(list);
      setUsage(storage);
      setError(null);
    } catch (caught: unknown) {
      setError(caught instanceof Error ? caught.message : "Could not load resumes");
    }
  }, []);

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        let cloudError: string | null = null;
        if (sessionStatus === "authenticated") {
          try {
            const overwritten = await pullAndMergeCloudResumes();
            if (!active) {
              return;
            }
            if (overwritten.includes(currentId)) {
              const stored = await localStorageService.getResume(currentId);
              if (stored) {
                loadStoredResume(stored);
              }
            }
          } catch (caught: unknown) {
            cloudError =
              caught instanceof Error ? caught.message : "Could not sync from the cloud";
          }
        }
        const [list, storage] = await Promise.all([
          localStorageService.listResumes(),
          localStorageService.getStorageUsage(),
        ]);
        if (!active) {
          return;
        }
        setResumes(list);
        setUsage(storage);
        setError(cloudError);
      } catch (caught: unknown) {
        if (!active) {
          return;
        }
        setError(caught instanceof Error ? caught.message : "Could not load resumes");
      }
    })();
    return () => {
      active = false;
    };
  }, [currentId, loadStoredResume, sessionStatus]);

  const quotaRatio = usage.quota > 0 ? usage.used / usage.quota : 0;

  async function openResume(resume: StoredResume): Promise<void> {
    loadStoredResume(resume);
    router.push("/editor");
  }

  async function createResume(): Promise<void> {
    startNewResume();
    router.push("/editor");
  }

  async function removeResume(id: string): Promise<void> {
    try {
      if (sessionStatus === "authenticated") {
        await unsyncCloudResume(id);
      }
      await localStorageService.deleteResume(id);
      if (id === currentId) {
        startNewResume();
      }
      await refresh();
    } catch (caught: unknown) {
      setError(caught instanceof Error ? caught.message : "Could not delete resume");
    }
  }

  async function unsyncResume(resume: StoredResume): Promise<void> {
    try {
      await unsyncCloudResume(resume.id);
      await localStorageService.saveResume({ ...resume, syncStatus: "local-only" });
      if (resume.id === currentId) {
        setSyncStatus("local-only");
      }
      await refresh();
    } catch (caught: unknown) {
      setError(caught instanceof Error ? caught.message : "Could not unsync resume");
    }
  }

  async function copyResume(id: string): Promise<void> {
    try {
      await localStorageService.duplicateResume(id);
      await refresh();
    } catch (caught: unknown) {
      setError(caught instanceof Error ? caught.message : "Could not duplicate resume");
    }
  }

  async function onImport(file: File): Promise<void> {
    try {
      const count = await importResumeBackup(file);
      await refresh();
      setError(count === 0 ? "No valid resumes found in that file" : null);
    } catch (caught: unknown) {
      setError(caught instanceof Error ? caught.message : "Import failed");
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">
            <Link href="/" className="hover:underline">
              CVFairy
            </Link>
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">Your resumes</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => void downloadResumeBackup()}>
            Backup JSON
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              fileRef.current?.click();
            }}
          >
            Import
          </Button>
          <Button type="button" size="sm" onClick={() => void createResume()}>
            New resume
          </Button>
          <AuthButton />
        </div>
      </header>
      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            void onImport(file);
          }
          event.target.value = "";
        }}
      />
      {quotaRatio >= 0.8 ? (
        <p role="status" className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm">
          Browser storage is {Math.round(quotaRatio * 100)}% full. Export a JSON backup before you hit the limit.
        </p>
      ) : null}
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
      <CloudSyncBanner resumes={resumes} onDone={() => void refresh()} />
      {resumes.length === 0 ? (
        <p className="text-muted-foreground">
          No saved resumes yet. Create one in the editor — it stays on this device.
        </p>
      ) : (
        <ul className="grid gap-3">
          {resumes.map((resume) => (
            <li
              key={resume.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border p-4"
            >
              <div>
                <p className="font-medium">{resume.title}</p>
                <p className="text-xs text-muted-foreground">
                  Updated {new Date(resume.updatedAt).toLocaleString()} ·{" "}
                  {SYNC_LABEL[resume.syncStatus]}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button type="button" size="sm" onClick={() => void openResume(resume)}>
                  Open
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => void copyResume(resume.id)}
                >
                  Duplicate
                </Button>
                {sessionStatus === "authenticated" && resume.syncStatus === "synced" ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => void unsyncResume(resume)}
                  >
                    Unsync
                  </Button>
                ) : null}
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={() => void removeResume(resume.id)}
                >
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
