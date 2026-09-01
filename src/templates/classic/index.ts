import type { TemplateDefinition } from "../types";

import { ClassicHtml } from "./classic-html";
import { ClassicPdf } from "./classic-pdf";

export const classicTemplate: TemplateDefinition = {
  id: "classic",
  name: "Classic",
  description: "Single-column, traditional layout that parses cleanly in ATS software.",
  thumbnail: "/templates/classic.svg",
  tier: "free",
  columns: 1,
  render: (resume, settings) => ClassicHtml({ resume, settings }),
  renderPdf: (resume, settings) => ClassicPdf({ resume, settings }),
};
