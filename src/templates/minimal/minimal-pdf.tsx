import { Text, View } from "@react-pdf/renderer";

import type { ReactElement } from "react";
import type { DocumentProps } from "@react-pdf/renderer";
import type { Resume, ResumeSettings, SectionId } from "@/lib/schemas";

import { deriveTemplateConfig } from "../shared/config";
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
import { createPdfStyles, PdfContactLine, PdfDocument, PdfSectionHeading } from "../shared/pdf-primitives";
import {
  PdfEducationList,
  PdfExperienceList,
  PdfSkillsList,
  PdfSummaryText,
} from "../shared/pdf-sections";

export function MinimalPdf({
  resume,
  settings,
}: {
  resume: Resume;
  settings: ResumeSettings;
}): ReactElement<DocumentProps> {
  const placeholders = isResumeBlank(resume);
  const config = deriveTemplateConfig(settings);
  const styles = createPdfStyles(config);
  const name = displayOrPlaceholder(
    resume.personalInfo.fullName,
    PLACEHOLDERS.fullName,
    placeholders,
  );
  const contacts = contactItems(resume.personalInfo, placeholders);

  return (
    <PdfDocument settings={settings} title={name}>
      <View style={[styles.section, { alignItems: "center", marginBottom: 18 }]}>
        <Text
          style={[
            styles.name,
            { textTransform: "uppercase", letterSpacing: 3, fontFamily: "Helvetica" },
          ]}
        >
          {name}
        </Text>
        <PdfContactLine items={contacts} styles={styles} />
      </View>
      {resume.sectionOrder.map((sectionId) => (
        <MinimalPdfSection
          key={sectionId}
          sectionId={sectionId}
          resume={resume}
          settings={settings}
          placeholders={placeholders}
          styles={styles}
        />
      ))}
    </PdfDocument>
  );
}

function MinimalPdfSection({
  sectionId,
  resume,
  settings,
  placeholders,
  styles,
}: {
  sectionId: SectionId;
  resume: Resume;
  settings: ResumeSettings;
  placeholders: boolean;
  styles: ReturnType<typeof createPdfStyles>;
}): ReactElement | null {
  if (sectionId === "summary" && hasSummary(resume, placeholders)) {
    return (
      <View style={styles.section}>
        <PdfSectionHeading
          title="Summary"
          separator={settings.sectionSeparator}
          styles={styles}
        />
        <PdfSummaryText content={resume.summary.content} placeholders={placeholders} />
      </View>
    );
  }
  if (sectionId === "experience" && hasExperience(resume, placeholders)) {
    return (
      <View style={styles.section}>
        <PdfSectionHeading
          title="Experience"
          separator={settings.sectionSeparator}
          styles={styles}
        />
        <PdfExperienceList
          resume={resume}
          placeholders={placeholders}
          dateFormat={settings.dateFormat}
          styles={styles}
        />
      </View>
    );
  }
  if (sectionId === "education" && hasEducation(resume, placeholders)) {
    return (
      <View style={styles.section}>
        <PdfSectionHeading
          title="Education"
          separator={settings.sectionSeparator}
          styles={styles}
        />
        <PdfEducationList
          resume={resume}
          placeholders={placeholders}
          dateFormat={settings.dateFormat}
          styles={styles}
        />
      </View>
    );
  }
  if (sectionId === "skills" && hasSkills(resume, placeholders)) {
    return (
      <View style={styles.section}>
        <PdfSectionHeading
          title="Skills"
          separator={settings.sectionSeparator}
          styles={styles}
        />
        <PdfSkillsList
          groups={resume.skills.groups}
          placeholders={placeholders}
          styles={styles}
        />
      </View>
    );
  }
  return null;
}
