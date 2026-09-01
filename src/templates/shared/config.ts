import type {
  FontFamily,
  FontSize,
  PageSize,
  ResumeSettings,
  SpacingScale,
} from "@/lib/schemas";

export interface TemplateConfig {
  accentColor: string;
  cssFontFamily: string;
  bodyFontPx: number;
  headingFontPx: number;
  nameFontPx: number;
  metaFontPx: number;
  bodyFontPt: number;
  headingFontPt: number;
  nameFontPt: number;
  metaFontPt: number;
  lineHeight: number;
  sectionGapPx: number;
  entryGapPx: number;
  pagePaddingMm: number;
  pagePaddingPt: number;
  pageWidthMm: number;
  pageHeightMm: number;
  pdfPage: "A4" | "LETTER";
}

const BODY_PX: Record<FontSize, number> = {
  small: 10,
  medium: 11,
  large: 12,
};

const HEADING_PX: Record<FontSize, number> = {
  small: 11,
  medium: 12.5,
  large: 14,
};

const NAME_PX: Record<FontSize, number> = {
  small: 20,
  medium: 24,
  large: 28,
};

const META_PX: Record<FontSize, number> = {
  small: 8.5,
  medium: 9.5,
  large: 10.5,
};

const LINE_HEIGHT: Record<SpacingScale, number> = {
  compact: 1.25,
  normal: 1.4,
  relaxed: 1.55,
};

const SECTION_GAP: Record<SpacingScale, number> = {
  compact: 10,
  normal: 14,
  relaxed: 20,
};

const ENTRY_GAP: Record<SpacingScale, number> = {
  compact: 8,
  normal: 12,
  relaxed: 16,
};

const PAGE_PAD_MM: Record<SpacingScale, number> = {
  compact: 12,
  normal: 16,
  relaxed: 20,
};

const CSS_FONTS: Record<FontFamily, string> = {
  inter: "Inter, ui-sans-serif, system-ui, sans-serif",
  roboto: "Roboto, ui-sans-serif, system-ui, sans-serif",
  lato: "Lato, ui-sans-serif, system-ui, sans-serif",
  montserrat: "Montserrat, ui-sans-serif, system-ui, sans-serif",
  opensans: '"Open Sans", ui-sans-serif, system-ui, sans-serif',
  merriweather: "Merriweather, Georgia, serif",
  playfair: '"Playfair Display", Georgia, serif',
  raleway: "Raleway, ui-sans-serif, system-ui, sans-serif",
  calibri: "Calibri, Candara, Segoe UI, sans-serif",
  garamond: 'Garamond, "Palatino Linotype", Palatino, serif',
};

const GOOGLE_FAMILIES: Partial<Record<FontFamily, string>> = {
  inter: "Inter:wght@400;600;700",
  roboto: "Roboto:wght@400;700",
  lato: "Lato:wght@400;700",
  montserrat: "Montserrat:wght@400;600;700",
  opensans: "Open+Sans:wght@400;600;700",
  merriweather: "Merriweather:wght@400;700",
  playfair: "Playfair+Display:wght@400;700",
  raleway: "Raleway:wght@400;600;700",
};

function pxToPt(px: number): number {
  return Math.round(px * 0.75 * 10) / 10;
}

function mmToPt(mm: number): number {
  return Math.round(mm * 2.83465 * 10) / 10;
}

export function pageDimensionsMm(pageSize: PageSize): {
  widthMm: number;
  heightMm: number;
  pdfPage: "A4" | "LETTER";
} {
  if (pageSize === "a4") {
    return { widthMm: 210, heightMm: 297, pdfPage: "A4" };
  }
  return { widthMm: 215.9, heightMm: 279.4, pdfPage: "LETTER" };
}

export function deriveTemplateConfig(settings: ResumeSettings): TemplateConfig {
  const bodyFontPx = BODY_PX[settings.fontSize];
  const headingFontPx = HEADING_PX[settings.fontSize];
  const nameFontPx = NAME_PX[settings.fontSize];
  const metaFontPx = META_PX[settings.fontSize];
  const pagePaddingMm = PAGE_PAD_MM[settings.spacing];
  const page = pageDimensionsMm(settings.pageSize);

  return {
    accentColor: settings.accentColor,
    cssFontFamily: CSS_FONTS[settings.fontFamily],
    bodyFontPx,
    headingFontPx,
    nameFontPx,
    metaFontPx,
    bodyFontPt: pxToPt(bodyFontPx),
    headingFontPt: pxToPt(headingFontPx),
    nameFontPt: pxToPt(nameFontPx),
    metaFontPt: pxToPt(metaFontPx),
    lineHeight: LINE_HEIGHT[settings.spacing],
    sectionGapPx: SECTION_GAP[settings.spacing],
    entryGapPx: ENTRY_GAP[settings.spacing],
    pagePaddingMm,
    pagePaddingPt: mmToPt(pagePaddingMm),
    pageWidthMm: page.widthMm,
    pageHeightMm: page.heightMm,
    pdfPage: page.pdfPage,
  };
}

export function googleFontsHref(family: FontFamily): string | null {
  const spec = GOOGLE_FAMILIES[family];
  if (!spec) {
    return null;
  }
  return `https://fonts.googleapis.com/css2?family=${spec}&display=swap`;
}
