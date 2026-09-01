import Link from "next/link";

import { Footer } from "@/components/marketing/Footer";
import { AuthButton } from "@/components/shared/AuthButton";

import type { ReactElement, ReactNode } from "react";

export function MarketingHeader(): ReactElement {
  return (
    <header className="sticky top-0 z-20 border-b border-border/80 bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          CVFairy
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-4 text-sm">
          <Link href="#templates" className="hidden text-muted-foreground hover:text-foreground sm:inline">
            Templates
          </Link>
          <Link href="#compare" className="hidden text-muted-foreground hover:text-foreground sm:inline">
            Compare
          </Link>
          <Link href="#pricing" className="hidden text-muted-foreground hover:text-foreground sm:inline">
            Pricing
          </Link>
          <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">
            My resumes
          </Link>
          <AuthButton />
          <Link
            href="/editor"
            className="inline-flex h-8 items-center rounded-lg bg-foreground px-3 text-sm font-medium text-background"
          >
            Start building
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default function MarketingLayout({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  return (
    <div className="flex min-h-dvh flex-1 flex-col bg-background text-foreground">
      <MarketingHeader />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
