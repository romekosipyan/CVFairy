import type { ReactElement } from "react";
import type { DocumentProps } from "@react-pdf/renderer";

import type { Resume, ResumeSettings, TemplateId } from "@/lib/schemas";

export type TemplateTier = "free" | "pro";

export interface TemplateDefinition {
  id: TemplateId;
  name: string;
  description: string;
  thumbnail: string;
  tier: TemplateTier;
  columns: 1 | 2;
  render: (resume: Resume, settings: ResumeSettings) => ReactElement;
  renderPdf: (resume: Resume, settings: ResumeSettings) => ReactElement<DocumentProps>;
}
