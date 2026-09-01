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
import type { ExperienceEntry } from "@/lib/schemas/experience";

export function ExperienceForm(): ReactElement {
  const entries = useResumeStore((state) => state.data.experience.entries);
  const addExperience = useResumeStore((state) => state.addExperience);

  return (
    <SectionWrapper id="experience" title="Experience">
      {entries.length === 0 ? (
        <p className="text-sm text-muted-foreground">No jobs added yet.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {entries.map((entry, index) => (
            <li key={entry.id} className="rounded-lg border border-border p-3">
              <ExperienceEntryCard
                entry={entry}
                index={index}
                total={entries.length}
              />
            </li>
          ))}
        </ul>
      )}
      <Button type="button" variant="outline" size="sm" onClick={addExperience}>
        <Plus data-icon="inline-start" />
        Add experience
      </Button>
    </SectionWrapper>
  );
}

function ExperienceEntryCard({
  entry,
  index,
  total,
}: {
  entry: ExperienceEntry;
  index: number;
  total: number;
}): ReactElement {
  const updateExperience = useResumeStore((state) => state.updateExperience);
  const removeExperience = useResumeStore((state) => state.removeExperience);
  const moveExperience = useResumeStore((state) => state.moveExperience);

  return (
    <div className="flex flex-col gap-3">
      <EntryToolbar
        label="experience"
        index={index}
        total={total}
        onMove={moveExperience}
        onRemove={() => {
          removeExperience(entry.id);
        }}
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <TextField
          id={`${entry.id}-title`}
          label="Title"
          value={entry.title}
          onChange={(value) => {
            updateExperience(entry.id, { title: value });
          }}
        />
        <TextField
          id={`${entry.id}-company`}
          label="Company"
          value={entry.company}
          onChange={(value) => {
            updateExperience(entry.id, { company: value });
          }}
        />
        <TextField
          id={`${entry.id}-location`}
          label="Location"
          value={entry.location}
          onChange={(value) => {
            updateExperience(entry.id, { location: value });
          }}
        />
      </div>
      <DateRangePicker
        id={`${entry.id}-dates`}
        startDate={entry.startDate}
        endDate={entry.endDate}
        current={entry.current}
        onStartChange={(value) => {
          updateExperience(entry.id, { startDate: value });
        }}
        onEndChange={(value) => {
          updateExperience(entry.id, { endDate: value });
        }}
        onCurrentChange={(current) => {
          updateExperience(entry.id, {
            current,
            endDate: current ? "" : entry.endDate,
          });
        }}
      />
      <BulletPointList
        id={entry.id}
        bullets={entry.bullets}
        onChange={(bullets) => {
          updateExperience(entry.id, { bullets });
        }}
      />
    </div>
  );
}
