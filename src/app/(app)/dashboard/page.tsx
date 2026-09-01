import { DashboardView } from "@/components/dashboard/DashboardView";

import type { Metadata } from "next";
import type { ReactElement } from "react";

export const metadata: Metadata = {
  title: "My resumes",
  description: "Open, duplicate, or back up resumes stored on this device.",
};

export default function DashboardPage(): ReactElement {
  return <DashboardView />;
}
