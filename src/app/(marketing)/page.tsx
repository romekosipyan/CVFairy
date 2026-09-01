import { Comparison, Features, PricingTeaser } from "@/components/marketing/Features";
import { Hero } from "@/components/marketing/Hero";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { TemplateShowcase } from "@/components/marketing/TemplateShowcase";

import type { ReactElement } from "react";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "CVFairy",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "AI-ready resume builder with free watermark-free PDF and DOCX export. Local-first.",
};

export default function MarketingHomePage(): ReactElement {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <Features />
      <TemplateShowcase />
      <Comparison />
      <HowItWorks />
      <PricingTeaser />
    </main>
  );
}
