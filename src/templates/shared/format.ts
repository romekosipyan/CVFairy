import type { DateFormat, PersonalInfo, Resume } from "@/lib/schemas";
import type { EducationEntry } from "@/lib/schemas/education";
import type { ExperienceEntry } from "@/lib/schemas/experience";

const MONTHS_LONG = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

export const PLACEHOLDERS = {
  fullName: "Your name here",
  email: "you@email.com",
  phone: "Phone",
  location: "City, Country",
  title: "Job title",
  company: "Company",
  degree: "Degree",
  school: "School",
  summary: "A short professional summary will appear here.",
} as const;

export function formatResumeDate(value: string, format: DateFormat): string {
  if (!value) {
    return "";
  }
  const [year, month] = value.split("-");
  if (!year) {
    return value;
  }
  const monthIndex = Number(month) - 1;
  const validMonth = monthIndex >= 0 && monthIndex < 12;
  if (format === "YYYY-MM") {
    return validMonth ? `${year}-${month}` : year;
  }
  if (!validMonth) {
    return year;
  }
  if (format === "MM/YYYY") {
    return `${month}/${year}`;
  }
  if (format === "Month YYYY") {
    return `${MONTHS_LONG[monthIndex]} ${year}`;
  }
  return `${MONTHS_SHORT[monthIndex]} ${year}`;
}

export function formatDateRange(
  startDate: string,
  endDate: string,
  current: boolean,
  format: DateFormat,
): string {
  const start = formatResumeDate(startDate, format);
  if (!start && !endDate && !current) {
    return "";
  }
  const end = current ? "Present" : formatResumeDate(endDate, format);
  if (start && end) {
    return `${start} – ${end}`;
  }
  return start || end;
}

export function displayOrPlaceholder(
  value: string,
  placeholder: string,
  usePlaceholder: boolean,
): string {
  const trimmed = value.trim();
  if (trimmed) {
    return trimmed;
  }
  return usePlaceholder ? placeholder : "";
}

export function isResumeBlank(resume: Resume): boolean {
  const info = resume.personalInfo;
  return (
    !info.fullName.trim() &&
    !info.email.trim() &&
    !info.phone.trim() &&
    !info.location.trim() &&
    !info.linkedin.trim() &&
    !info.website.trim() &&
    !resume.summary.content.trim() &&
    resume.experience.entries.length === 0 &&
    resume.education.entries.length === 0 &&
    resume.skills.groups.length === 0
  );
}

export function hasSummary(resume: Resume, placeholders: boolean): boolean {
  return placeholders || resume.summary.content.trim().length > 0;
}

export function hasExperience(resume: Resume, placeholders: boolean): boolean {
  return placeholders || resume.experience.entries.length > 0;
}

export function hasEducation(resume: Resume, placeholders: boolean): boolean {
  return placeholders || resume.education.entries.length > 0;
}

export function hasSkills(resume: Resume, placeholders: boolean): boolean {
  return placeholders || resume.skills.groups.some((group) => group.skills.length > 0);
}

export interface ContactItem {
  label: string;
  href?: string;
}

export function contactItems(
  info: PersonalInfo,
  placeholders: boolean,
): ContactItem[] {
  const items: ContactItem[] = [];
  const email = displayOrPlaceholder(info.email, PLACEHOLDERS.email, placeholders);
  const phone = displayOrPlaceholder(info.phone, PLACEHOLDERS.phone, placeholders);
  const location = displayOrPlaceholder(
    info.location,
    PLACEHOLDERS.location,
    placeholders,
  );
  if (email) {
    items.push({ label: email, href: `mailto:${email}` });
  }
  if (phone) {
    items.push({ label: phone });
  }
  if (location) {
    items.push({ label: location });
  }
  if (info.linkedin.trim()) {
    items.push({ label: stripUrl(info.linkedin), href: info.linkedin });
  }
  if (info.website.trim()) {
    items.push({ label: stripUrl(info.website), href: info.website });
  }
  return items;
}

export function stripUrl(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export function experienceHeading(entry: ExperienceEntry, placeholders: boolean): string {
  const title = displayOrPlaceholder(entry.title, PLACEHOLDERS.title, placeholders);
  const company = displayOrPlaceholder(
    entry.company,
    PLACEHOLDERS.company,
    placeholders,
  );
  if (title && company) {
    return `${title} · ${company}`;
  }
  return title || company;
}

export function educationHeading(entry: EducationEntry, placeholders: boolean): string {
  const degree = displayOrPlaceholder(entry.degree, PLACEHOLDERS.degree, placeholders);
  const school = displayOrPlaceholder(entry.school, PLACEHOLDERS.school, placeholders);
  if (degree && school) {
    return `${degree} · ${school}`;
  }
  return degree || school;
}

export function nonemptyBullets(bullets: string[]): string[] {
  return bullets.map((item) => item.trim()).filter((item) => item.length > 0);
}
