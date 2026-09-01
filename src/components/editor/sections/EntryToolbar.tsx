"use client";

import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { ReactElement } from "react";

interface EntryToolbarProps {
  label: string;
  index: number;
  total: number;
  onMove: (from: number, to: number) => void;
  onRemove: () => void;
}

export function EntryToolbar({
  label,
  index,
  total,
  onMove,
  onRemove,
}: EntryToolbarProps): ReactElement {
  return (
    <div className="flex justify-end gap-1">
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        aria-label={`Move ${label} up`}
        disabled={index === 0}
        onClick={() => {
          onMove(index, index - 1);
        }}
      >
        <ChevronUp />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        aria-label={`Move ${label} down`}
        disabled={index >= total - 1}
        onClick={() => {
          onMove(index, index + 1);
        }}
      >
        <ChevronDown />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        aria-label={`Remove ${label}`}
        onClick={onRemove}
      >
        <Trash2 />
      </Button>
    </div>
  );
}
