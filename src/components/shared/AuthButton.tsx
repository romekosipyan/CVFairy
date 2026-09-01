"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

import { Button, buttonVariants } from "@/components/ui/button";

import type { ReactElement } from "react";

export function AuthButton(): ReactElement {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <span className="text-xs text-muted-foreground">Session…</span>;
  }

  if (!session?.user) {
    return (
      <Link href="/login" className={buttonVariants({ variant: "outline", size: "sm" })}>
        Sign in
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link href="/account" className="hidden max-w-32 truncate text-xs text-muted-foreground sm:inline">
        {session.user.email ?? session.user.name ?? "Account"}
      </Link>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => {
          void signOut({ callbackUrl: "/" });
        }}
      >
        Sign out
      </Button>
    </div>
  );
}
