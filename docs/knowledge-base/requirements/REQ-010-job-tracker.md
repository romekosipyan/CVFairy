# REQ-010: Job Application Tracker

**Status:** todo
**Phase:** 3 (Full Platform)
**Priority:** p2-medium
**Depends on:** [[REQ-008-payments]]
**Blocks:** none

## Description

Kanban-style job application tracker. Users organize applications by status, link tailored resumes and cover letters, and see resume-to-job match scores at a glance.

## Acceptance Criteria

1. Kanban board with columns: Saved, Applied, Interview, Offer, Rejected
2. Add job cards with: company, role, URL, date applied, notes
3. Link a tailored resume and cover letter to each application
4. Resume-to-JD match score shown on each card
5. Drag cards between columns to update status
6. Filter and search across applications
7. Import from CSV/Excel (basic column mapping)
8. Weekly summary view (applications sent, interviews scheduled)
9. Pro feature (free users limited to 5 tracked applications)

## Tasks

- [[TASK-P3-009-tracker-schema]] — Define job application data model
- [[TASK-P3-010-tracker-kanban]] — Build kanban board UI
- [[TASK-P3-011-tracker-matching]] — Resume-to-JD match scoring
- [[TASK-P3-012-tracker-import]] — CSV/Excel import
