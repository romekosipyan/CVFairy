"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { ReactElement } from "react";

interface TextFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: (value: string) => void;
  error?: string | null;
  type?: "text" | "email" | "tel" | "url" | "month";
  autoComplete?: string;
  disabled?: boolean;
}

export function TextField({
  id,
  label,
  value,
  onChange,
  onBlur,
  error,
  type = "text",
  autoComplete,
  disabled,
}: TextFieldProps): ReactElement {
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        onChange={(event) => {
          onChange(event.target.value);
        }}
        onBlur={(event) => {
          onBlur?.(event.target.value);
        }}
      />
      {error ? (
        <p id={errorId} className="text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
