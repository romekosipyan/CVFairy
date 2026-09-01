"use client";

import { Button } from "@/components/ui/button";
import { PAGE_SIZES } from "@/lib/schemas";
import { useResumeStore } from "@/lib/stores/resume-store";

import type { ReactElement } from "react";
import type { PreviewZoom } from "@/lib/stores/types";

const ZOOM_LEVELS: PreviewZoom[] = [50, 75, 100, 125, "fit"];

export function PreviewControls(): ReactElement {
  const previewZoom = useResumeStore((state) => state.previewZoom);
  const setPreviewZoom = useResumeStore((state) => state.setPreviewZoom);
  const pageSize = useResumeStore((state) => state.settings.pageSize);
  const setSettings = useResumeStore((state) => state.setSettings);

  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <p className="text-xs font-medium text-muted-foreground">Preview</p>
      <div className="flex flex-wrap items-center gap-2">
        <div role="group" aria-label="Page size" className="flex gap-1">
          {PAGE_SIZES.map((size) => (
            <Button
              key={size}
              type="button"
              size="xs"
              variant={pageSize === size ? "secondary" : "ghost"}
              aria-pressed={pageSize === size}
              onClick={() => {
                setSettings({ pageSize: size });
              }}
            >
              {size === "a4" ? "A4" : "Letter"}
            </Button>
          ))}
        </div>
        <div role="group" aria-label="Preview zoom" className="flex gap-1">
          {ZOOM_LEVELS.map((level) => (
            <Button
              key={level}
              type="button"
              size="xs"
              variant={previewZoom === level ? "secondary" : "ghost"}
              aria-pressed={previewZoom === level}
              onClick={() => {
                setPreviewZoom(level);
              }}
            >
              {level === "fit" ? "Fit" : `${level}%`}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
