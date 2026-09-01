"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useResumeStore } from "@/lib/stores/resume-store";

import { EntryToolbar } from "./EntryToolbar";
import { SectionWrapper } from "./SectionWrapper";
import { TagInput } from "./TagInput";
import { TextField } from "./TextField";

import type { ReactElement } from "react";
import type { SkillGroup } from "@/lib/schemas/skills";

export function SkillsForm(): ReactElement {
  const groups = useResumeStore((state) => state.data.skills.groups);
  const addSkillGroup = useResumeStore((state) => state.addSkillGroup);

  return (
    <SectionWrapper id="skills" title="Skills">
      {groups.length === 0 ? (
        <p className="text-sm text-muted-foreground">No skill groups yet.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {groups.map((group, index) => (
            <li key={group.id} className="rounded-lg border border-border p-3">
              <SkillGroupCard group={group} index={index} total={groups.length} />
            </li>
          ))}
        </ul>
      )}
      <Button type="button" variant="outline" size="sm" onClick={addSkillGroup}>
        <Plus data-icon="inline-start" />
        Add skill group
      </Button>
    </SectionWrapper>
  );
}

function SkillGroupCard({
  group,
  index,
  total,
}: {
  group: SkillGroup;
  index: number;
  total: number;
}): ReactElement {
  const updateSkillGroup = useResumeStore((state) => state.updateSkillGroup);
  const removeSkillGroup = useResumeStore((state) => state.removeSkillGroup);
  const moveSkillGroup = useResumeStore((state) => state.moveSkillGroup);

  return (
    <div className="flex flex-col gap-3">
      <EntryToolbar
        label="skill group"
        index={index}
        total={total}
        onMove={moveSkillGroup}
        onRemove={() => {
          removeSkillGroup(group.id);
        }}
      />
      <TextField
        id={`${group.id}-category`}
        label="Category"
        value={group.category}
        onChange={(value) => {
          updateSkillGroup(group.id, { category: value });
        }}
      />
      <TagInput
        id={`${group.id}-skills`}
        label="Skills"
        tags={group.skills}
        onChange={(skills) => {
          updateSkillGroup(group.id, { skills });
        }}
      />
    </div>
  );
}
