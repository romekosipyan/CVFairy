# TASK-P1-002: Define Zod Schemas

**Status:** done
**Phase:** ship
**Priority:** p0-critical
**Depends on:** [[TASK-P1-001-scaffold]]
**Blocks:** [[TASK-P1-003-store]], [[TASK-P1-005-form-sections]]
**Requirement:** [[REQ-001-resume-editor]], [[REQ-002-templates]]

## Description

Define all Zod schemas that serve as the single source of truth for resume data types. TypeScript types are inferred from Zod schemas (never manually defined). This is the data foundation the entire app builds on.

## Naming

Follow `.cursor/rules/003-zustand-zod-dndkit.mdc`: the schema **is** the type. Export `PersonalInfo` (const + inferred type), not `personalInfoSchema`. Import from `zod` (project is fully on v4).

Empty drafts must parse: the editor starts blank, so required export checks (non-empty name/email) happen later at export time, not in the stored document schema.

## Acceptance Criteria

1. All resume section schemas defined with validation rules
2. Resume settings schema defined (template, colors, fonts, etc.)
3. Full `Resume` schema composing all sections plus `sectionOrder`
4. `StoredResume` schema for IndexedDB persistence
5. TypeScript types exported via `z.infer<typeof Schema>` sharing the schema name
6. All user-facing fields have meaningful `error` messages
7. Default values on every field so `Resume.parse({...empty...})` works
8. Schemas are composable (section schemas reused in `Resume` and `StoredResume`)
9. No circular dependencies between schema files
10. Optional URLs accept `""` so incomplete drafts stay valid

## Affected Files

- `src/lib/schemas/personal-info.ts`
- `src/lib/schemas/experience.ts`
- `src/lib/schemas/education.ts`
- `src/lib/schemas/skills.ts`
- `src/lib/schemas/summary.ts`
- `src/lib/schemas/resume.ts` — full resume schema composing sections
- `src/lib/schemas/settings.ts` — template settings
- `src/lib/schemas/storage.ts` — StoredResume for persistence
- `src/lib/schemas/index.ts` — barrel export

## Data Contract

- `PersonalInfo` — identity and contact. `email` is `z.email() | ""`. `linkedin` / `website` are `z.url() | ""`.
- `Summary` — `{ content }` default `""`.
- `ExperienceEntry` / `Experience` — `entries[]`, `current` default false, `endDate` `""` means Present when `current` is true.
- `EducationEntry` / `Education` — same date pattern, optional `gpa`.
- `SkillGroup` / `Skills` — grouped string tags.
- `SectionId` — `'summary' | 'experience' | 'education' | 'skills'` (personal info is pinned, not ordered).
- `Resume` — the five sections + `sectionOrder`.
- `ResumeSettings` — template + visual options from [[REQ-002-templates]].
- `StoredResume` — id, title, `data: Resume`, `settings: ResumeSettings`, timestamps, version, optional `syncedAt`.

## Edge Cases

1. Brand-new resume: all nested objects omitted or `{}` still parse via defaults
2. Empty email / URL strings must not fail validation (draft state)
3. Invalid hex color, email, or URL must produce a field error
4. Unknown keys are stripped (`z.object()`, not loose)
5. `sectionOrder` may omit a section id (hidden section) but must not include unknown ids
6. `current: true` with a filled `endDate` is allowed at schema level (UI clears it)

## Implementation Plan

1. Create `src/lib/schemas/` directory
2. Define `personal-info.ts` — personalInfoSchema with all fields
3. Define `experience.ts` — experienceEntrySchema and experienceSchema
4. Define `education.ts` — educationEntrySchema and educationSchema
5. Define `skills.ts` — skillGroupSchema and skillsSchema
6. Define `summary.ts` — summarySchema
7. Define `settings.ts` — resumeSettingsSchema
8. Define `resume.ts` — full resumeSchema composing all sections
9. Define `storage.ts` — storedResumeSchema with metadata
10. Create `index.ts` barrel export with all schemas and inferred types
11. Verify `tsc --noEmit` passes

## Verification

- [x] Five section schemas + settings + Resume + StoredResume
- [x] Types inferred (`export type X = z.infer<typeof X>`)
- [x] Draft email/URL `""` accepted; invalid email/URL/hex rejected
- [x] `emptyResume()` / `Resume.parse({})` succeed
- [x] `StoredResume` requires ISO `createdAt` / `updatedAt`
- [x] `tsc --noEmit` passes
- [x] `eslint src/lib/schemas` passes
- [x] No circular imports (leaf sections → resume → storage → barrel)

## Notes

- Export-time "name and email required" is intentionally not in these schemas. Drafts must persist incomplete data.
- `sectionOrder` omits personal info because it is pinned at the top.
- Runtime checks were run with a temporary tsx script (not shipped).

Next: [[TASK-P1-003-store]]
