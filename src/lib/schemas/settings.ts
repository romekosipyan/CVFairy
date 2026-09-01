import { z } from "zod";

export const TEMPLATE_IDS = ["classic", "modern", "minimal"] as const;

export const FONT_FAMILIES = [
  "inter",
  "roboto",
  "lato",
  "montserrat",
  "opensans",
  "merriweather",
  "playfair",
  "raleway",
  "calibri",
  "garamond",
] as const;

export const FONT_SIZES = ["small", "medium", "large"] as const;
export const SPACING_SCALES = ["compact", "normal", "relaxed"] as const;
export const DATE_FORMATS = [
  "MM/YYYY",
  "YYYY-MM",
  "Month YYYY",
  "Mon YYYY",
] as const;
export const SECTION_SEPARATORS = ["line", "none", "dots"] as const;
export const PAGE_SIZES = ["a4", "letter"] as const;

const HexColor = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/, { error: "Use a hex color like #2563eb" });

/** Visual options that templates consume. Independent of resume content. */
export const ResumeSettings = z.object({
  templateId: z.enum(TEMPLATE_IDS).default("classic"),
  accentColor: HexColor.default("#2563eb"),
  fontFamily: z.enum(FONT_FAMILIES).default("inter"),
  fontSize: z.enum(FONT_SIZES).default("medium"),
  spacing: z.enum(SPACING_SCALES).default("normal"),
  dateFormat: z.enum(DATE_FORMATS).default("MM/YYYY"),
  sectionSeparator: z.enum(SECTION_SEPARATORS).default("line"),
  pageSize: z.enum(PAGE_SIZES).default("letter"),
});

export type ResumeSettings = z.infer<typeof ResumeSettings>;
export type TemplateId = (typeof TEMPLATE_IDS)[number];
export type FontFamily = (typeof FONT_FAMILIES)[number];
export type FontSize = (typeof FONT_SIZES)[number];
export type SpacingScale = (typeof SPACING_SCALES)[number];
export type DateFormat = (typeof DATE_FORMATS)[number];
export type SectionSeparator = (typeof SECTION_SEPARATORS)[number];
export type PageSize = (typeof PAGE_SIZES)[number];
