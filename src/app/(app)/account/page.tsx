import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AccountSettings } from "@/components/shared/AccountSettings";

import type { Metadata } from "next";
import type { ReactElement } from "react";

export const metadata: Metadata = {
  title: "Account",
  description: "Manage your CVFairy account and cloud data.",
};

export default async function AccountPage(): Promise<ReactElement> {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  return <AccountSettings />;
}
