"use client";

import { useEffect, useState } from "react";

import { useResumeStore } from "@/lib/stores/resume-store";

/** Rehydrates the persisted resume store on the client. Safe to call once per editor mount. */
export function useHydrateResumeStore(): boolean {
  const [hydrated, setHydrated] = useState(
    () => useResumeStore.persist.hasHydrated(),
  );

  useEffect(() => {
    const unsub = useResumeStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });
    void useResumeStore.persist.rehydrate();
    return unsub;
  }, []);

  return hydrated;
}
