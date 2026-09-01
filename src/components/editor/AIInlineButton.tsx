"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { AIAction } from "@/lib/ai/prompts";

import type { ReactElement } from "react";

interface AIInlineButtonProps {
  original: string;
  onAccept: (value: string) => void;
}

export function AIInlineButton({ original, onAccept }: AIInlineButtonProps): ReactElement {
  const { status } = useSession();
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function improve(): Promise<void> {
    const parsed = AIAction.safeParse({ type: "improve-bullet", original });
    if (!parsed.success || status !== "authenticated") {
      setError("Sign in to use AI");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json: unknown = await response.json();
      if (!response.ok) {
        throw new Error("AI request failed");
      }
      if (typeof json === "object" && json !== null && "content" in json) {
        const content = json.content;
        setSuggestion(typeof content === "string" ? content : null);
      }
    } catch (caught: unknown) {
      setError(caught instanceof Error ? caught.message : "AI request failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <Button type="button" size="xs" variant="ghost" disabled={busy} onClick={() => void improve()}>
        {busy ? "Improving…" : "Improve with AI"}
      </Button>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
      {suggestion ? (
        <div className="rounded-md border border-border p-2 text-xs">
          <p className="mb-1 font-medium uppercase tracking-wide text-muted-foreground">
            AI-generated
          </p>
          <p>{suggestion}</p>
          <div className="mt-2 flex gap-2">
            <Button
              type="button"
              size="xs"
              onClick={() => {
                onAccept(suggestion);
                setSuggestion(null);
              }}
            >
              Accept
            </Button>
            <Button
              type="button"
              size="xs"
              variant="ghost"
              onClick={() => {
                setSuggestion(null);
              }}
            >
              Discard
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
