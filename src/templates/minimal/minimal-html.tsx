import type { ReactElement } from "react";
import type { Resume, ResumeSettings, SectionId } from "@/lib/schemas";

import {
  contactItems,
  displayOrPlaceholder,
  hasEducation,
  hasExperience,
  hasSkills,
  hasSummary,
  isResumeBlank,
  PLACEHOLDERS,
} from "../shared/format";
import {
  HtmlEducationList,
  HtmlExperienceList,
  HtmlSkillsList,
  HtmlSummary,
} from "../shared/html-sections";
import { HtmlSectionHeading, ResumePage } from "../shared/resume-page";

export function MinimalHtml({
  resume,
  settings,
}: {
  resume: Resume;
  settings: ResumeSettings;
}): ReactElement {
  const placeholders = isResumeBlank(resume);
  const name = displayOrPlaceholder(
    resume.personalInfo.fullName,
    PLACEHOLDERS.fullName,
    placeholders,
  );
  const contacts = contactItems(resume.personalInfo, placeholders);

  return (
    <ResumePage settings={settings} className="tracking-wide">
      <header className="mb-[calc(var(--resume-section-gap)*1.4)] text-center">
        <h1
          className="font-normal tracking-[0.18em] uppercase"
          style={{ fontSize: "var(--resume-name)", color: settings.accentColor }}
        >
          {name}
        </h1>
        {contacts.length > 0 ? (
          <p className="mt-3 text-[length:var(--resume-meta)] tracking-normal opacity-70">
            {contacts.map((item) => item.label).join("  ·  ")}
          </p>
        ) : null}
      </header>
      {resume.sectionOrder.map((sectionId) => (
        <MinimalSection
          key={sectionId}
          sectionId={sectionId}
          resume={resume}
          settings={settings}
          placeholders={placeholders}
        />
      ))}
    </ResumePage>
  );
}

function MinimalSection({
  sectionId,
  resume,
  settings,
  placeholders,
}: {
  sectionId: SectionId;
  resume: Resume;
  settings: ResumeSettings;
  placeholders: boolean;
}): ReactElement | null {
  if (sectionId === "summary" && hasSummary(resume, placeholders)) {
    return (
      <section className="mb-[var(--resume-section-gap)]">
        <HtmlSectionHeading
          title="Summary"
          separator={settings.sectionSeparator}
          accent={settings.accentColor}
          className="font-normal tracking-[0.2em]"
        />
        <HtmlSummary content={resume.summary.content} placeholders={placeholders} />
      </section>
    );
  }
  if (sectionId === "experience" && hasExperience(resume, placeholders)) {
    return (
      <section className="mb-[var(--resume-section-gap)]">
        <HtmlSectionHeading
          title="Experience"
          separator={settings.sectionSeparator}
          accent={settings.accentColor}
          className="font-normal tracking-[0.2em]"
        />
        <HtmlExperienceList
          resume={resume}
          placeholders={placeholders}
          dateFormat={settings.dateFormat}
        />
      </section>
    );
  }
  if (sectionId === "education" && hasEducation(resume, placeholders)) {
    return (
      <section className="mb-[var(--resume-section-gap)]">
        <HtmlSectionHeading
          title="Education"
          separator={settings.sectionSeparator}
          accent={settings.accentColor}
          className="font-normal tracking-[0.2em]"
        />
        <HtmlEducationList
          resume={resume}
          placeholders={placeholders}
          dateFormat={settings.dateFormat}
        />
      </section>
    );
  }
  if (sectionId === "skills" && hasSkills(resume, placeholders)) {
    return (
      <section className="mb-[var(--resume-section-gap)]">
        <HtmlSectionHeading
          title="Skills"
          separator={settings.sectionSeparator}
          accent={settings.accentColor}
          className="font-normal tracking-[0.2em]"
        />
        <HtmlSkillsList groups={resume.skills.groups} placeholders={placeholders} />
      </section>
    );
  }
  return null;
}
