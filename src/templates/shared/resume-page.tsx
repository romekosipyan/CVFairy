import type { CSSProperties, ReactElement, ReactNode } from "react";
import type { ResumeSettings, SectionSeparator } from "@/lib/schemas";

import { cn } from "@/lib/utils";

import { deriveTemplateConfig } from "./config";

type ResumeCssVars = CSSProperties & {
  "--resume-accent": string;
  "--resume-name": string;
  "--resume-heading": string;
  "--resume-meta": string;
  "--resume-section-gap": string;
  "--resume-entry-gap": string;
};

interface ResumePageProps {
  settings: ResumeSettings;
  children: ReactNode;
  className?: string;
}

export function ResumePage({
  settings,
  children,
  className,
}: ResumePageProps): ReactElement {
  const config = deriveTemplateConfig(settings);
  const style: ResumeCssVars = {
    width: `${config.pageWidthMm}mm`,
    minHeight: `${config.pageHeightMm}mm`,
    padding: `${config.pagePaddingMm}mm`,
    fontFamily: config.cssFontFamily,
    fontSize: `${config.bodyFontPx}px`,
    lineHeight: config.lineHeight,
    color: "#1a1a1a",
    backgroundColor: "#ffffff",
    "--resume-accent": config.accentColor,
    "--resume-name": `${config.nameFontPx}px`,
    "--resume-heading": `${config.headingFontPx}px`,
    "--resume-meta": `${config.metaFontPx}px`,
    "--resume-section-gap": `${config.sectionGapPx}px`,
    "--resume-entry-gap": `${config.entryGapPx}px`,
  };

  return (
    <article className={cn("box-border text-neutral-900", className)} style={style}>
      {children}
    </article>
  );
}

interface SectionHeadingProps {
  title: string;
  separator: SectionSeparator;
  accent: string;
  className?: string;
}

export function HtmlSectionHeading({
  title,
  separator,
  accent,
  className,
}: SectionHeadingProps): ReactElement {
  const border =
    separator === "none"
      ? "border-b-0"
      : separator === "dots"
        ? "border-b border-dotted"
        : "border-b border-solid";

  return (
    <h2
      className={cn(
        "mb-2 pb-1 font-semibold tracking-wide uppercase",
        border,
        className,
      )}
      style={{
        fontSize: "var(--resume-heading)",
        color: accent,
        borderColor: accent,
      }}
    >
      {title}
    </h2>
  );
}

export function HtmlBulletList({ items }: { items: string[] }): ReactElement | null {
  if (items.length === 0) {
    return null;
  }
  return (
    <ul className="mt-1 list-disc space-y-0.5 pl-4">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
