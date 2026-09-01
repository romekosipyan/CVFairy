import { pdf } from "@react-pdf/renderer";

import { getTemplate } from "@/templates/registry";

import type { ExportEngine } from "./types";

export const pdfEngine: ExportEngine = {
  async export(resume, settings, options) {
    const template = getTemplate(settings.templateId);
    const document = template.renderPdf(resume, {
      ...settings,
      pageSize: options.pageSize,
    });
    try {
      return await pdf(document).toBlob();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to generate PDF";
      throw new Error(message);
    }
  },
};
