import { Document, Link, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

import type { ReactElement, ReactNode } from "react";
import type { DocumentProps } from "@react-pdf/renderer";
import type { ResumeSettings, SectionSeparator } from "@/lib/schemas";

import { deriveTemplateConfig, type TemplateConfig } from "./config";
import type { ContactItem } from "./format";

export function createPdfStyles(config: TemplateConfig) {
  return StyleSheet.create({
    page: {
      padding: config.pagePaddingPt,
      fontFamily: "Helvetica",
      fontSize: config.bodyFontPt,
      color: "#1a1a1a",
      lineHeight: config.lineHeight,
    },
    name: {
      fontFamily: "Helvetica-Bold",
      fontSize: config.nameFontPt,
      color: config.accentColor,
    },
    heading: {
      fontFamily: "Helvetica-Bold",
      fontSize: config.headingFontPt,
      color: config.accentColor,
      textTransform: "uppercase",
      letterSpacing: 0.6,
      paddingBottom: 3,
      marginBottom: 6,
    },
    headingLine: {
      borderBottomWidth: 1,
      borderBottomColor: config.accentColor,
      borderBottomStyle: "solid",
    },
    headingDots: {
      borderBottomWidth: 1,
      borderBottomColor: config.accentColor,
      borderBottomStyle: "dotted",
    },
    meta: {
      fontSize: config.metaFontPt,
      color: "#4b5563",
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: 8,
    },
    section: {
      marginBottom: config.sectionGapPx * 0.75,
    },
    entry: {
      marginBottom: config.entryGapPx * 0.75,
    },
    contactRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 6,
      marginTop: 4,
      marginBottom: 10,
    },
    bullet: {
      flexDirection: "row",
      marginTop: 2,
      paddingLeft: 8,
    },
    bulletMark: {
      width: 10,
      fontSize: config.bodyFontPt,
    },
    bulletText: {
      flex: 1,
    },
    sidebar: {
      width: "32%",
      backgroundColor: config.accentColor,
      color: "#ffffff",
      padding: 16,
    },
    main: {
      width: "68%",
      padding: 16,
    },
    sidebarText: {
      color: "#ffffff",
      fontSize: config.bodyFontPt,
    },
    sidebarHeading: {
      fontFamily: "Helvetica-Bold",
      color: "#ffffff",
      fontSize: config.headingFontPt,
      textTransform: "uppercase",
      marginBottom: 6,
      marginTop: 12,
    },
  });
}

type PdfStyles = ReturnType<typeof createPdfStyles>;

export function PdfDocument({
  settings,
  title,
  children,
}: {
  settings: ResumeSettings;
  title: string;
  children: ReactNode;
}): ReactElement<DocumentProps> {
  const config = deriveTemplateConfig(settings);
  const styles = createPdfStyles(config);
  return (
    <Document title={title} author={title} subject="Resume">
      <Page size={config.pdfPage} style={styles.page} wrap>
        {children}
      </Page>
    </Document>
  );
}

export function PdfSectionHeading({
  title,
  separator,
  styles,
}: {
  title: string;
  separator: SectionSeparator;
  styles: PdfStyles;
}): ReactElement {
  const extra =
    separator === "line" ? styles.headingLine : separator === "dots" ? styles.headingDots : undefined;
  return <Text style={extra ? [styles.heading, extra] : styles.heading}>{title}</Text>;
}

export function PdfBullets({
  items,
  styles,
}: {
  items: string[];
  styles: PdfStyles;
}): ReactElement | null {
  if (items.length === 0) {
    return null;
  }
  return (
    <View>
      {items.map((item) => (
        <View key={item} style={styles.bullet} wrap={false}>
          <Text style={styles.bulletMark}>•</Text>
          <Text style={styles.bulletText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

export function PdfContactLine({
  items,
  styles,
}: {
  items: ContactItem[];
  styles: PdfStyles;
}): ReactElement | null {
  if (items.length === 0) {
    return null;
  }
  return (
    <View style={styles.contactRow}>
      {items.map((item, index) => (
        <Text key={`${item.label}-${index}`} style={styles.meta}>
          {item.href ? (
            <Link src={item.href}>{item.label}</Link>
          ) : (
            item.label
          )}
          {index < items.length - 1 ? "  ·  " : ""}
        </Text>
      ))}
    </View>
  );
}

export type { PdfStyles };
