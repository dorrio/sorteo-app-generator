# Kanban Board — sorteo-app-generator

_Last updated: 2026-03-09_

---

## 🗂️ Epic: tech-debt

### Sprint 1 — Quick Wins

| Story | Title | Priority | Size | Doc |
|-------|-------|----------|------|-----|
| US-001 | Extract `getBaseUrl()` helper | 🔴 High | XS | [→](epics/tech-debt/US-001-extract-get-base-url.md) |
| US-002 | Add Error Boundaries | 🔴 High | XS | [→](epics/tech-debt/US-002-add-error-boundaries.md) |
| US-003 | Pin dependency versions | 🟡 Medium | XS | [→](epics/tech-debt/US-003-pin-dependency-versions.md) |

### Sprint 2 — Structural Refactor

| Story | Title | Priority | Size | Doc |
|-------|-------|----------|------|-----|
| US-004 | Refactor `main-app.tsx` God Component | ✅ Done | L | [→](epics/tech-debt/US-004-refactor-main-app.md) |
| US-005 | Consolidate `seoMode` if-chains into lookup map | ✅ Done | S | [→](epics/tech-debt/US-005-consolidate-seomode-lookup.md) |

| Story | Title | Priority | Size | Doc |
|-------|-------|----------|------|-----|
| US-006 | Add error tracking (Sentry / Vercel) | ✅ Done | S | [→](epics/tech-debt/US-006-add-error-tracking.md) |
| US-007 | Define structured logging strategy | 🟢 Low | S | [→](epics/tech-debt/US-007-define-structured-logging.md) |

---

## 📋 Todo (Sprint 2)

- **[US-007]** Task 1: Document Logging Strategy (ADR) @unassigned
- **[US-007]** Task 2: Install and Configure Pino Logger @unassigned
- **[US-007]** Task 3: Instrument an API Route / Action @unassigned

---

## 👀 To Review

_(empty)_

- **[US-006]** Add error tracking (Sentry / Vercel) — ✅ merged to `develop` (2026-03-09)

_(empty)_

- **[US-005]** Consolidate `seoMode` if-chains into lookup map — ✅ implemented
- **[US-004]** Refactor `main-app.tsx` God Component — ✅ implemented
- **[US-001]** Extract `getBaseUrl()` helper — ✅ merged to `main` (2026-03-09)
- **[US-002]** Add Error Boundaries — ✅ merged to `main` (2026-03-09)
- **[US-003]** Pin dependency versions — ✅ merged to `main` (2026-03-09)

