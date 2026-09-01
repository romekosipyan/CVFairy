import { Download, EyeOff, HardDrive, Sparkles } from "lucide-react";

import type { ReactElement } from "react";

const FEATURES = [
  {
    icon: EyeOff,
    title: "No watermarks, ever",
    body: "The free tier exports a clean PDF and DOCX. We do not brand your resume.",
  },
  {
    icon: Download,
    title: "PDF and Word, plus more",
    body: "Download PDF, DOCX, HTML, Markdown, TXT, or JSON from the browser.",
  },
  {
    icon: HardDrive,
    title: "Local-first",
    body: "Your resume lives in IndexedDB on this device. No account required to start.",
  },
  {
    icon: Sparkles,
    title: "Honest pricing",
    body: "Free forever for the core builder. Pro is $9.99/mo or $149 once.",
  },
] as const;

export function Features(): ReactElement {
  return (
    <section id="why" className="bg-muted/40 py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-2xl font-semibold tracking-tight">Why CVFairy</h2>
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => (
            <li key={feature.title} className="rounded-xl border border-border bg-background p-5">
              <feature.icon className="mb-3 size-5" aria-hidden="true" />
              <h3 className="font-medium">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{feature.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const ROWS = [
  ["Watermark-free PDF", "Yes", "Paid", "Paid"],
  ["DOCX export", "Yes", "No", "Limited"],
  ["Works without an account", "Yes", "No", "Partial"],
  ["Local-first storage", "Yes", "No", "No"],
  ["Lifetime plan", "$149", "No", "No"],
] as const;

export function Comparison(): ReactElement {
  return (
    <section id="compare" className="py-16">
      <div className="mx-auto max-w-6xl overflow-x-auto px-4">
        <h2 className="text-2xl font-semibold tracking-tight">How we compare</h2>
        <table className="mt-8 w-full min-w-[32rem] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="py-3 pr-4 font-medium">Capability</th>
              <th className="py-3 pr-4 font-medium">CVFairy</th>
              <th className="py-3 pr-4 font-medium">Enhancv</th>
              <th className="py-3 font-medium">Teal</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row[0]} className="border-b border-border/70">
                {row.map((cell, index) => (
                  <td key={`${row[0]}-${index}`} className="py-3 pr-4">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function PricingTeaser(): ReactElement {
  return (
    <section id="pricing" className="py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-2xl font-semibold tracking-tight">Pricing that stays honest</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <article className="rounded-xl border border-border p-5">
            <h3 className="font-medium">Free</h3>
            <p className="mt-1 text-3xl font-semibold">$0</p>
            <p className="mt-2 text-sm text-muted-foreground">
              3 templates, PDF + DOCX, no watermarks, local storage.
            </p>
          </article>
          <article className="rounded-xl border border-foreground p-5">
            <h3 className="font-medium">Pro</h3>
            <p className="mt-1 text-3xl font-semibold">$9.99/mo</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Extra templates, AI rewrite, ATS checker, cloud sync.
            </p>
          </article>
          <article className="rounded-xl border border-border p-5">
            <h3 className="font-medium">Lifetime</h3>
            <p className="mt-1 text-3xl font-semibold">$149</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Pay once. Keep Pro features without a subscription.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
