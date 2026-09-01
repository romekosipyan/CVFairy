"use client";

import { useState } from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { KeyboardEvent, ReactElement } from "react";

interface TagInputProps {
  id: string;
  label: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export function TagInput({
  id,
  label,
  tags,
  onChange,
  placeholder = "Type a skill and press Enter",
}: TagInputProps): ReactElement {
  const [draft, setDraft] = useState("");

  function addTag(): void {
    const next = draft.trim();
    if (!next || tags.includes(next)) {
      setDraft("");
      return;
    }
    onChange([...tags, next]);
    setDraft("");
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    if (event.key !== "Enter") {
      return;
    }
    event.preventDefault();
    addTag();
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        value={draft}
        placeholder={placeholder}
        onChange={(event) => {
          setDraft(event.target.value);
        }}
        onKeyDown={onKeyDown}
      />
      {tags.length > 0 ? (
        <ul className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <li
              key={tag}
              className="flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs"
            >
              {tag}
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                aria-label={`Remove ${tag}`}
                onClick={() => {
                  onChange(tags.filter((item) => item !== tag));
                }}
              >
                <X />
              </Button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
