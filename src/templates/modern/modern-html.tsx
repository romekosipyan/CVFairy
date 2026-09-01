import type { ReactElement } from "react";
import type { Resume, ResumeSettings, SectionId } from "@/lib/schemas";

import {
  contactItems,
  displayOrPlaceholder,
  hasEducation,
  hasExperience,
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

export function ModernHtml({
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
  const photo = resume.personalInfo.photoUrl.trim();

  return (
    <ResumePage settings={settings} className="!p-0">
      <div className="flex min-h-[inherit]">
        <aside
          className="w-[32%] box-border px-4 py-6 text-white"
          style={{ backgroundColor: settings.accentColor }}
        >
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photo}
              alt=""
              className="mb-4 size-24 rounded-full object-cover"
            />
          ) : null}
          <p className="text-[length:var(--resume-heading)] font-semibold uppercase tracking-wide">
            Contact
          </p>
          <ul className="mt-2 space-y-1 text-[length:var(--resume-meta)]">
            {contacts.map((item) => (
              <li key={item.label}>{item.label}</li>
            ))}
          </ul>
          <p className="mt-6 text-[length:var(--resume-heading)] font-semibold uppercase tracking-wide">
            Skills
          </p>
          <div className="mt-2 text-[length:var(--resume-meta)]">
            <HtmlSkillsList groups={resume.skills.groups} placeholders={placeholders} />
          </div>
        </aside>
        <div className="w-[68%] box-border px-5 py-6">
          <h1
            className="mb-4 font-bold tracking-tight"
            style={{ fontSize: "var(--resume-name)" }}
          >
            {name}
          </h1>
          {resume.sectionOrder
            .filter((id) => id !== "skills")
            .map((sectionId) => (
              <ModernMainSection
                key={sectionId}
                sectionId={sectionId}
                resume={resume}
                settings={settings}
                placeholders={placeholders}
              />
            ))}
        </div>
      </div>
    </ResumePage>
  );
}

function ModernMainSection({
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
  return null;
}
