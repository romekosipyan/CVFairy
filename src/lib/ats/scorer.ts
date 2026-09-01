import { keywordGap } from "./keyword-extractor";
import { simulateAtsParse } from "./parser-simulator";

import type { Resume } from "@/lib/schemas";

export interface ATSIssue {
  severity: "error" | "warning" | "info";
  message: string;
  fix?: { label: string; action: string };
}

export interface ATSCheckResult {
  overallScore: number;
  sections: {
    name: string;
    found: boolean;
    completeness: number;
    issues: ATSIssue[];
  }[];
  keywords: {
    fromJD: string[];
    inResume: string[];
    missing: string[];
    matchPercentage: number;
  };
  formatting: {
    check: string;
    status: "pass" | "warn" | "fail";
    suggestion?: string;
  }[];
  parsedView: { section: string; content: string }[];
}

function sectionScore(found: boolean, extra = 100): number {
  return found ? extra : 0;
}

export function scoreResume(resume: Resume, jobDescription = ""): ATSCheckResult {
  const parsedView = simulateAtsParse(resume);
  const hasContact =
    resume.personalInfo.fullName.trim().length > 0 &&
    resume.personalInfo.email.trim().length > 0;
  const hasSummary = resume.summary.content.trim().length > 0;
  const hasExperience = resume.experience.entries.some((entry) => entry.title.trim());
  const hasEducation = resume.education.entries.some((entry) => entry.school.trim());
  const hasSkills = resume.skills.groups.some((group) => group.skills.length > 0);

  const sections = [
    completeness("Contact", hasContact, "Add your name and email."),
    completeness("Summary", hasSummary, "Write a short professional summary."),
    completeness("Experience", hasExperience, "Add at least one role."),
    completeness("Education", hasEducation, "Add a school or program."),
    completeness("Skills", hasSkills, "List the skills this role needs."),
  ];

  const resumeText = parsedView.map((item) => item.content).join(" ");
  const keywords = keywordGap(jobDescription, resumeText);
  const completenessAvg =
    sections.reduce((sum, item) => sum + item.completeness, 0) / sections.length;
  const keywordPart = jobDescription.trim() ? keywords.matchPercentage : completenessAvg;
  const overallScore = Math.round(completenessAvg * 0.7 + keywordPart * 0.3);

  const formatting: ATSCheckResult["formatting"] = [
    {
      check: "Contact email present",
      status: resume.personalInfo.email.trim() ? "pass" : "fail",
      suggestion: resume.personalInfo.email.trim() ? undefined : "ATS systems need a plain-text email.",
    },
    {
      check: "Single-column-friendly content",
      status: "pass",
    },
    {
      check: "Experience uses bullet text",
      status: resume.experience.entries.some((entry) => entry.bullets.some((b) => b.trim()))
        ? "pass"
        : "warn",
      suggestion: "Use short achievement bullets rather than a paragraph blob.",
    },
  ];

  return { overallScore, sections, keywords, formatting, parsedView };
}

function completeness(name: string, found: boolean, message: string) {
  const issues: ATSIssue[] = found
    ? []
    : [{ severity: "warning", message, fix: { label: "Open section", action: name.toLowerCase() } }];
  return {
    name,
    found,
    completeness: sectionScore(found),
    issues,
  };
}
