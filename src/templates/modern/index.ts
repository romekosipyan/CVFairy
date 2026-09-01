import type { TemplateDefinition } from "../types";

import { ModernHtml } from "./modern-html";
import { ModernPdf } from "./modern-pdf";

export const modernTemplate: TemplateDefinition = {
  id: "modern",
  name: "Modern",
  description: "Two-column layout with a bold sidebar for contact and skills.",
  thumbnail: "/templates/modern.svg",
  tier: "free",
  columns: 2,
  render: (resume, settings) => ModernHtml({ resume, settings }),
  renderPdf: (resume, settings) => ModernPdf({ resume, settings }),
};
