import type { ReactElement } from "react";
import type { DateFormat, Resume } from "@/lib/schemas";
import type { EducationEntry } from "@/lib/schemas/education";
import type { ExperienceEntry } from "@/lib/schemas/experience";
import type { SkillGroup } from "@/lib/schemas/skills";

import {
  displayOrPlaceholder,
  educationHeading,
  experienceHeading,
  formatDateRange,
  nonemptyBullets,
  PLACEHOLDERS,
} from "./format";
import { HtmlBulletList } from "./resume-page";

export function HtmlSummary({
  content,
  placeholders,
}: {
  content: string;
  placeholders: boolean;
}): ReactElement | null {
  const text = displayOrPlaceholder(content, PLACEHOLDERS.summary, placeholders);
  if (!text) {
    return null;
  }
  return <p className="whitespace-pre-wrap">{text}</p>;
}

function ExperienceItem({
  entry,
  placeholders,
  dateFormat,
}: {
  entry: ExperienceEntry;
  placeholders: boolean;
  dateFormat: DateFormat;
}): ReactElement {
  const heading = experienceHeading(entry, placeholders);
  const dates = formatDateRange(
    entry.startDate,
    entry.endDate,
    entry.current,
    dateFormat,
  );
  return (
    <article className="mb-[var(--resume-entry-gap)] last:mb-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
        <h3 className="font-semibold">{heading}</h3>
        {dates ? (
          <p className="text-[length:var(--resume-meta)] opacity-80">{dates}</p>
        ) : null}
      </div>
      {entry.location.trim() ? (
        <p className="text-[length:var(--resume-meta)] opacity-80">{entry.location}</p>
      ) : null}
      <HtmlBulletList items={nonemptyBullets(entry.bullets)} />
    </article>
  );
}

export function HtmlExperienceList({
  resume,
  placeholders,
  dateFormat,
}: {
  resume: Resume;
  placeholders: boolean;
  dateFormat: DateFormat;
}): ReactElement {
  const entries =
    resume.experience.entries.length > 0
      ? resume.experience.entries
      : placeholders
        ? [placeholderExperience()]
        : [];
  return (
    <div>
      {entries.map((entry) => (
        <ExperienceItem
          key={entry.id}
          entry={entry}
          placeholders={placeholders}
          dateFormat={dateFormat}
        />
      ))}
    </div>
  );
}

function EducationItem({
  entry,
  placeholders,
  dateFormat,
}: {
  entry: EducationEntry;
  placeholders: boolean;
  dateFormat: DateFormat;
}): ReactElement {
  const heading = educationHeading(entry, placeholders);
  const dates = formatDateRange(entry.startDate, entry.endDate, false, dateFormat);
  return (
    <article className="mb-[var(--resume-entry-gap)] last:mb-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
        <h3 className="font-semibold">{heading}</h3>
        {dates ? (
          <p className="text-[length:var(--resume-meta)] opacity-80">{dates}</p>
        ) : null}
      </div>
      {entry.location.trim() ? (
        <p className="text-[length:var(--resume-meta)] opacity-80">{entry.location}</p>
      ) : null}
      {entry.gpa.trim() ? (
        <p className="text-[length:var(--resume-meta)] opacity-80">GPA {entry.gpa}</p>
      ) : null}
      <HtmlBulletList items={nonemptyBullets(entry.bullets)} />
    </article>
  );
}

export function HtmlEducationList({
  resume,
  placeholders,
  dateFormat,
}: {
  resume: Resume;
  placeholders: boolean;
  dateFormat: DateFormat;
}): ReactElement {
  const entries =
    resume.education.entries.length > 0
      ? resume.education.entries
      : placeholders
        ? [placeholderEducation()]
        : [];
  return (
    <div>
      {entries.map((entry) => (
        <EducationItem
          key={entry.id}
          entry={entry}
          placeholders={placeholders}
          dateFormat={dateFormat}
        />
      ))}
    </div>
  );
}

export function HtmlSkillsList({
  groups,
  placeholders,
}: {
  groups: SkillGroup[];
  placeholders: boolean;
}): ReactElement {
  const visible =
    groups.length > 0
      ? groups
      : placeholders
        ? [placeholderSkills()]
        : [];
  return (
    <div className="space-y-1.5">
      {visible.map((group) => (
        <p key={group.id}>
          {group.category.trim() ? (
            <span className="font-semibold">{group.category}: </span>
          ) : null}
          {group.skills.filter((skill) => skill.trim()).join(" · ") ||
            (placeholders ? "Skill one · Skill two" : "")}
        </p>
      ))}
    </div>
  );
}

function placeholderExperience(): ExperienceEntry {
  return {
    id: "placeholder-exp",
    title: PLACEHOLDERS.title,
    company: PLACEHOLDERS.company,
    location: PLACEHOLDERS.location,
    startDate: "",
    endDate: "",
    current: true,
    bullets: ["Describe an impact you had in this role."],
  };
}

function placeholderEducation(): EducationEntry {
  return {
    id: "placeholder-edu",
    degree: PLACEHOLDERS.degree,
    school: PLACEHOLDERS.school,
    location: PLACEHOLDERS.location,
    startDate: "",
    endDate: "",
    gpa: "",
    bullets: [],
  };
}

function placeholderSkills(): SkillGroup {
  return {
    id: "placeholder-skills",
    category: "Skills",
    skills: ["Skill one", "Skill two", "Skill three"],
  };
}
