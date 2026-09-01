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

export function ClassicHtml({
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
    <ResumePage settings={settings}>
      <header className="mb-[var(--resume-section-gap)]">
        <h1
          className="font-bold tracking-tight"
          style={{ fontSize: "var(--resume-name)", color: settings.accentColor }}
        >
          {name}
        </h1>
        {contacts.length > 0 ? (
          <p className="mt-1 text-[length:var(--resume-meta)] opacity-80">
            {contacts.map((item) => item.label).join(" · ")}
          </p>
        ) : null}
      </header>
      {resume.sectionOrder.map((sectionId) => (
        <ClassicSection
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

function ClassicSection({
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
        />
        <HtmlSkillsList groups={resume.skills.groups} placeholders={placeholders} />
      </section>
    );
  }
  return null;
}
