import { downloadBlob } from "@/lib/utils/download";

import { docxEngine } from "./docx-engine";
import { htmlEngine } from "./html-engine";
import { jsonEngine } from "./json-engine";
import { markdownEngine, textEngine } from "./markdown-engine";
import { pdfEngine } from "./pdf-engine";
import {
  defaultExportFilename,
  EXPORT_EXTENSION,
  type ExportEngine,
  type ExportFormat,
  type ExportOptions,
} from "./types";

import type { Resume, ResumeSettings } from "@/lib/schemas";

const ENGINES: Record<ExportFormat, ExportEngine> = {
  pdf: pdfEngine,
  docx: docxEngine,
  html: htmlEngine,
  markdown: markdownEngine,
  txt: textEngine,
  json: jsonEngine,
};

export async function exportResume(
  resume: Resume,
  settings: ResumeSettings,
  options: ExportOptions,
): Promise<Blob> {
  const engine = ENGINES[options.format];
  return engine.export(resume, settings, options);
}

export async function downloadResumeExport(
  resume: Resume,
  settings: ResumeSettings,
  format: ExportFormat,
): Promise<void> {
  const blob = await exportResume(resume, settings, {
    format,
    pageSize: settings.pageSize,
  });
  const filename = defaultExportFilename(resume, EXPORT_EXTENSION[format]);
  downloadBlob(blob, filename);
}

export type { ExportEngine, ExportFormat, ExportOptions } from "./types";
