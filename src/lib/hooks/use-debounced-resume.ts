"use client";

import { useEffect, useState } from "react";

import { useResumeStore } from "@/lib/stores/resume-store";

import type { Resume, ResumeSettings } from "@/lib/schemas";

const PREVIEW_DEBOUNCE_MS = 200;

export interface DebouncedResume {
  data: Resume;
  settings: ResumeSettings;
}

export function useDebouncedResume(delay = PREVIEW_DEBOUNCE_MS): DebouncedResume {
  const data = useResumeStore((state) => state.data);
  const settings = useResumeStore((state) => state.settings);
  const [debounced, setDebounced] = useState<DebouncedResume>({ data, settings });

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebounced({ data, settings });
    }, delay);
    return () => {
      window.clearTimeout(timer);
    };
  }, [data, settings, delay]);

  return debounced;
}
