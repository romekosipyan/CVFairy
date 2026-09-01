"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useResumeStore } from "@/lib/stores/resume-store";

import { BulletPointList } from "./BulletPointList";
import { DateRangePicker } from "./DateRangePicker";
import { EntryToolbar } from "./EntryToolbar";
import { SectionWrapper } from "./SectionWrapper";
import { TextField } from "./TextField";

import type { ReactElement } from "react";
import type { EducationEntry } from "@/lib/schemas/education";

export function EducationForm(): ReactElement {
  const entries = useResumeStore((state) => state.data.education.entries);
  const addEducation = useResumeStore((state) => state.addEducation);

  return (
    <SectionWrapper id="education" title="Education">
      {entries.length === 0 ? (
        <p className="text-sm text-muted-foreground">No schools added yet.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {entries.map((entry, index) => (
            <li key={entry.id} className="rounded-lg border border-border p-3">
              <EducationEntryCard
                entry={entry}
                index={index}
                total={entries.length}
              />
            </li>
          ))}
        </ul>
      )}
      <Button type="button" variant="outline" size="sm" onClick={addEducation}>
        <Plus data-icon="inline-start" />
        Add education
      </Button>
    </SectionWrapper>
  );
}

function EducationEntryCard({
  entry,
  index,
  total,
}: {
  entry: EducationEntry;
  index: number;
  total: number;
}): ReactElement {
  const updateEducation = useResumeStore((state) => state.updateEducation);
  const removeEducation = useResumeStore((state) => state.removeEducation);
  const moveEducation = useResumeStore((state) => state.moveEducation);

  return (
    <div className="flex flex-col gap-3">
      <EntryToolbar
        label="education"
        index={index}
        total={total}
        onMove={moveEducation}
        onRemove={() => {
          removeEducation(entry.id);
        }}
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <TextField
          id={`${entry.id}-degree`}
          label="Degree"
          value={entry.degree}
          onChange={(value) => {
            updateEducation(entry.id, { degree: value });
          }}
        />
        <TextField
          id={`${entry.id}-school`}
          label="School"
          value={entry.school}
          onChange={(value) => {
            updateEducation(entry.id, { school: value });
          }}
        />
        <TextField
          id={`${entry.id}-location`}
          label="Location"
          value={entry.location}
          onChange={(value) => {
            updateEducation(entry.id, { location: value });
          }}
        />
        <TextField
          id={`${entry.id}-gpa`}
          label="GPA"
          value={entry.gpa}
          onChange={(value) => {
            updateEducation(entry.id, { gpa: value });
          }}
        />
      </div>
      <DateRangePicker
        id={`${entry.id}-dates`}
        startDate={entry.startDate}
        endDate={entry.endDate}
        onStartChange={(value) => {
          updateEducation(entry.id, { startDate: value });
        }}
        onEndChange={(value) => {
          updateEducation(entry.id, { endDate: value });
        }}
      />
      <BulletPointList
        id={entry.id}
        bullets={entry.bullets}
        onChange={(bullets) => {
          updateEducation(entry.id, { bullets });
        }}
      />
    </div>
  );
}
