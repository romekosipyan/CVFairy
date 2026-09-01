import type { TemplateId } from "@/lib/schemas";
import type { TemplateTier } from "./types";

export interface TemplateCatalogEntry {
  id: TemplateId;
  name: string;
  description: string;
  thumbnail: string;
  tier: TemplateTier;
  columns: 1 | 2;
}

export const TEMPLATE_CATALOG: TemplateCatalogEntry[] = [
  {
    id: "classic",
    name: "Classic",
    description: "Single-column, traditional layout that parses cleanly in ATS software.",
    thumbnail: "/templates/classic.svg",
    tier: "free",
    columns: 1,
  },
  {
    id: "modern",
    name: "Modern",
    description: "Two-column layout with a bold sidebar for contact and skills.",
    thumbnail: "/templates/modern.svg",
    tier: "free",
    columns: 2,
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Single-column layout with generous whitespace and light headings.",
    thumbnail: "/templates/minimal.svg",
    tier: "free",
    columns: 1,
  },
];
