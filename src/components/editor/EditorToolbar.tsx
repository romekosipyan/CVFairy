"use client";

import Link from "next/link";
import { LayoutGrid, ScanSearch, Settings, Sparkles } from "lucide-react";

import { AuthButton } from "@/components/shared/AuthButton";
import { Button } from "@/components/ui/button";import { Input } from "@/components/ui/input";
import { useResumeStore } from "@/lib/stores/resume-store";
import { listTemplates } from "@/templates/registry";

import { ExportButton } from "./ExportButton";
import { SaveIndicator } from "./SaveIndicator";

import type { ReactElement } from "react";

export function EditorToolbar(): ReactElement {
  const templateId = useResumeStore((state) => state.settings.templateId);
  const title = useResumeStore((state) => state.title);
  const setTitle = useResumeStore((state) => state.setTitle);
  const setTemplatePickerOpen = useResumeStore((state) => state.setTemplatePickerOpen);
  const setSettingsOpen = useResumeStore((state) => state.setSettingsOpen);
  const setAtsOpen = useResumeStore((state) => state.setAtsOpen);
  const setAiOpen = useResumeStore((state) => state.setAiOpen);
  const mobileTab = useResumeStore((state) => state.mobileTab);
  const setMobileTab = useResumeStore((state) => state.setMobileTab);
  const templateName =
    listTemplates().find((template) => template.id === templateId)?.name ?? "Classic";

  return (
    <header className="flex shrink-0 flex-col border-b border-border bg-background">
      <div className="flex items-center gap-2 px-3 py-2">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          CVFairy
        </Link>
        <Link
          href="/dashboard"
          className="hidden text-xs text-muted-foreground hover:text-foreground sm:inline"
        >
          My resumes
        </Link>
        <Input
          aria-label="Resume title"
          className="h-8 max-w-48"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
          }}
        />
        <div className="ml-auto flex items-center gap-2">
          <SaveIndicator />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="hidden sm:inline-flex"
            onClick={() => {
              setTemplatePickerOpen(true);
            }}
          >
            <LayoutGrid data-icon="inline-start" />
            {templateName}
          </Button>
          <ExportButton />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="ATS checker"
            onClick={() => {
              setAtsOpen(true);
            }}
          >
            <ScanSearch />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="AI assistant"
            onClick={() => {
              setAiOpen(true);
            }}
          >
            <Sparkles />
          </Button>
          <AuthButton />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Settings"
            onClick={() => {
              setSettingsOpen(true);
            }}
          >
            <Settings />
          </Button>
        </div>
      </div>
      <div
        role="tablist"
        aria-label="Editor panels"
        className="flex border-t border-border lg:hidden"
      >
        <MobileTab
          selected={mobileTab === "form"}
          onSelect={() => {
            setMobileTab("form");
          }}
        >
          Form
        </MobileTab>
        <MobileTab
          selected={mobileTab === "preview"}
          onSelect={() => {
            setMobileTab("preview");
          }}
        >
          Preview
        </MobileTab>
      </div>
    </header>
  );
}

function MobileTab({
  selected,
  onSelect,
  children,
}: {
  selected: boolean;
  onSelect: () => void;
  children: string;
}): ReactElement {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      className="flex-1 px-3 py-2 text-sm font-medium text-muted-foreground aria-selected:border-b-2 aria-selected:border-foreground aria-selected:text-foreground"
      onClick={onSelect}
    >
      {children}
    </button>
  );
}
