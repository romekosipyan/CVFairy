import {
  AlignmentType,
  Document,
  HeadingLevel,
  LevelFormat,
  Packer,
  Paragraph,
  Tab,
  TabStopPosition,
  TabStopType,
  TextRun,
} from "docx";

import {
  contactItems,
  educationHeading,
  experienceHeading,
  formatDateRange,
  nonemptyBullets,
} from "@/templates/shared/format";

import type { Resume, ResumeSettings } from "@/lib/schemas";
import type { ExportEngine } from "./types";

const TWIPS_INCH = 1440;

function pageTwips(pageSize: "a4" | "letter"): { width: number; height: number } {
  if (pageSize === "a4") {
    return { width: 11906, height: 16838 };
  }
  return { width: 12240, height: 15840 };
}

function hex(color: string): string {
  return color.replace("#", "").toUpperCase();
}

function heading(text: string, color: string): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 80 },
    border: {
      bottom: { color: hex(color), space: 1, style: "single", size: 6 },
    },
    children: [new TextRun({ text, bold: true, color: hex(color), size: 22 })],
  });
}

function buildChildren(resume: Resume, settings: ResumeSettings): Paragraph[] {
  const name = resume.personalInfo.fullName.trim() || "Resume";
  const contacts = contactItems(resume.personalInfo, false);
  const children: Paragraph[] = [
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      children: [
        new TextRun({
          text: name,
          bold: true,
          color: hex(settings.accentColor),
          size: 36,
        }),
      ],
    }),
  ];
  if (contacts.length > 0) {
    children.push(
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: contacts.map((item) => item.label).join("  ·  "),
            size: 18,
            color: "4B5563",
          }),
        ],
      }),
    );
  }
  for (const sectionId of resume.sectionOrder) {
    children.push(...sectionParagraphs(sectionId, resume, settings));
  }
  return children;
}

function sectionParagraphs(
  sectionId: Resume["sectionOrder"][number],
  resume: Resume,
  settings: ResumeSettings,
): Paragraph[] {
  if (sectionId === "summary" && resume.summary.content.trim()) {
    return [
      heading("Summary", settings.accentColor),
      new Paragraph({ children: [new TextRun({ text: resume.summary.content, size: 22 })] }),
    ];
  }
  if (sectionId === "experience" && resume.experience.entries.length > 0) {
    return [
      heading("Experience", settings.accentColor),
      ...resume.experience.entries.flatMap((entry) => {
        const dates = formatDateRange(
          entry.startDate,
          entry.endDate,
          entry.current,
          settings.dateFormat,
        );
        return [
          new Paragraph({
            tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
            children: [
              new TextRun({ text: experienceHeading(entry, false), bold: true, size: 22 }),
              ...(dates
                ? [new TextRun({ children: [new Tab(), dates], size: 20 })]
                : []),
            ],
          }),
          ...nonemptyBullets(entry.bullets).map(
            (bullet) =>
              new Paragraph({
                numbering: { reference: "resume-bullets", level: 0 },
                children: [new TextRun({ text: bullet, size: 22 })],
              }),
          ),
        ];
      }),
    ];
  }
  if (sectionId === "education" && resume.education.entries.length > 0) {
    return [
      heading("Education", settings.accentColor),
      ...resume.education.entries.map(
        (entry) =>
          new Paragraph({
            tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
            children: [
              new TextRun({ text: educationHeading(entry, false), bold: true, size: 22 }),
              ...(formatDateRange(entry.startDate, entry.endDate, false, settings.dateFormat)
                ? [
                    new TextRun({
                      children: [
                        new Tab(),
                        formatDateRange(
                          entry.startDate,
                          entry.endDate,
                          false,
                          settings.dateFormat,
                        ),
                      ],
                      size: 20,
                    }),
                  ]
                : []),
            ],
          }),
      ),
    ];
  }
  if (sectionId === "skills" && resume.skills.groups.length > 0) {
    return [
      heading("Skills", settings.accentColor),
      ...resume.skills.groups.map(
        (group) =>
          new Paragraph({
            children: [
              new TextRun({
                text: group.category.trim()
                  ? `${group.category}: ${group.skills.filter((skill) => skill.trim()).join(", ")}`
                  : group.skills.filter((skill) => skill.trim()).join(", "),
                size: 22,
              }),
            ],
          }),
      ),
    ];
  }
  return [];
}

export const docxEngine: ExportEngine = {
  async export(resume, settings, options) {
    const size = pageTwips(options.pageSize);
    const doc = new Document({
      creator: "CVFairy",
      title: resume.personalInfo.fullName.trim() || "Resume",
      numbering: {
        config: [
          {
            reference: "resume-bullets",
            levels: [
              {
                level: 0,
                format: LevelFormat.BULLET,
                text: "\u2022",
                alignment: AlignmentType.LEFT,
                style: { paragraph: { indent: { left: 360, hanging: 180 } } },
              },
            ],
          },
        ],
      },
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: TWIPS_INCH / 2,
                right: TWIPS_INCH / 2,
                bottom: TWIPS_INCH / 2,
                left: TWIPS_INCH / 2,
              },
              size,
            },
          },
          children: buildChildren(resume, settings),
        },
      ],
    });
    try {
      return await Packer.toBlob(doc);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to generate DOCX";
      throw new Error(message);
    }
  },
};
