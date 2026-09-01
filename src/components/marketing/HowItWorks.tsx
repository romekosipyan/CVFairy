import type { ReactElement } from "react";

export function HowItWorks(): ReactElement {
  const steps = [
    { n: "1", title: "Write", body: "Fill the editor. Preview updates as you type." },
    { n: "2", title: "Style", body: "Pick Classic, Modern, or Minimal and tweak color, type, and spacing." },
    { n: "3", title: "Export", body: "Download PDF or DOCX — no watermark, no wait." },
  ];
  return (
    <section className="bg-muted/40 py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-2xl font-semibold tracking-tight">How it works</h2>
        <ol className="mt-8 grid gap-6 sm:grid-cols-3">
          {steps.map((step) => (
            <li key={step.n} className="rounded-xl border border-border bg-background p-5">
              <p className="text-sm font-semibold text-muted-foreground">Step {step.n}</p>
              <h3 className="mt-1 text-lg font-medium">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
