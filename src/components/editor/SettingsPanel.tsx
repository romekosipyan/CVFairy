"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DATE_FORMATS,
  FONT_FAMILIES,
  FONT_SIZES,
  PAGE_SIZES,
  ResumeSettings,
  SECTION_SEPARATORS,
  SPACING_SCALES,
} from "@/lib/schemas";
import { useResumeStore } from "@/lib/stores/resume-store";

import type { ReactElement } from "react";

export function SettingsPanel(): ReactElement | null {
  const open = useResumeStore((state) => state.settingsOpen);
  const setOpen = useResumeStore((state) => state.setSettingsOpen);
  const settings = useResumeStore((state) => state.settings);
  const setSettings = useResumeStore((state) => state.setSettings);

  if (!open) {
    return null;
  }

  return (
    <aside
      aria-label="Resume settings"
      className="fixed inset-y-0 right-0 z-40 flex w-full max-w-sm flex-col border-l border-border bg-background shadow-xl"
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold">Customize</h2>
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
      <div className="flex flex-col gap-4 overflow-auto p-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="accent-color">Accent color</Label>
          <Input
            id="accent-color"
            type="color"
            value={settings.accentColor}
            onChange={(event) => {
              const parsed = ResumeSettings.shape.accentColor.safeParse(
                event.target.value,
              );
              if (parsed.success) {
                setSettings({ accentColor: parsed.data });
              }
            }}
          />
        </div>
        <SelectField
          label="Font"
          value={settings.fontFamily}
          options={FONT_FAMILIES}
          onChange={(value) => {
            const parsed = ResumeSettings.shape.fontFamily.safeParse(value);
            if (parsed.success) {
              setSettings({ fontFamily: parsed.data });
            }
          }}
        />
        <SelectField
          label="Font size"
          value={settings.fontSize}
          options={FONT_SIZES}
          onChange={(value) => {
            const parsed = ResumeSettings.shape.fontSize.safeParse(value);
            if (parsed.success) {
              setSettings({ fontSize: parsed.data });
            }
          }}
        />
        <SelectField
          label="Spacing"
          value={settings.spacing}
          options={SPACING_SCALES}
          onChange={(value) => {
            const parsed = ResumeSettings.shape.spacing.safeParse(value);
            if (parsed.success) {
              setSettings({ spacing: parsed.data });
            }
          }}
        />
        <SelectField
          label="Date format"
          value={settings.dateFormat}
          options={DATE_FORMATS}
          onChange={(value) => {
            const parsed = ResumeSettings.shape.dateFormat.safeParse(value);
            if (parsed.success) {
              setSettings({ dateFormat: parsed.data });
            }
          }}
        />
        <SelectField
          label="Section separator"
          value={settings.sectionSeparator}
          options={SECTION_SEPARATORS}
          onChange={(value) => {
            const parsed = ResumeSettings.shape.sectionSeparator.safeParse(value);
            if (parsed.success) {
              setSettings({ sectionSeparator: parsed.data });
            }
          }}
        />
        <SelectField
          label="Page size"
          value={settings.pageSize}
          options={PAGE_SIZES}
          onChange={(value) => {
            const parsed = ResumeSettings.shape.pageSize.safeParse(value);
            if (parsed.success) {
              setSettings({ pageSize: parsed.data });
            }
          }}
        />
      </div>
    </aside>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
}): ReactElement {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      <select
        className="h-8 rounded-lg border border-border bg-background px-2 text-sm"
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
        }}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
