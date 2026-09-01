import type { Resume } from "@/lib/schemas";

export interface ParsedSection {
  section: string;
  content: string;
}

export function simulateAtsParse(resume: Resume): ParsedSection[] {
  const personal = [
    resume.personalInfo.fullName,
    resume.personalInfo.email,
    resume.personalInfo.phone,
    resume.personalInfo.location,
    resume.personalInfo.linkedin,
    resume.personalInfo.website,
  ]
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

  const experience = resume.experience.entries
    .map((entry) => {
      const heading = [entry.title, entry.company, entry.location]
        .filter((item) => item.trim())
        .join(" | ");
      const bullets = entry.bullets.filter((item) => item.trim()).join(" ");
      return [heading, bullets].filter(Boolean).join(". ");
    })
    .filter(Boolean);

  const education = resume.education.entries
    .map((entry) =>
      [entry.degree, entry.school, entry.location, entry.gpa]
        .filter((item) => item.trim())
        .join(" | "),
    )
    .filter(Boolean);

  const skills = resume.skills.groups
    .map((group) => {
      const list = group.skills.filter((item) => item.trim()).join(", ");
      return group.category.trim() ? `${group.category}: ${list}` : list;
    })
    .filter(Boolean);

  return [
    { section: "Contact", content: personal.join(" · ") },
    { section: "Summary", content: resume.summary.content.trim() },
    { section: "Experience", content: experience.join("\n") },
    { section: "Education", content: education.join("\n") },
    { section: "Skills", content: skills.join("\n") },
  ];
}
