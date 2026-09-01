"use client";

import { useState } from "react";
import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { downloadResumeExport, type ExportFormat } from "@/lib/export";
import { useResumeStore } from "@/lib/stores/resume-store";

import type { ReactElement } from "react";

const FORMATS: { id: ExportFormat; label: string }[] = [
  { id: "pdf", label: "PDF" },
  { id: "docx", label: "Word (DOCX)" },
  { id: "html", label: "HTML" },
  { id: "markdown", label: "Markdown" },
  { id: "txt", label: "Plain text" },
  { id: "json", label: "JSON" },
];

export function ExportButton(): ReactElement {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const data = useResumeStore((state) => state.data);
  const settings = useResumeStore((state) => state.settings);

  async function handleExport(format: ExportFormat): Promise<void> {
    setBusy(true);
    setError(null);
    try {
      await downloadResumeExport(data, settings, format);
      setOpen(false);
    } catch (caught: unknown) {
      setError(caught instanceof Error ? caught.message : "Export failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative">
      <Button
        type="button"
        variant="outline"
        size="sm"
        aria-expanded={open}
        aria-haspopup="menu"
        disabled={busy}
        onClick={() => {
          setOpen((current) => !current);
        }}
      >
        <Download data-icon="inline-start" />
        {busy ? "Exporting…" : "Export"}
      </Button>
      {open ? (
        <ul
          role="menu"
          className="absolute right-0 z-30 mt-1 min-w-44 rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-md"
        >
          {FORMATS.map((format) => (
            <li key={format.id} role="none">
              <button
                type="button"
                role="menuitem"
                className="flex w-full rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted"
                onClick={() => {
                  void handleExport(format.id);
                }}
              >
                {format.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      {error ? (
        <p role="alert" className="absolute right-0 top-full mt-10 text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
