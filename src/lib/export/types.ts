import type { Resume, ResumeSettings } from "@/lib/schemas";

export type ExportFormat = "pdf" | "docx" | "html" | "markdown" | "txt" | "json";

export interface ExportOptions {
  format: ExportFormat;
  pageSize: "a4" | "letter";
  filename?: string;
}

export interface ExportEngine {
  export(
    resume: Resume,
    settings: ResumeSettings,
    options: ExportOptions,
  ): Promise<Blob>;
}

const UNSAFE_FILENAME = /[<>:"/\\|?*\u0000-\u001f]/g;

export function sanitizeFilename(name: string): string {
  const cleaned = name.replace(UNSAFE_FILENAME, "").replace(/\s+/g, "_").trim();
  return cleaned || "Resume";
}

export function defaultExportFilename(resume: Resume, extension: string): string {
  const base = sanitizeFilename(resume.personalInfo.fullName || "Resume");
  return `${base}_Resume.${extension}`;
}

export const EXPORT_MIME: Record<ExportFormat, string> = {
  pdf: "application/pdf",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  html: "text/html",
  markdown: "text/markdown",
  txt: "text/plain",
  json: "application/json",
};

export const EXPORT_EXTENSION: Record<ExportFormat, string> = {
  pdf: "pdf",
  docx: "docx",
  html: "html",
  markdown: "md",
  txt: "txt",
  json: "json",
};
