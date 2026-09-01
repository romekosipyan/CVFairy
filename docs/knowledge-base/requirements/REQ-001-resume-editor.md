# REQ-001: Resume Editor

**Status:** done
**Phase:** 1 (MVP)
**Priority:** p0-critical
**Depends on:** none
**Blocks:** [[REQ-002-templates]], [[REQ-003-export]], [[REQ-004-local-storage]]

## Description

The core resume editing experience. A split-view interface: structured form inputs on the left, live resume preview on the right. Users fill in sections and see the result update in real time.

## Acceptance Criteria

1. Split-view layout: form panel (left, ~40%) and preview panel (right, ~60%)
2. Preview updates within 200ms of form input changes
3. Five core sections are available:
   - Personal Info (name, email, phone, location, LinkedIn, website, photo)
   - Summary (rich text, max 500 characters recommended)
   - Experience (multiple entries: title, company, dates, location, bullet points)
   - Education (multiple entries: degree, school, dates, GPA optional)
   - Skills (grouped or flat list with proficiency levels optional)
4. Sections can be reordered via drag-and-drop
5. Sections can be added/removed (except Personal Info which is always present)
6. Each section supports multiple entries where applicable
7. Date inputs support configurable formats (MM/YYYY, YYYY-MM, Month Year, etc.)
8. Form validates required fields and shows inline errors
9. Works on screens >= 768px wide (tablet+). On mobile, stacks vertically.
10. Keyboard accessible: tab through all fields, enter to add entries

## Data Contract

```typescript
import { z } from 'zod';

const personalInfoSchema = z.object({
  fullName: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  location: z.string().optional(),
  linkedin: z.string().url().optional().or(z.literal('')),
  website: z.string().url().optional().or(z.literal('')),
  photoUrl: z.string().optional(),
});

const experienceEntrySchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  company: z.string().min(1),
  location: z.string().optional(),
  startDate: z.string(),
  endDate: z.string().optional(), // empty = "Present"
  current: z.boolean().default(false),
  bullets: z.array(z.string()),
});

const educationEntrySchema = z.object({
  id: z.string(),
  degree: z.string().min(1),
  school: z.string().min(1),
  location: z.string().optional(),
  startDate: z.string(),
  endDate: z.string().optional(),
  gpa: z.string().optional(),
  bullets: z.array(z.string()),
});

const skillGroupSchema = z.object({
  id: z.string(),
  category: z.string(), // e.g., "Programming Languages", "Tools"
  skills: z.array(z.string()),
});

const resumeSectionSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('personalInfo'), data: personalInfoSchema }),
  z.object({ type: z.literal('summary'), data: z.object({ content: z.string() }) }),
  z.object({ type: z.literal('experience'), data: z.object({ entries: z.array(experienceEntrySchema) }) }),
  z.object({ type: z.literal('education'), data: z.object({ entries: z.array(educationEntrySchema) }) }),
  z.object({ type: z.literal('skills'), data: z.object({ groups: z.array(skillGroupSchema) }) }),
]);
```

## Edge Cases

1. Empty resume (no entries in any section) — preview shows placeholder guidance
2. Very long content — preview must handle overflow (pagination or scroll)
3. Special characters in names/titles (accents, CJK characters)
4. Photo upload failure — graceful fallback, no broken image
5. Browser back/forward — preserve form state
6. Rapid typing — debounce preview updates to avoid jank
7. Concurrent edits from multiple tabs — last write wins with warning

## Affected Files

- `src/app/(app)/editor/page.tsx` — Editor page
- `src/components/editor/EditorLayout.tsx` — Split-view container
- `src/components/editor/FormPanel.tsx` — Left panel with form sections
- `src/components/editor/PreviewPanel.tsx` — Right panel with live preview
- `src/components/editor/sections/PersonalInfoForm.tsx`
- `src/components/editor/sections/SummaryForm.tsx`
- `src/components/editor/sections/ExperienceForm.tsx`
- `src/components/editor/sections/EducationForm.tsx`
- `src/components/editor/sections/SkillsForm.tsx`
- `src/components/editor/SectionSortable.tsx` — Drag-and-drop wrapper
- `src/lib/schemas/resume.ts` — Zod schemas (source of truth)
- `src/lib/stores/resume-store.ts` — Zustand store for editor state
- `src/lib/hooks/use-resume-preview.ts` — Debounced preview updates

## Tasks

- [[TASK-P1-001-scaffold]] — Project scaffolding
- [[TASK-P1-002-schemas]] — Define all Zod schemas
- [[TASK-P1-003-store]] — Create Zustand resume store
- [[TASK-P1-004-editor-layout]] — Build split-view editor layout
- [[TASK-P1-005-form-sections]] — Build all 5 form section components
- [[TASK-P1-006-preview]] — Build preview panel with live updates
- [[TASK-P1-007-dnd]] — Add drag-and-drop section reordering
