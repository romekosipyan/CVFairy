import { deriveTemplateConfig } from "@/templates/shared/config";
import {
  contactItems,
  educationHeading,
  experienceHeading,
  formatDateRange,
  nonemptyBullets,
} from "@/templates/shared/format";

import type { Resume, ResumeSettings } from "@/lib/schemas";
import type { ExportEngine } from "./types";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function sectionHtml(resume: Resume, settings: ResumeSettings): string {
  const parts: string[] = [];
  for (const sectionId of resume.sectionOrder) {
    if (sectionId === "summary" && resume.summary.content.trim()) {
      parts.push(
        `<section><h2>Summary</h2><p>${escapeHtml(resume.summary.content)}</p></section>`,
      );
    }
    if (sectionId === "experience") {
      parts.push(experienceHtml(resume, settings));
    }
    if (sectionId === "education") {
      parts.push(educationHtml(resume, settings));
    }
    if (sectionId === "skills") {
      parts.push(skillsHtml(resume));
    }
  }
  return parts.join("");
}

function experienceHtml(resume: Resume, settings: ResumeSettings): string {
  if (resume.experience.entries.length === 0) {
    return "";
  }
  const items = resume.experience.entries
    .map((entry) => {
      const dates = formatDateRange(
        entry.startDate,
        entry.endDate,
        entry.current,
        settings.dateFormat,
      );
      const bullets = nonemptyBullets(entry.bullets)
        .map((bullet) => `<li>${escapeHtml(bullet)}</li>`)
        .join("");
      return `<article><h3>${escapeHtml(experienceHeading(entry, false))}</h3>${
        dates ? `<p>${escapeHtml(dates)}</p>` : ""
      }${bullets ? `<ul>${bullets}</ul>` : ""}</article>`;
    })
    .join("");
  return `<section><h2>Experience</h2>${items}</section>`;
}

function educationHtml(resume: Resume, settings: ResumeSettings): string {
  if (resume.education.entries.length === 0) {
    return "";
  }
  const items = resume.education.entries
    .map((entry) => {
      const dates = formatDateRange(
        entry.startDate,
        entry.endDate,
        false,
        settings.dateFormat,
      );
      return `<article><h3>${escapeHtml(educationHeading(entry, false))}</h3>${
        dates ? `<p>${escapeHtml(dates)}</p>` : ""
      }</article>`;
    })
    .join("");
  return `<section><h2>Education</h2>${items}</section>`;
}

function skillsHtml(resume: Resume): string {
  if (resume.skills.groups.length === 0) {
    return "";
  }
  const items = resume.skills.groups
    .map((group) => {
      const skills = group.skills.filter((skill) => skill.trim()).join(", ");
      const label = group.category.trim() ? `${group.category}: ${skills}` : skills;
      return `<p>${escapeHtml(label)}</p>`;
    })
    .join("");
  return `<section><h2>Skills</h2>${items}</section>`;
}

export const htmlEngine: ExportEngine = {
  async export(resume, settings) {
    const config = deriveTemplateConfig(settings);
    const name = escapeHtml(resume.personalInfo.fullName.trim() || "Resume");
    const contacts = contactItems(resume.personalInfo, false)
      .map((item) => escapeHtml(item.label))
      .join(" · ");
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>${name}</title>
<style>
  body{margin:0;background:#f4f4f5;color:#1a1a1a;font-family:${config.cssFontFamily};}
  article.resume{width:${config.pageWidthMm}mm;min-height:${config.pageHeightMm}mm;margin:16px auto;padding:${config.pagePaddingMm}mm;background:#fff;font-size:${config.bodyFontPx}px;line-height:${config.lineHeight};}
  h1{color:${config.accentColor};font-size:${config.nameFontPx}px;margin:0 0 8px;}
  h2{color:${config.accentColor};font-size:${config.headingFontPx}px;text-transform:uppercase;border-bottom:1px solid ${config.accentColor};padding-bottom:4px;}
  h3{margin:0;}
</style>
</head>
<body>
<article class="resume">
  <header><h1>${name}</h1>${contacts ? `<p>${contacts}</p>` : ""}</header>
  ${sectionHtml(resume, settings)}
</article>
</body>
</html>`;
    return new Blob([html], { type: "text/html" });
  },
};
