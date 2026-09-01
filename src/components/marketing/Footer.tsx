import Link from "next/link";

import type { ReactElement } from "react";

export function Footer(): ReactElement {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-semibold">CVFairy</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Your resume, your rules. No watermarks. No account required.
          </p>
        </div>
        <div className="flex gap-10 text-sm">
          <div className="flex flex-col gap-1">
            <p className="font-medium">Product</p>
            <Link href="/editor" className="text-muted-foreground hover:text-foreground">
              Editor
            </Link>
            <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">
              Dashboard
            </Link>
            <Link href="#pricing" className="text-muted-foreground hover:text-foreground">
              Pricing
            </Link>
          </div>
          <div className="flex flex-col gap-1">
            <p className="font-medium">Legal</p>
            <span className="text-muted-foreground">Privacy (soon)</span>
            <span className="text-muted-foreground">Terms (soon)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
