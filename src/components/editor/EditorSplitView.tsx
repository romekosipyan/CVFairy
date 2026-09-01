"use client";

import { useRef, useState } from "react";

import { useResumeStore } from "@/lib/stores/resume-store";
import { cn } from "@/lib/utils";

import { FormPanel } from "./FormPanel";
import { PreviewPanel } from "./PreviewPanel";
import { ResizableDivider } from "./ResizableDivider";

import type { ReactElement } from "react";

const DEFAULT_FORM_PERCENT = 40;

function clampFormPercent(percent: number, containerWidth: number): number {
  const minForm = (280 / containerWidth) * 100;
  const minPreview = (320 / containerWidth) * 100;
  const min = Math.max(25, minForm);
  const max = Math.min(70, 100 - minPreview);
  if (min >= max) {
    return DEFAULT_FORM_PERCENT;
  }
  return Math.min(max, Math.max(min, percent));
}

export function EditorSplitView(): ReactElement {
  const previewVisible = useResumeStore((state) => state.previewVisible);
  const mobileTab = useResumeStore((state) => state.mobileTab);
  const [formPercent, setFormPercent] = useState(DEFAULT_FORM_PERCENT);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  function applyDelta(deltaX: number): void {
    const width = containerRef.current?.getBoundingClientRect().width;
    if (!width) {
      return;
    }
    setFormPercent((current) =>
      clampFormPercent(current + (deltaX / width) * 100, width),
    );
  }

  return (
    <div ref={containerRef} className="flex min-h-0 flex-1 overflow-hidden">
      <div
        className={cn(
          "flex min-h-0 min-w-0 flex-col max-lg:w-full max-lg:flex-1 lg:flex-1",
          mobileTab !== "form" && "max-lg:hidden",
          !previewVisible && "lg:flex-1",
          !dragging &&
            "motion-safe:lg:transition-[flex-basis] motion-safe:duration-200",
        )}
        style={{ flexBasis: previewVisible ? `${formPercent}%` : "100%" }}
      >
        <FormPanel className="h-full min-h-0 flex-1" />
      </div>
      {previewVisible ? (
        <ResizableDivider
          formPercent={formPercent}
          onDelta={applyDelta}
          onDraggingChange={setDragging}
        />
      ) : null}
      <div
        className={cn(
          "flex min-h-0 min-w-0 flex-col max-lg:w-full max-lg:flex-1 lg:flex-1",
          mobileTab !== "preview" && "max-lg:hidden",
          !previewVisible && "lg:hidden",
          !dragging &&
            "motion-safe:lg:transition-[flex-basis] motion-safe:duration-200",
        )}
        style={{ flexBasis: `${100 - formPercent}%` }}
      >
        <PreviewPanel className="h-full min-h-0 flex-1" />
      </div>
    </div>
  );
}
