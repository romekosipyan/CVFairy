import {
  contactItems,
  educationHeading,
  experienceHeading,
  formatDateRange,
  nonemptyBullets,
} from "@/templates/shared/format";

import type { Resume, ResumeSettings } from "@/lib/schemas";
import type { ExportEngine } from "./types";

function markdownBody(resume: Resume, settings: ResumeSettings): string {
  const name = resume.personalInfo.fullName.trim() || "Resume";
  const contacts = contactItems(resume.personalInfo, false)
    .map((item) => item.label)
    .join(" · ");
  const lines = [`# ${name}`, ""];
  if (contacts) {
    lines.push(contacts, "");
  }
  for (const sectionId of resume.sectionOrder) {
    if (sectionId === "summary" && resume.summary.content.trim()) {
      lines.push("## Summary", "", resume.summary.content, "");
    }
    if (sectionId === "experience" && resume.experience.entries.length > 0) {
      lines.push("## Experience", "");
      for (const entry of resume.experience.entries) {
        const dates = formatDateRange(
          entry.startDate,
          entry.endDate,
          entry.current,
          settings.dateFormat,
        );
        lines.push(`### ${experienceHeading(entry, false)}`);
        if (dates) {
          lines.push(`*${dates}*`);
        }
        for (const bullet of nonemptyBullets(entry.bullets)) {
          lines.push(`- ${bullet}`);
        }
        lines.push("");
      }
    }
    if (sectionId === "education" && resume.education.entries.length > 0) {
      lines.push("## Education", "");
      for (const entry of resume.education.entries) {
        const dates = formatDateRange(
          entry.startDate,
          entry.endDate,
          false,
          settings.dateFormat,
        );
        lines.push(`### ${educationHeading(entry, false)}`);
        if (dates) {
          lines.push(`*${dates}*`);
        }
        lines.push("");
      }
    }
    if (sectionId === "skills" && resume.skills.groups.length > 0) {
      lines.push("## Skills", "");
      for (const group of resume.skills.groups) {
        const skills = group.skills.filter((skill) => skill.trim()).join(", ");
        lines.push(
          group.category.trim() ? `- **${group.category}:** ${skills}` : `- ${skills}`,
        );
      }
      lines.push("");
    }
  }
  return lines.join("\n");
}

export const markdownEngine: ExportEngine = {
  async export(resume, settings) {
    return new Blob([markdownBody(resume, settings)], { type: "text/markdown" });
  },
};

export const textEngine: ExportEngine = {
  async export(resume, settings) {
    const markdown = markdownBody(resume, settings)
      .replaceAll(/^#+\s/gm, "")
      .replaceAll("**", "")
      .replaceAll("*", "");
    return new Blob([markdown], { type: "text/plain" });
  },
};
