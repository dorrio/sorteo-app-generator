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

### Sprint 3 — Observability

| Story | Title | Priority | Size | Doc |
|-------|-------|----------|------|-----|
| US-006 | Add error tracking (Sentry / Vercel) | 🟡 Medium | S | [→](epics/tech-debt/US-006-add-error-tracking.md) |
| US-007 | Define structured logging strategy | 🟢 Low | S | _(pending)_ |

---

## 📋 Todo (Sprint 2)

_(empty)_

---

## 👀 To Review

- **[US-006]** Task 1: Initialize Vercel Error Tracking Integration — ✅ implemented
- **[US-006]** Task 2: Update App Layout & Error Boundaries — ✅ implemented
- **[US-006]** Task 3: Implement Test Endpoint & Validate Alerts — ✅ implemented

_(empty)_

- **[US-005]** Consolidate `seoMode` if-chains into lookup map — ✅ implemented
- **[US-004]** Refactor `main-app.tsx` God Component — ✅ implemented
- **[US-001]** Extract `getBaseUrl()` helper — ✅ merged to `main` (2026-03-09)
- **[US-002]** Add Error Boundaries — ✅ merged to `main` (2026-03-09)
- **[US-003]** Pin dependency versions — ✅ merged to `main` (2026-03-09)

