# REQ-009: Cover Letter Builder

**Status:** todo
**Phase:** 3 (Full Platform)
**Priority:** p2-medium
**Depends on:** [[REQ-008-payments]]
**Blocks:** none

## Description

AI-powered cover letter generator that creates tailored cover letters from resume data + job description. Uses matching design templates so resume + cover letter look like a cohesive application.

## Acceptance Criteria

1. Generate cover letter from resume data + pasted job description
2. Cover letter templates match resume templates in design
3. Editor with sections: header, greeting, opening, body, closing, signature
4. AI can rewrite or improve each section
5. Export in same formats as resume (PDF, DOCX, etc.)
6. Stored alongside associated resume
7. Pro feature (free users see a preview but can't export)

## Tasks

- [[TASK-P3-005-cover-letter-schema]] — Define cover letter data model
- [[TASK-P3-006-cover-letter-ai]] — AI generation prompts and flow
- [[TASK-P3-007-cover-letter-editor]] — Cover letter editor UI
- [[TASK-P3-008-cover-letter-templates]] — Matching cover letter templates
