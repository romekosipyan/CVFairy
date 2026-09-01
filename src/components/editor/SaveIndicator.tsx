"use client";

import { AlertCircle, Check, LoaderCircle } from "lucide-react";

import { useResumeStore } from "@/lib/stores/resume-store";

import type { ReactElement } from "react";
import type { SaveStatus } from "@/lib/stores/types";

const STATUS_LABEL: Record<SaveStatus, string> = {
  idle: "Waiting to save",
  saving: "Saving",
  saved: "Saved",
  error: "Save failed",
};

export function SaveIndicator(): ReactElement {
  const saveStatus = useResumeStore((state) => state.saveStatus);
  const saveError = useResumeStore((state) => state.saveError);
  const label = saveStatus === "error" && saveError ? saveError : STATUS_LABEL[saveStatus];

  return (
    <p
      role="status"
      aria-live="polite"
      className="flex items-center gap-1.5 text-xs text-muted-foreground"
    >
      <StatusIcon status={saveStatus} />
      <span>{label}</span>
    </p>
  );
}

function StatusIcon({ status }: { status: SaveStatus }): ReactElement {
  if (status === "saving") {
    return (
      <LoaderCircle
        aria-hidden="true"
        className="size-3.5 motion-safe:animate-spin motion-reduce:animate-none"
      />
    );
  }
  if (status === "saved") {
    return <Check aria-hidden="true" className="size-3.5 text-foreground" />;
  }
  if (status === "error") {
    return <AlertCircle aria-hidden="true" className="size-3.5 text-destructive" />;
  }
  return <span aria-hidden="true" className="size-1.5 rounded-full bg-muted-foreground/50" />;
}
