"use client";

import { useEffect } from "react";

import { useResumeStore } from "@/lib/stores/resume-store";

const MOBILE_QUERY = "(max-width: 1023px)";

function isPreviewShortcut(event: KeyboardEvent): boolean {
  const modifier = event.ctrlKey || event.metaKey;
  return modifier && event.key.toLowerCase() === "p";
}

/** Ctrl/Cmd+P toggles the preview on desktop and switches tabs on small screens. */
export function usePreviewShortcut(): void {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent): void {
      if (!isPreviewShortcut(event)) {
        return;
      }
      event.preventDefault();
      const store = useResumeStore.getState();
      if (window.matchMedia(MOBILE_QUERY).matches) {
        store.setMobileTab(store.mobileTab === "form" ? "preview" : "form");
        return;
      }
      store.togglePreviewPanel();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);
}
