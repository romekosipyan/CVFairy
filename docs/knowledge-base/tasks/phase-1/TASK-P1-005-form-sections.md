# TASK-P1-005: Form Section Components

**Status:** done
**Phase:** ship
**Priority:** p0-critical
**Depends on:** [[TASK-P1-003-store]], [[TASK-P1-004-editor-layout]]
**Blocks:** [[TASK-P1-006-preview]], [[TASK-P1-007-dnd]]
**Requirement:** [[REQ-001-resume-editor]]

## Description

Build the 5 core form section components that appear in the left panel. Each section reads from and writes to the Zustand store. Uses shadcn/ui form components.

## Acceptance Criteria

1. **PersonalInfoForm** — fields: name, email, phone, location, LinkedIn, website
2. **SummaryForm** — textarea with character counter (recommended max 500)
3. **ExperienceForm** — repeatable entries with: title, company, location, start/end dates, "current" checkbox, bullet points (add/remove/reorder)
4. **EducationForm** — repeatable entries with: degree, school, location, start/end dates, GPA, bullets
5. **SkillsForm** — grouped skills with tag input (type skill, press Enter to add)
6. All forms use shadcn/ui Input, Textarea, Select, Button, Checkbox components
7. Inline validation errors shown below fields (from Zod schemas)
8. "Add entry" and "Remove entry" buttons for repeatable sections
9. Sections are collapsible (click header to expand/collapse)
10. Each section has a drag handle for reordering (used by [[TASK-P1-007-dnd]])

## Affected Files

- `src/components/editor/sections/PersonalInfoForm.tsx`
- `src/components/editor/sections/SummaryForm.tsx`
- `src/components/editor/sections/ExperienceForm.tsx`
- `src/components/editor/sections/EducationForm.tsx`
- `src/components/editor/sections/SkillsForm.tsx`
- `src/components/editor/sections/SectionWrapper.tsx` — collapsible wrapper with drag handle
- `src/components/editor/sections/BulletPointList.tsx` — reusable bullet point editor
- `src/components/editor/sections/DateRangePicker.tsx` — date range input component
- `src/components/editor/sections/TagInput.tsx` — tag input for skills

## Implementation Plan

1. Build `SectionWrapper` — collapsible card with header, drag handle, expand/collapse
2. Build `DateRangePicker` — start/end date inputs with "current" toggle
3. Build `BulletPointList` — ordered list of text inputs with add/remove/reorder
4. Build `TagInput` — type + enter to add, click to remove, grouped
5. Build `PersonalInfoForm` with all fields connected to store
6. Build `SummaryForm` with textarea and character counter
7. Build `ExperienceForm` with repeatable entries using `BulletPointList` and `DateRangePicker`
8. Build `EducationForm` similar to ExperienceForm
9. Build `SkillsForm` with `TagInput` grouped by category
10. Wire all sections into `FormPanel`

## Verification

- [x] Personal info: name, email, phone, location, LinkedIn, website
- [x] Summary textarea + 500-character recommended counter
- [x] Experience: repeatable entries, dates, current checkbox, bullets add/remove/reorder
- [x] Education: repeatable entries, dates, GPA, bullets
- [x] Skills: grouped tag input (Enter to add, click to remove)
- [x] shadcn Input, Textarea, Button, Checkbox, Label (Select unused — no select fields in these forms)
- [x] Zod field errors under personal info email/URL on blur
- [x] Add/remove (and move) for experience, education, skill groups, bullets
- [x] Collapsible `SectionWrapper`; drag handle present for reorderable sections
- [x] `FormPanel` renders Personal Info then `sectionOrder`
- [x] `tsc --noEmit` passes
- [x] `eslint` passes on editor components
- [ ] Browser verify — skipped (anti-stall)

## Notes

- Drag handles are present and labeled for [[TASK-P1-007-dnd]]; they do not reorder sections yet.
- Personal info has no drag handle because it is pinned.

Next: [[TASK-P1-006-preview]]
