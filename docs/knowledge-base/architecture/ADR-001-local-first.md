# ADR-001: Local-First Architecture

**Status:** accepted
**Date:** 2026-09-01
**Relates to:** [[REQ-004-local-storage]], [[REQ-007-auth-cloud-sync]]

## Context

Resume builders typically require an account and store all data server-side. This creates friction (signup before using), privacy concerns (PII stored on third-party servers), and vendor lock-in (data trapped in the platform). Enhancv requires an account to do anything meaningful.

## Decision

CVFairy uses a **local-first** architecture:
- IndexedDB is the primary data store (via the `idb` library)
- The app works fully offline after initial page load
- Cloud sync is an opt-in feature that requires authentication
- Users own their data and can export everything as JSON

## Consequences

**Positive:**
- No signup friction — users start building immediately
- Privacy by default — PII stays on user's device
- Works offline — no network dependency for core features
- Zero server storage cost for free-tier users
- Faster perceived performance (no network round-trips for save)

**Negative:**
- Data loss risk if user clears browser data (mitigated by JSON backup feature)
- Sync complexity when user has both local and cloud data
- Can't do server-side rendering of resume data (it's client-only)
- IndexedDB has browser-specific storage limits (~50MB-unbounded depending on browser)

## Sync Strategy

```
Local edit → Debounce (2s) → Save to IndexedDB → If authenticated, push to cloud
Cloud change detected → Pull from cloud → Merge with local (version-based) → Save to IndexedDB
Conflict → Last-write-wins using version number + timestamp
```
