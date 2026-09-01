import type { TemplateId } from "@/lib/schemas";

import { classicTemplate } from "./classic";
import { TEMPLATE_CATALOG } from "./catalog";
import { minimalTemplate } from "./minimal";
import { modernTemplate } from "./modern";
import type { TemplateDefinition } from "./types";

const TEMPLATES: Record<TemplateId, TemplateDefinition> = {
  classic: classicTemplate,
  modern: modernTemplate,
  minimal: minimalTemplate,
};

export function listTemplates(): TemplateDefinition[] {
  return TEMPLATE_CATALOG.map((entry) => TEMPLATES[entry.id]);
}

export function getTemplate(id: TemplateId): TemplateDefinition {
  return TEMPLATES[id];
}

export { classicTemplate, modernTemplate, minimalTemplate };
export { TEMPLATE_CATALOG } from "./catalog";
export type { TemplateDefinition } from "./types";
