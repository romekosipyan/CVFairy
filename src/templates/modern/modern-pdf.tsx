import { Document, Page, Text, View } from "@react-pdf/renderer";

import type { ReactElement } from "react";
import type { DocumentProps } from "@react-pdf/renderer";
import type { Resume, ResumeSettings, SectionId } from "@/lib/schemas";

import { deriveTemplateConfig } from "../shared/config";
import {
  contactItems,
  displayOrPlaceholder,
  hasEducation,
  hasExperience,
  hasSummary,
  isResumeBlank,
  PLACEHOLDERS,
} from "../shared/format";
import { createPdfStyles, PdfSectionHeading } from "../shared/pdf-primitives";
import {
  PdfEducationList,
  PdfExperienceList,
  PdfSkillsList,
  PdfSummaryText,
} from "../shared/pdf-sections";

export function ModernPdf({
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
    <Document title={name} author={name} subject="Resume">
      <Page size={config.pdfPage} style={{ flexDirection: "row", fontFamily: "Helvetica" }}>
        <View style={styles.sidebar}>
          <Text style={styles.sidebarHeading}>Contact</Text>
          {contacts.map((item) => (
            <Text key={item.label} style={styles.sidebarText}>
              {item.label}
            </Text>
          ))}
          <Text style={styles.sidebarHeading}>Skills</Text>
          <PdfSkillsList
            groups={resume.skills.groups}
            placeholders={placeholders}
            styles={styles}
            inverted
          />
        </View>
        <View style={styles.main}>
          <Text style={[styles.name, { color: "#111827", marginBottom: 12 }]}>{name}</Text>
          {resume.sectionOrder
            .filter((id) => id !== "skills")
            .map((sectionId) => (
              <ModernPdfSection
                key={sectionId}
                sectionId={sectionId}
                resume={resume}
                settings={settings}
                placeholders={placeholders}
                styles={styles}
              />
            ))}
        </View>
      </Page>
    </Document>
  );
}

function ModernPdfSection({
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
  return null;
}
