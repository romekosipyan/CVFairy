"use client";

import { createContext } from "react";

/** Callback ref from `useSortable().handleRef`. Null when the section is not sortable. */
export const SortableHandleContext = createContext<
  ((element: Element | null) => void) | null
>(null);
