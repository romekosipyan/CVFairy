"use client";

import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { moveItem } from "@/lib/utils/array";

import type { ReactElement } from "react";

interface BulletPointListProps {
  id: string;
  bullets: string[];
  onChange: (bullets: string[]) => void;
}

export function BulletPointList({
  id,
  bullets,
  onChange,
}: BulletPointListProps): ReactElement {
  return (
    <div className="flex flex-col gap-2">
      <Label>Bullet points</Label>
      <ul className="flex flex-col gap-2">
        {bullets.map((bullet, index) => (
          <li key={`${id}-bullet-${index}`} className="flex items-center gap-1">
            <Input
              aria-label={`Bullet ${index + 1}`}
              value={bullet}
              onChange={(event) => {
                const next = bullets.slice();
                next[index] = event.target.value;
                onChange(next);
              }}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              aria-label={`Move bullet ${index + 1} up`}
              disabled={index === 0}
              onClick={() => {
                onChange(moveItem(bullets, index, index - 1));
              }}
            >
              <ChevronUp />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              aria-label={`Move bullet ${index + 1} down`}
              disabled={index === bullets.length - 1}
              onClick={() => {
                onChange(moveItem(bullets, index, index + 1));
              }}
            >
              <ChevronDown />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              aria-label={`Remove bullet ${index + 1}`}
              onClick={() => {
                onChange(bullets.filter((_, itemIndex) => itemIndex !== index));
              }}
            >
              <Trash2 />
            </Button>
          </li>
        ))}
      </ul>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => {
          onChange([...bullets, ""]);
        }}
      >
        <Plus data-icon="inline-start" />
        Add bullet
      </Button>
    </div>
  );
}
