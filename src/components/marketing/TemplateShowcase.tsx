import Link from "next/link";

import { TEMPLATE_CATALOG } from "@/templates/catalog";

import type { ReactElement } from "react";

export function TemplateShowcase(): ReactElement {
  return (
    <section id="templates" className="py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-2xl font-semibold tracking-tight">Templates included on day one</h2>
        <p className="mt-2 text-muted-foreground">
          All three are free. Click a template to start in the editor.
        </p>
        <ul className="mt-8 grid gap-6 sm:grid-cols-3">
          {TEMPLATE_CATALOG.map((template) => (
            <li key={template.id}>
              <Link
                href={`/editor?template=${template.id}`}
                className="block rounded-xl border border-border p-3 hover:bg-muted/50"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={template.thumbnail}
                  alt=""
                  className="aspect-[210/297] w-full rounded-md border border-border bg-white object-cover"
                />
                <p className="mt-3 font-medium">{template.name}</p>
                <p className="text-sm text-muted-foreground">{template.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
