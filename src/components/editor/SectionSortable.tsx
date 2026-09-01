"use client";

import { memo } from "react";
import {
  DragDropProvider,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
} from "@dnd-kit/react";
import { isSortable, useSortable } from "@dnd-kit/react/sortable";
import { move } from "@dnd-kit/helpers";
import { directionBiased } from "@dnd-kit/collision";

import { SectionId } from "@/lib/schemas";
import { useResumeStore } from "@/lib/stores/resume-store";
import { cn } from "@/lib/utils";

import { SortableHandleContext } from "./sortable-handle-context";

import type { ReactElement, ReactNode } from "react";
import type { SectionId as SectionIdType } from "@/lib/schemas";

const SECTION_LABEL: Record<SectionIdType, string> = {
  summary: "Summary",
  experience: "Experience",
  education: "Education",
  skills: "Skills",
};

function overlayLabel(id: unknown): string {
  if (typeof id !== "string") {
    return "Section";
  }
  const labels: Record<string, string> = SECTION_LABEL;
  return labels[id] ?? id;
}

interface SectionSortableProps {
  children: ReactNode;
}

export function SectionSortable({
  children,
}: SectionSortableProps): ReactElement {
  const setSectionOrder = useResumeStore((state) => state.setSectionOrder);

  return (
    <DragDropProvider
      sensors={(defaults) => [...defaults, PointerSensor, KeyboardSensor]}
      onDragEnd={(event) => {
        if (event.canceled) {
          return;
        }
        if (!isSortable(event.operation.source)) {
          return;
        }
        const current = useResumeStore.getState().data.sectionOrder;
        const next = move(current, event);
        const parsed = SectionId.array().safeParse(next);
        if (parsed.success) {
          setSectionOrder(parsed.data);
        }
      }}
    >
      {children}
      <DragOverlay>
        {(source) => (
          <div className="rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold shadow-lg">
            {overlayLabel(source?.id)}
          </div>
        )}
      </DragOverlay>
    </DragDropProvider>
  );
}

interface SortableSectionItemProps {
  id: SectionIdType;
  index: number;
  children: ReactNode;
}

export const SortableSectionItem = memo(function SortableSectionItem({
  id,
  index,
  children,
}: SortableSectionItemProps): ReactElement {
  const { ref, handleRef, isDragging, isDropTarget } = useSortable({
    id,
    index,
    collisionDetector: directionBiased,
  });

  return (
    <SortableHandleContext.Provider value={handleRef}>
      <div
        ref={ref}
        className={cn(
          isDragging && "opacity-50 shadow-md",
          isDropTarget && "ring-2 ring-ring/50",
        )}
      >
        {children}
      </div>
    </SortableHandleContext.Provider>
  );
});
