"use client";

import { useEffect } from "react";

import { useCloudSync } from "@/lib/hooks/use-cloud-sync";
import { useHydrateResumeStore } from "@/lib/hooks/use-hydrate-resume-store";
import { usePreviewShortcut } from "@/lib/hooks/use-preview-shortcut";
import { ResumeSettings } from "@/lib/schemas";
import { useResumeStore } from "@/lib/stores/resume-store";

import { AIPanel } from "./AIPanel";
import { ATSPanel } from "./ATSPanel";
import { EditorSplitView } from "./EditorSplitView";
import { EditorToolbar } from "./EditorToolbar";
import { SettingsPanel } from "./SettingsPanel";
import { TemplatePicker } from "./TemplatePicker";

import type { ReactElement } from "react";

export function EditorLayout(): ReactElement {
  const hydrated = useHydrateResumeStore();
  const setSettings = useResumeStore((state) => state.setSettings);
  usePreviewShortcut();
  useCloudSync();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const parsed = ResumeSettings.shape.templateId.safeParse(params.get("template"));
    if (parsed.success) {
      setSettings({ templateId: parsed.data });
    }
  }, [setSettings]);

  if (!hydrated) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <p className="text-muted-foreground">Restoring your resume…</p>
      </div>
    );
  }

  return (
    <div className="flex h-dvh min-h-0 flex-col">
      <a
        href="#resume-form"
        className="sr-only focus:not-sr-only focus:absolute focus:z-20 focus:bg-background focus:px-3 focus:py-2"
      >
        Skip to form
      </a>
      <EditorToolbar />
      <EditorSplitView />
      <TemplatePicker />
      <SettingsPanel />
      <ATSPanel />
      <AIPanel />
    </div>
  );
}
