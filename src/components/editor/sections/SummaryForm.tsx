"use client";

import { AIInlineButton } from "@/components/editor/AIInlineButton";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useResumeStore } from "@/lib/stores/resume-store";
import { cn } from "@/lib/utils";

import { SectionWrapper } from "./SectionWrapper";

import type { ReactElement } from "react";

const RECOMMENDED_MAX = 500;

export function SummaryForm(): ReactElement {
  const content = useResumeStore((state) => state.data.summary.content);
  const setSummary = useResumeStore((state) => state.setSummary);
  const overLimit = content.length > RECOMMENDED_MAX;

  return (
    <SectionWrapper id="summary" title="Summary">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="summary-content">Professional summary</Label>
        <Textarea
          id="summary-content"
          value={content}
          rows={5}
          onChange={(event) => {
            setSummary(event.target.value);
          }}
        />
        <p
          className={cn(
            "text-xs text-muted-foreground",
            overLimit && "text-destructive",
          )}
        >
          {content.length}/{RECOMMENDED_MAX}
          {overLimit ? " — over the recommended length" : ""}
        </p>
        <AIInlineButton original={content} onAccept={setSummary} />
      </div>
    </SectionWrapper>
  );
}
