import type { TemplateDefinition } from "../types";

import { MinimalHtml } from "./minimal-html";
import { MinimalPdf } from "./minimal-pdf";

export const minimalTemplate: TemplateDefinition = {
  id: "minimal",
  name: "Minimal",
  description: "Single-column layout with generous whitespace and light headings.",
  thumbnail: "/templates/minimal.svg",
  tier: "free",
  columns: 1,
  render: (resume, settings) => MinimalHtml({ resume, settings }),
  renderPdf: (resume, settings) => MinimalPdf({ resume, settings }),
};
