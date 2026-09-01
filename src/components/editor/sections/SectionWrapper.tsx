"use client";

import { useContext, useState } from "react";
import { ChevronDown, GripVertical } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useResumeStore } from "@/lib/stores/resume-store";
import { cn } from "@/lib/utils";

import { SortableHandleContext } from "../sortable-handle-context";

import type { ReactElement, ReactNode } from "react";
import type { EditorSectionId } from "@/lib/stores/types";

interface SectionWrapperProps {
  id: EditorSectionId;
  title: string;
  children: ReactNode;
  draggable?: boolean;
  defaultOpen?: boolean;
}

export function SectionWrapper({
  id,
  title,
  children,
  draggable = true,
  defaultOpen = true,
}: SectionWrapperProps): ReactElement {
  const handleRef = useContext(SortableHandleContext);
  const [open, setOpen] = useState(defaultOpen);
  const activeSectionId = useResumeStore((state) => state.activeSectionId);
  const setActiveSection = useResumeStore((state) => state.setActiveSection);
  const active = activeSectionId === id;

  return (
    <section
      id={`section-${id}`}
      className={cn(
        "rounded-xl border border-border bg-card text-card-foreground",
        active && "ring-2 ring-ring/40",
      )}
    >
      <div className="flex items-center gap-1 border-b border-border px-2 py-1.5">
        {draggable ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label={`Reorder ${title}`}
            className="cursor-grab"
            data-section-drag-handle
            ref={handleRef}
          >
            <GripVertical />
          </Button>
        ) : (
          <span className="size-6" aria-hidden="true" />
        )}
        <button
          type="button"
          aria-expanded={open}
          className="flex flex-1 items-center justify-between rounded-md px-1 py-1 text-left text-sm font-semibold hover:bg-muted"
          onClick={() => {
            setOpen((current) => !current);
            setActiveSection(id);
          }}
        >
          {title}
          <ChevronDown
            aria-hidden="true"
            className={cn(
              "size-4 text-muted-foreground motion-safe:transition-transform",
              !open && "-rotate-90",
            )}
          />
        </button>
      </div>
      {open ? <div className="flex flex-col gap-4 p-4">{children}</div> : null}
    </section>
  );
}
