"use client";

import { Button } from "@/components/ui/button";
import { useResumeStore } from "@/lib/stores/resume-store";
import { listTemplates } from "@/templates/registry";

import type { ReactElement } from "react";

export function TemplatePicker(): ReactElement | null {
  const open = useResumeStore((state) => state.templatePickerOpen);
  const setOpen = useResumeStore((state) => state.setTemplatePickerOpen);
  const templateId = useResumeStore((state) => state.settings.templateId);
  const setSettings = useResumeStore((state) => state.setSettings);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center bg-black/40 p-4 pt-16">
      <div
        role="dialog"
        aria-labelledby="template-picker-title"
        className="max-h-[80vh] w-full max-w-3xl overflow-auto rounded-xl border border-border bg-background p-5 shadow-lg"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 id="template-picker-title" className="text-lg font-semibold">
            Choose a template
          </h2>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setOpen(false);
            }}
          >
            Close
          </Button>
        </div>
        <ul className="grid gap-4 sm:grid-cols-3">
          {listTemplates().map((template) => (
            <li key={template.id}>
              <button
                type="button"
                className="w-full rounded-lg border p-2 text-left hover:bg-muted aria-pressed:border-foreground"
                aria-pressed={templateId === template.id}
                onClick={() => {
                  setSettings({ templateId: template.id });
                  setOpen(false);
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={template.thumbnail}
                  alt=""
                  className="mb-2 aspect-[210/297] w-full rounded-md border border-border bg-white object-cover"
                />
                <p className="text-sm font-medium">{template.name}</p>
                <p className="text-xs text-muted-foreground">{template.description}</p>
                <span className="mt-1 inline-block rounded-full bg-muted px-2 py-0.5 text-[10px] uppercase tracking-wide">
                  {template.tier}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
