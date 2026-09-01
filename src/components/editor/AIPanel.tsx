"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AIAction } from "@/lib/ai/prompts";
import { useResumeStore } from "@/lib/stores/resume-store";
import { simulateAtsParse } from "@/lib/ats/parser-simulator";

import type { ReactElement } from "react";

export function AIPanel(): ReactElement | null {
  const open = useResumeStore((state) => state.aiOpen);
  const setOpen = useResumeStore((state) => state.setAiOpen);
  const { status } = useSession();
  const [jobTitle, setJobTitle] = useState("");
  const [description, setDescription] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const setSummary = useResumeStore((state) => state.setSummary);

  if (!open) {
    return null;
  }

  async function run(action: unknown): Promise<void> {
    const parsed = AIAction.safeParse(action);
    if (!parsed.success) {
      setError("Invalid AI action");
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
        throw new Error(readError(json) ?? "AI request failed");
      }
      if (typeof json === "object" && json !== null && "content" in json) {
        const content = json.content;
        setOutput(typeof content === "string" ? content : "");
      }
    } catch (caught: unknown) {
      setError(caught instanceof Error ? caught.message : "AI request failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <aside
      aria-label="AI assistant"
      className="fixed inset-y-0 right-0 z-40 flex w-full max-w-md flex-col border-l border-border bg-background shadow-xl"
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold">AI assistant</h2>
        <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
          Close
        </Button>
      </div>
      <div className="flex flex-col gap-3 overflow-auto p-4">
        <p className="text-xs text-muted-foreground">
          Suggestions are AI-generated. Review them before applying. Never accepts
          changes unless you click Apply.
        </p>
        {status !== "authenticated" ? (
          <p className="text-sm">
            <Link href="/login" className="underline">
              Sign in
            </Link>{" "}
            to use AI (5 free requests per day).
          </p>
        ) : (
          <>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ai-title">Target job title</Label>
              <input
                id="ai-title"
                className="h-8 rounded-lg border border-border px-2 text-sm"
                value={jobTitle}
                onChange={(event) => setJobTitle(event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ai-desc">Notes or job description</Label>
              <Textarea
                id="ai-desc"
                rows={5}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                disabled={busy}
                onClick={() =>
                  void run({
                    type: "generate-bullets",
                    jobTitle: jobTitle || "Role",
                    description: description || "See resume context",
                  })
                }
              >
                Generate bullets
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={busy}
                onClick={() => {
                  const resumeText = simulateAtsParse(useResumeStore.getState().data)
                    .map((item) => item.content)
                    .join("\n");
                  void run({
                    type: "write-summary",
                    resumeText: resumeText || "Empty resume",
                    targetRole: jobTitle,
                  });
                }}
              >
                Draft summary
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={busy}
                onClick={() =>
                  void run({
                    type: "suggest-skills",
                    jobTitle,
                    jobDescription: description,
                  })
                }
              >
                Suggest skills
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={busy}
                onClick={() => {
                  const resumeText = simulateAtsParse(useResumeStore.getState().data)
                    .map((item) => item.content)
                    .join("\n");
                  void run({
                    type: "tailor-resume",
                    resumeText: resumeText || "Empty resume",
                    jobDescription: description || "No job description",
                  });
                }}
              >
                Tailor to JD
              </Button>
            </div>
          </>
        )}
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        {output ? (
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              AI-generated
            </p>
            <pre className="whitespace-pre-wrap rounded-lg border border-border bg-muted/40 p-3 text-sm">
              {output}
            </pre>
            <Button
              type="button"
              size="sm"
              onClick={() => {
                setSummary(output);
              }}
            >
              Apply to summary
            </Button>
          </div>
        ) : null}
      </div>
    </aside>
  );
}

function readError(json: unknown): string | null {
  if (typeof json === "object" && json !== null && "error" in json) {
    const error = json.error;
    return typeof error === "string" ? error : null;
  }
  return null;
}
