import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Editor",
  description:
    "Create and edit your resume in the CVFairy split-view editor.",
};

export default function EditorSegmentLayout({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  return children;
}
