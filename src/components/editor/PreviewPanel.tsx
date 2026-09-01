"use client";

import { useLayoutEffect, useRef, useState } from "react";

import { useDebouncedResume } from "@/lib/hooks/use-debounced-resume";
import { useResumeStore } from "@/lib/stores/resume-store";
import { cn } from "@/lib/utils";
import { deriveTemplateConfig } from "@/templates/shared/config";

import { PreviewControls } from "./PreviewControls";
import { ResumePreview } from "./ResumePreview";

import type { CSSProperties, ReactElement } from "react";

interface PreviewPanelProps {
  className?: string;
}

const MM_TO_PX = 3.779527559;

export function PreviewPanel({ className }: PreviewPanelProps): ReactElement {
  const previewZoom = useResumeStore((state) => state.previewZoom);
  const { data, settings } = useDebouncedResume();
  const config = deriveTemplateConfig(settings);
  const pageWidthPx = config.pageWidthMm * MM_TO_PX;
  const pageHeightPx = config.pageHeightMm * MM_TO_PX;
  const scrollRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [fitScale, setFitScale] = useState(1);
  const [contentHeight, setContentHeight] = useState(pageHeightPx);

  useLayoutEffect(() => {
    function measure(): void {
      const node = scrollRef.current;
      if (!node) {
        return;
      }
      const width = node.clientWidth - 48;
      setFitScale(Math.max(0.25, Math.min(1.5, width / pageWidthPx)));
    }
    measure();
    const observed = scrollRef.current;
    if (!observed) {
      return;
    }
    const observer = new ResizeObserver(measure);
    observer.observe(observed);
    return () => {
      observer.disconnect();
    };
  }, [pageWidthPx]);

  useLayoutEffect(() => {
    const node = innerRef.current;
    if (!node) {
      return;
    }
    setContentHeight(Math.max(pageHeightPx, node.scrollHeight));
  }, [data, settings, pageHeightPx]);

  const scale = previewZoom === "fit" ? fitScale : previewZoom / 100;
  const frameStyle: CSSProperties = {
    width: pageWidthPx * scale,
    height: contentHeight * scale,
  };
  const innerStyle: CSSProperties = {
    width: `${config.pageWidthMm}mm`,
    transform: `scale(${scale})`,
    transformOrigin: "top left",
  };

  return (
    <section
      aria-label="Resume preview"
      className={cn("flex min-h-0 flex-col bg-muted/40", className)}
    >
      <div className="flex shrink-0 border-b border-border bg-background px-3 py-1.5">
        <PreviewControls />
      </div>
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-auto p-6">
        <div className="mx-auto" style={frameStyle}>
          <div ref={innerRef} style={innerStyle}>
            <div
              className="relative shadow-sm"
              style={{
                minHeight: `${config.pageHeightMm}mm`,
                backgroundImage: `repeating-linear-gradient(to bottom, transparent 0, transparent calc(${config.pageHeightMm}mm - 1px), color-mix(in oklch, var(--border) 80%, transparent) calc(${config.pageHeightMm}mm - 1px), color-mix(in oklch, var(--border) 80%, transparent) ${config.pageHeightMm}mm)`,
              }}
            >
              <ResumePreview resume={data} settings={settings} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
