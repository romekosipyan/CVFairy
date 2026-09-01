import Link from "next/link";

import type { ReactElement } from "react";

export function Hero(): ReactElement {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 lg:grid-cols-2 lg:py-24">
      <div className="flex flex-col gap-6">
        <p className="text-sm font-medium tracking-widest text-muted-foreground uppercase">
          Resume builder without the paywall
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Your resume, your rules.
        </h1>
        <p className="text-lg leading-7 text-muted-foreground">
          Build an ATS-friendly resume in minutes. Free PDF and DOCX export. No
          watermarks. Your data stays on this device until you choose otherwise.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/editor"
            className="inline-flex h-11 items-center justify-center rounded-md bg-foreground px-6 text-sm font-medium text-background"
          >
            Start building — free
          </Link>
          <Link
            href="#templates"
            className="inline-flex h-11 items-center justify-center rounded-md border border-border px-6 text-sm font-medium"
          >
            See templates
          </Link>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="relative mx-auto w-full max-w-sm overflow-hidden rounded-xl border border-border bg-white p-6 shadow-lg motion-safe:animate-[float_6s_ease-in-out_infinite]"
      >
        <p className="text-lg font-semibold text-blue-600">Alex Rivera</p>
        <p className="text-xs text-neutral-500">Product designer · New York</p>
        <div className="mt-4 h-px bg-blue-600/40" />
        <p className="mt-3 text-[11px] uppercase tracking-wide text-blue-600">Experience</p>
        <p className="mt-1 text-sm font-medium">Lead Designer · Northwind</p>
        <p className="text-xs text-neutral-500">Shipped a design system used by 40+ teams.</p>
      </div>
    </section>
  );
}
