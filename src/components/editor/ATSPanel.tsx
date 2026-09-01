"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { scoreResume } from "@/lib/ats/checker";
import { useResumeStore } from "@/lib/stores/resume-store";

import type { ReactElement } from "react";

export function ATSPanel(): ReactElement | null {
  const open = useResumeStore((state) => state.atsOpen);
  const setOpen = useResumeStore((state) => state.setAtsOpen);
  const data = useResumeStore((state) => state.data);
  const { status } = useSession();
  const [jobDescription, setJobDescription] = useState("");
  const signedIn = status === "authenticated";
  const result = useMemo(
    () => scoreResume(data, signedIn ? jobDescription : ""),
    [data, jobDescription, signedIn],
  );

  if (!open) {
    return null;
  }

  return (
    <aside
      aria-label="ATS checker"
      className="fixed inset-y-0 right-0 z-40 flex w-full max-w-md flex-col border-l border-border bg-background shadow-xl"
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold">ATS checker</h2>
        <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
          Close
        </Button>
      </div>
      <div className="flex flex-col gap-4 overflow-auto p-4 text-sm">
        <p>
          Score <span className="font-semibold">{result.overallScore}</span>/100 — 70%
          section completeness, 30% keyword overlap when a job description is present.
        </p>
        <ul className="grid gap-2">
          {result.sections.map((section) => (
            <li key={section.name} className="rounded-lg border border-border p-2">
              <p className="font-medium">
                {section.name} {section.found ? "· found" : "· missing"}
              </p>
              {section.issues.map((issue) => (
                <p key={issue.message} className="text-muted-foreground">
                  {issue.message}
                </p>
              ))}
            </li>
          ))}
        </ul>
        {signedIn ? (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="jd">Job description (match score)</Label>
            <Textarea
              id="jd"
              rows={6}
              value={jobDescription}
              onChange={(event) => setJobDescription(event.target.value)}
            />
            {jobDescription.trim() ? (
              <p>
                Keyword match {result.keywords.matchPercentage}%. Missing:{" "}
                {result.keywords.missing.slice(0, 12).join(", ") || "none"}
              </p>
            ) : null}
          </div>
        ) : (
          <p className="text-muted-foreground">
            Sign in to compare against a job description. Completeness checks stay free.
          </p>
        )}
        <div>
          <h3 className="mb-2 font-medium">Parsed view</h3>
          <div className="space-y-2 rounded-lg border border-border bg-muted/30 p-3 font-mono text-xs">
            {result.parsedView.map((block) => (
              <section key={block.section}>
                <p className="font-semibold uppercase">{block.section}</p>
                <p className="whitespace-pre-wrap text-muted-foreground">
                  {block.content || "—"}
                </p>
              </section>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
