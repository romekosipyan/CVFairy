"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import type { ReactElement } from "react";

export function AccountSettings(): ReactElement {
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function deleteAccount(): Promise<void> {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/account", { method: "DELETE" });
      if (!response.ok) {
        const body: unknown = await response.json().catch(() => null);
        const message =
          typeof body === "object" &&
          body !== null &&
          "error" in body &&
          typeof body.error === "string"
            ? body.error
            : "Could not delete account";
        throw new Error(message);
      }
      await signOut({ callbackUrl: "/" });
    } catch (caught: unknown) {
      setError(caught instanceof Error ? caught.message : "Could not delete account");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-lg flex-col gap-6 px-4 py-12">
      <p className="text-sm text-muted-foreground">
        <Link href="/dashboard" className="hover:underline">
          Back to resumes
        </Link>
      </p>
      <h1 className="text-2xl font-semibold tracking-tight">Account</h1>
      <p className="text-sm text-muted-foreground">
        Deleting your account removes all cloud resumes and sign-in data. Copies on
        this device stay until you delete them here.
      </p>
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
      <Button
        type="button"
        variant="destructive"
        disabled={busy}
        onClick={() => {
          void deleteAccount();
        }}
      >
        {busy ? "Deleting…" : "Delete account and cloud data"}
      </Button>
    </main>
  );
}
