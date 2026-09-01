# REQ-012: Landing Page

**Status:** done
**Phase:** 1 (MVP)
**Priority:** p1-high
**Depends on:** none
**Blocks:** none

## Description

Marketing landing page that communicates CVFairy's value proposition. Must convert visitors into users (click "Start Building" to go to editor). Beautiful, fast, modern design that immediately shows this is better than Enhancv.

## Acceptance Criteria

1. Hero section with tagline, CTA button, and animated resume preview
2. "Why CVFairy" section — 3-4 key differentiators with icons
3. Template showcase — grid of template thumbnails (clickable to start)
4. Feature comparison table — CVFairy vs Enhancv vs Teal
5. "How it works" — 3-step visual guide
6. Pricing section or link to pricing page
7. Footer with links, social, and legal
8. Page load < 2 seconds on 3G
9. Lighthouse score > 90 on all metrics
10. Responsive: works beautifully on mobile, tablet, desktop
11. CTA buttons lead to `/editor` (no signup required to start)
12. SEO optimized: title, description, OG tags, structured data

## Affected Files

- `src/app/(marketing)/page.tsx` — Landing page
- `src/app/(marketing)/layout.tsx` — Marketing layout (header, footer)
- `src/components/marketing/Hero.tsx`
- `src/components/marketing/Features.tsx`
- `src/components/marketing/TemplateShowcase.tsx`
- `src/components/marketing/Comparison.tsx`
- `src/components/marketing/HowItWorks.tsx`
- `src/components/marketing/Footer.tsx`

## Tasks

- [[TASK-P1-024-marketing-layout]] — Build marketing layout with header and footer
- [[TASK-P1-025-hero]] — Build hero section with animated preview
- [[TASK-P1-026-features]] — Build features and comparison sections
- [[TASK-P1-027-template-showcase]] — Build template showcase grid
