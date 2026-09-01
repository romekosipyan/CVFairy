import Link from "next/link";

import { LoginForm } from "@/components/shared/LoginForm";

import type { Metadata } from "next";
import type { ReactElement } from "react";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to sync resumes across devices and unlock AI features.",
};

export default function LoginPage(): ReactElement {
  const google = Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);
  const github = Boolean(process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET);
  const email = Boolean(process.env.AUTH_RESEND_KEY && process.env.AUTH_EMAIL_FROM);
  const anyProvider = google || github || email;

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6 px-4 py-16">
      <div>
        <p className="text-sm text-muted-foreground">
          <Link href="/" className="hover:underline">
            CVFairy
          </Link>
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Sign in</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Optional. The editor works without an account. Sign in to sync across
          devices, use AI, and keep a cloud copy.
        </p>
      </div>
      {anyProvider ? (
        <LoginForm google={google} github={github} email={email} />
      ) : (
        <p className="rounded-lg border border-border bg-muted/40 p-3 text-sm text-muted-foreground">
          Auth providers are not configured in this environment. Add Google, GitHub,
          or Resend keys to <code>.dev.vars</code> / the Cloudflare dashboard.
        </p>
      )}
      <Link href="/editor" className="text-sm text-muted-foreground hover:text-foreground">
        Continue locally without signing in
      </Link>
    </main>
  );
}
