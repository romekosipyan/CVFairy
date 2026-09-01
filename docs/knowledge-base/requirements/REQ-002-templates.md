# REQ-002: Resume Templates

**Status:** done
**Phase:** 1 (MVP)
**Priority:** p0-critical
**Depends on:** [[REQ-001-resume-editor]]
**Blocks:** [[REQ-003-export]]

## Description

Professionally designed, ATS-friendly resume templates that render consistently in the live preview and in exported PDF/DOCX. The free tier includes 3 templates; Pro adds 10+ more.

## Acceptance Criteria

1. Three free templates available at launch:
   - **Classic** — single column, traditional, highly ATS-safe
   - **Modern** — double column, clean, contemporary
   - **Minimal** — single column, lots of whitespace, elegant
2. Templates render identically in preview and PDF export (pixel-accurate)
3. Each template supports all 5 core sections from [[REQ-001-resume-editor]]
4. Templates support 1-page and multi-page resumes
5. Users can customize per-template:
   - Primary color (accent)
   - Font family (from a curated list of 8-10 web-safe + Google Fonts)
   - Font size (small, medium, large)
   - Spacing (compact, normal, relaxed)
   - Date format (MM/YYYY, YYYY-MM, Month Year, Mon Year)
   - Section separator style (line, none, dots)
6. Template switching preserves all content (only layout changes)
7. Template thumbnails shown in a picker/gallery view
8. Templates use semantic HTML structure for ATS readability

## Data Contract

```typescript
const resumeSettingsSchema = z.object({
  templateId: z.string(),
  accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  fontFamily: z.enum([
    'inter', 'roboto', 'lato', 'montserrat', 'opensans',
    'merriweather', 'playfair', 'raleway', 'calibri', 'garamond'
  ]),
  fontSize: z.enum(['small', 'medium', 'large']),
  spacing: z.enum(['compact', 'normal', 'relaxed']),
  dateFormat: z.enum(['MM/YYYY', 'YYYY-MM', 'Month YYYY', 'Mon YYYY']),
  sectionSeparator: z.enum(['line', 'none', 'dots']),
  pageSize: z.enum(['a4', 'letter']),
});

interface TemplateDefinition {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  tier: 'free' | 'pro';
  columns: 1 | 2;
  render: (resume: Resume, settings: ResumeSettings) => React.ReactElement;
  renderPdf: (resume: Resume, settings: ResumeSettings) => React.ReactElement; // @react-pdf/renderer
}
```

## Edge Cases

1. Content overflow on single page — auto-detect and suggest multi-page or compact spacing
2. Template with photo vs without photo — layout must adapt
3. Missing optional sections — template must not show empty space
4. Very short resume (new grad, few entries) — template must not look empty
5. RTL language support (future, but structure shouldn't prevent it)
6. Font loading failure — graceful fallback to system fonts

## Affected Files

- `src/templates/` — Template definitions directory
- `src/templates/classic/` — Classic template (preview + PDF components)
- `src/templates/modern/` — Modern template
- `src/templates/minimal/` — Minimal template
- `src/templates/registry.ts` — Template registry and metadata
- `src/components/editor/TemplatePicker.tsx` — Template selection UI
- `src/components/editor/SettingsPanel.tsx` — Customization controls
- `src/lib/schemas/settings.ts` — Settings Zod schema

## Tasks

- [[TASK-P1-008-template-system]] — Build template registry and rendering system
- [[TASK-P1-009-classic-template]] — Implement Classic template (preview + PDF)
- [[TASK-P1-010-modern-template]] — Implement Modern template (preview + PDF)
- [[TASK-P1-011-minimal-template]] — Implement Minimal template (preview + PDF)
- [[TASK-P1-012-template-picker]] — Build template picker gallery
- [[TASK-P1-013-settings-panel]] — Build customization settings panel
