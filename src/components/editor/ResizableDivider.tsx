"use client";

import { useRef } from "react";

import { cn } from "@/lib/utils";

import type { KeyboardEvent, PointerEvent, ReactElement } from "react";

interface ResizableDividerProps {
  formPercent: number;
  onDelta: (deltaX: number) => void;
  onDraggingChange: (dragging: boolean) => void;
  className?: string;
}

export function ResizableDivider({
  formPercent,
  onDelta,
  onDraggingChange,
  className,
}: ResizableDividerProps): ReactElement {
  const lastX = useRef(0);

  function onPointerDown(event: PointerEvent<HTMLDivElement>): void {
    lastX.current = event.clientX;
    onDraggingChange(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>): void {
    if (event.buttons === 0) {
      return;
    }
    const delta = event.clientX - lastX.current;
    lastX.current = event.clientX;
    onDelta(delta);
  }

  function onPointerUp(): void {
    onDraggingChange(false);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      onDelta(-16);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      onDelta(16);
    }
  }

  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize editor panels"
      aria-valuemin={25}
      aria-valuemax={70}
      aria-valuenow={Math.round(formPercent)}
      tabIndex={0}
      className={cn(
        "relative hidden w-1.5 shrink-0 cursor-col-resize bg-border",
        "hover:bg-ring/60 focus-visible:bg-ring focus-visible:outline-none",
        "lg:block",
        className,
      )}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onKeyDown={onKeyDown}
    />
  );
}
