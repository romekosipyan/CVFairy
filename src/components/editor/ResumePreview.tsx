"use client";

import { useEffect } from "react";

import { getTemplate } from "@/templates/registry";
import { googleFontsHref } from "@/templates/shared/config";

import type { ReactElement } from "react";
import type { Resume, ResumeSettings } from "@/lib/schemas";

interface ResumePreviewProps {
  resume: Resume;
  settings: ResumeSettings;
}

export function ResumePreview({ resume, settings }: ResumePreviewProps): ReactElement {
  useEffect(() => {
    const href = googleFontsHref(settings.fontFamily);
    const id = "cvfairy-resume-font";
    const existing = document.getElementById(id);
    if (!href) {
      if (existing) {
        existing.remove();
      }
      return;
    }
    if (existing instanceof HTMLLinkElement) {
      existing.href = href;
      return;
    }
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  }, [settings.fontFamily]);

  const template = getTemplate(settings.templateId);
  return template.render(resume, settings);
}
