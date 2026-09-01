import { Text, View } from "@react-pdf/renderer";

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
import { PdfBullets, type PdfStyles } from "./pdf-primitives";

export function PdfSummaryText({
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
  return <Text>{text}</Text>;
}

export function PdfExperienceList({
  resume,
  placeholders,
  dateFormat,
  styles,
}: {
  resume: Resume;
  placeholders: boolean;
  dateFormat: DateFormat;
  styles: PdfStyles;
}): ReactElement {
  const entries =
    resume.experience.entries.length > 0
      ? resume.experience.entries
      : placeholders
        ? [placeholderExperience()]
        : [];
  return (
    <View>
      {entries.map((entry) => (
        <PdfExperienceItem
          key={entry.id}
          entry={entry}
          placeholders={placeholders}
          dateFormat={dateFormat}
          styles={styles}
        />
      ))}
    </View>
  );
}

function PdfExperienceItem({
  entry,
  placeholders,
  dateFormat,
  styles,
}: {
  entry: ExperienceEntry;
  placeholders: boolean;
  dateFormat: DateFormat;
  styles: PdfStyles;
}): ReactElement {
  const heading = experienceHeading(entry, placeholders);
  const dates = formatDateRange(
    entry.startDate,
    entry.endDate,
    entry.current,
    dateFormat,
  );
  return (
    <View style={styles.entry} wrap={false}>
      <View style={styles.row}>
        <Text style={{ fontFamily: "Helvetica-Bold" }}>{heading}</Text>
        {dates ? <Text style={styles.meta}>{dates}</Text> : null}
      </View>
      {entry.location.trim() ? (
        <Text style={styles.meta}>{entry.location}</Text>
      ) : null}
      <PdfBullets items={nonemptyBullets(entry.bullets)} styles={styles} />
    </View>
  );
}

export function PdfEducationList({
  resume,
  placeholders,
  dateFormat,
  styles,
}: {
  resume: Resume;
  placeholders: boolean;
  dateFormat: DateFormat;
  styles: PdfStyles;
}): ReactElement {
  const entries =
    resume.education.entries.length > 0
      ? resume.education.entries
      : placeholders
        ? [placeholderEducation()]
        : [];
  return (
    <View>
      {entries.map((entry) => (
        <PdfEducationItem
          key={entry.id}
          entry={entry}
          placeholders={placeholders}
          dateFormat={dateFormat}
          styles={styles}
        />
      ))}
    </View>
  );
}

function PdfEducationItem({
  entry,
  placeholders,
  dateFormat,
  styles,
}: {
  entry: EducationEntry;
  placeholders: boolean;
  dateFormat: DateFormat;
  styles: PdfStyles;
}): ReactElement {
  const heading = educationHeading(entry, placeholders);
  const dates = formatDateRange(entry.startDate, entry.endDate, false, dateFormat);
  return (
    <View style={styles.entry} wrap={false}>
      <View style={styles.row}>
        <Text style={{ fontFamily: "Helvetica-Bold" }}>{heading}</Text>
        {dates ? <Text style={styles.meta}>{dates}</Text> : null}
      </View>
      {entry.location.trim() ? (
        <Text style={styles.meta}>{entry.location}</Text>
      ) : null}
      {entry.gpa.trim() ? (
        <Text style={styles.meta}>GPA {entry.gpa}</Text>
      ) : null}
      <PdfBullets items={nonemptyBullets(entry.bullets)} styles={styles} />
    </View>
  );
}

export function PdfSkillsList({
  groups,
  placeholders,
  styles,
  inverted,
}: {
  groups: SkillGroup[];
  placeholders: boolean;
  styles: PdfStyles;
  inverted?: boolean;
}): ReactElement {
  const visible =
    groups.length > 0 ? groups : placeholders ? [placeholderSkills()] : [];
  const textStyle = inverted ? styles.sidebarText : undefined;
  return (
    <View>
      {visible.map((group) => {
        const skills =
          group.skills.filter((skill) => skill.trim()).join(" · ") ||
          (placeholders ? "Skill one · Skill two" : "");
        const label = group.category.trim();
        return (
          <Text key={group.id} style={textStyle}>
            {label ? `${label}: ${skills}` : skills}
          </Text>
        );
      })}
    </View>
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
