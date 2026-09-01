"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";

import { pushCloudResume } from "@/lib/sync/client";
import { localStorageService } from "@/lib/storage/local-storage-service";
import { useResumeStore } from "@/lib/stores/resume-store";

export function useCloudSync(): void {
  const { status } = useSession();
  const saveStatus = useResumeStore((state) => state.saveStatus);
  const lastPushed = useRef("");

  useEffect(() => {
    if (status !== "authenticated" || saveStatus !== "saved") {
      return;
    }
    const state = useResumeStore.getState();
    const signature = JSON.stringify({
      id: state.resumeId,
      title: state.title,
      data: state.data,
      settings: state.settings,
      version: state.version,
    });
    if (signature === lastPushed.current) {
      return;
    }
    lastPushed.current = signature;
    void pushCloudResume({
      id: state.resumeId,
      title: state.title,
      data: state.data,
      settings: state.settings,
      version: state.version,
      createdAt: state.createdAt,
      updatedAt: new Date().toISOString(),
    })
      .then(async (result) => {
        useResumeStore.setState({
          version: result.resume.version,
          syncStatus: result.status === "conflict" ? "conflict" : "synced",
        });
        await localStorageService.saveResume({
          ...result.resume,
          id: state.resumeId,
          title: state.title,
          data: state.data,
          settings: state.settings,
          createdAt: state.createdAt,
          syncStatus: result.status === "conflict" ? "conflict" : "synced",
        });
      })
      .catch(() => {
        useResumeStore.setState({ syncStatus: "local-only" });
      });
  }, [saveStatus, status]);
}
