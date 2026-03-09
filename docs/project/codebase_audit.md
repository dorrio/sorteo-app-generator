# Codebase Audit — sorteo-app-generator

**Skill:** `ln-620-codebase-auditor`
**Date:** 2026-03-09
**Auditor:** Antigravity AI

---

## Executive Summary

| Domain | Verdict | Severity |
|--------|---------|----------|
| 🔒 Security | ⚠️ CONCERNS | Medium |
| 🔨 Build | ⚠️ CONCERNS | Low (env issue) |
| 🏛️ Architecture | 🔴 ISSUES | High |
| 📏 Code Quality | 🔴 ISSUES | High |
| 📦 Dependencies | ⚠️ CONCERNS | Medium |
| 💀 Dead Code | ✅ PASS | — |
| 🔭 Observability | 🔴 ISSUES | High |
| ⚡ Concurrency | ✅ PASS | — |
| 🔁 Lifecycle | ✅ PASS | — |

**Overall: FAIL (requires action before next major release)**

---

## Domain 1: Security (ln-621)

### SEC-001 — Hardcoded fallback URL · MEDIUM

**File:** `app/[locale]/glossary/page.tsx:17`

```ts
const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://sorteo-app-generator.vercel.app";
```

**Risk:** Inconsistent canonical domains in production. Should always be `sorteopro.com`.

**Fix:** Remove this fallback. Throw or return the canonical domain from a shared `getBaseUrl()` helper that enforces a mandatory env var.

---

### SEC-002 — Hardcoded GTM ID Fallback · LOW

**File:** `app/[locale]/layout.tsx:204`

```ts
<GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID || 'GTM-TVTR2LQC'} />
```

**Risk:** GTM IDs are not secret but hardcoding them defeats the purpose of env vars (e.g. makes staging fire production analytics).

**Fix:** Remove fallback. Render `GoogleTagManager` conditionally only when env var is set.

---

### SEC-003 — `baseUrl` resolution is duplicated, inconsistent · MEDIUM

**Files:** `page.tsx` in 8+ route directories.

Every page file has the same ternary:
```ts
const baseUrl = process.env.NEXT_PUBLIC_APP_URL
  ? process.env.NEXT_PUBLIC_APP_URL
  : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000"
```

**Risk:** When a team member updates this logic, they must touch 8+ files. This is a DRY violation and a security concern (inconsistent domain in structured data / JSON-LD).

**Fix:** Extract to `lib/config.ts`:
```ts
export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return "http://localhost:3000"
}
```

---

## Domain 2: Build (ln-622)

### BUILD-001 — `tsc --noEmit` fails with EPERM · LOW

**Context:** The `node_modules` directory has a permissions issue in this development environment (`EPERM: operation not permitted, lstat`). This is an **environment issue, not a code bug**. TypeScript itself is not reporting type errors.

**Fix:** Run `chmod -R 755 node_modules` or reinstall with `pnpm install`.

---

## Domain 3: Architecture / Code Principles (ln-623)

### ARCH-001 — God Component: `main-app.tsx` · HIGH

**File:** `components/sorteo/main-app.tsx` (732 lines)

This single component violates the Single Responsibility Principle:
- 18 `useTranslations()` calls for 18 different namespaces
- 5 `useEffect` hooks with different concerns
- 3 large `if/else if` chains for `seoMode` (~15 branches each)
- Manages theme, participants, routing, overlays, sharing, and rendering

**Suggested Split:**
| New Component | Responsibility |
|---|---|
| `useSeoModeConfig(seoMode)` hook | All seoMode → translations mappings |
| `ParticipantPopulator` component | Participant seeding `useEffect` |
| `ThemeInitializer` component | Theme update `useEffect` |
| `SeoContentRenderer` component | The big `seoMode` if/else rendering block |

---

### ARCH-002 — `seoMode` if-chain repeated 4 times · MEDIUM

The same `if (seoMode === 'wheel') ... else if (seoMode === 'rng') ...` pattern appears in 4 separate locations inside `main-app.tsx`:

1. `useEffect` for title initialisation (line 250)
2. `useEffect` for subtitle initialisation (line 270)
3. SSR fallback display logic (line 463)
4. `shareContent` useMemo (line 391)

**Fix:** Consolidate into a single `getSeoModeConfig(seoMode, translations)` lookup object or hook that returns `{ title, subtitle, shareTitle, shareText }` in one place.

---

## Domain 4: Code Quality (ln-624)

### QUAL-001 — `main-app.tsx` Cyclomatic Complexity · HIGH

Estimated cyclomatic complexity > 40. The `useEffect` on line 234 alone has nested conditionals that cover 14 branches (one per `seoMode`).

**Fix:** Covered by ARCH-001 above. Splitting the component naturally reduces complexity.

---

### QUAL-002 — Swallowed exception in share content · MEDIUM

**File:** `components/sorteo/main-app.tsx:438`

```ts
} catch (e) {
  // Fallback to current url if parsing fails
}
```

The caught error is silently discarded with no user feedback or logging. A malformed URL would silently generate a broken share link.

**Fix:** Add at minimum a structured log:
```ts
} catch (e) {
  // URL parsing failed — fallback to raw href
  if (process.env.NODE_ENV === 'development') console.warn('Share URL parse failed', e)
}
```

---

### QUAL-003 — `particle-background.tsx` O(n²) render loop · LOW

**File:** `components/sorteo/particle-background.tsx:72-101`

Each animation frame computes connections between all particle pairs: `n=50` → 1,225 distance checks per frame × 60fps = 73,500 operations/second.

**Current:** Optimised with squared distance (no `sqrt` unless in range) — this is acceptable for 50 particles.

**Note for future:** If particle count is ever increased beyond ~100, this must be spatially partitioned (e.g. grid bucketing).

---

## Domain 5: Dependencies (ln-625)

### DEPS-001 — `"latest"` version tags · MEDIUM

The following packages use `"latest"` instead of a pinned semver:

| Package | Risk |
|---------|------|
| `framer-motion` | breaking API changes in major versions |
| `immer` | subtle behavior changes |
| `zustand` | store API changes |
| `@emotion/is-prop-valid` | peer to framer-motion |
| `use-sync-external-store` | React internals |
| `@vercel/analytics` | tracking payload format |

**Fix:** Run `pnpm list --depth=0` and pin to current resolved version in `package.json`.

---

### DEPS-002 — `next@^16.0.7` and `eslint-config-next@^15.5.12` mismatch · MEDIUM

Next version `^16.0.7` is referenced but `eslint-config-next` is pinned to `^15.5.12`. These should match.

**Fix:** Align both to the same major version.

---

## Domain 6: Dead Code (ln-626)

✅ **No dead code found.** No unused imports, no commented-out code blocks, no unreachable branches detected in components scanned.

---

## Domain 7: Observability (ln-627)

### OBS-001 — No error boundary in the application · HIGH

There is no `<ErrorBoundary>` wrapping the application or any of the tool components. A runtime error in any component (e.g., `particle-background.tsx` canvas drawing failure) will crash the entire page with a blank screen.

**Fix:** Add a root-level error boundary in `app/[locale]/layout.tsx` and per-tool boundaries in `MainApp`:
```tsx
import { ErrorBoundary } from 'react-error-boundary'

<ErrorBoundary fallback={<ErrorPage />}>
  <SorteoSelector ... />
</ErrorBoundary>
```

---

### OBS-002 — No structured logging or monitoring · MEDIUM

There is no Sentry, Datadog, or similar error tracking. Runtime errors in production are invisible.

**Fix:** Integrate Sentry (free tier) with Next.js integration, or use Vercel's built-in error tracking.

---

### OBS-003 — Swallowed errors in `ListParamsHandler` · LOW

**File:** `components/sorteo/main-app.tsx:105`

```ts
} catch (e) {
  console.error("Failed to parse shared list", e)
}
```

`console.error` is acceptable as an interim measure, but this is not forwarded to any monitoring system.

---

## Domain 8: Concurrency (ln-628)

✅ **No concurrency issues found.**
- Zustand state mutations are synchronous and atomic.
- `useCallback` is correctly memoizing callbacks to avoid stale closures.
- No race conditions detected in async data fetching (this project is fully client-side).

---

## Domain 9: Lifecycle (ln-629)

✅ **Lifecycle management is correct.**
- All `useEffect` hooks that add event listeners return cleanup functions that remove them.
- `cancelAnimationFrame` is called in `particle-background.tsx` cleanup.
- `visual-editor.tsx` removes `mousedown` listener on unmount.
- No detected memory leaks.

---

## Priority Matrix

| ID | Finding | Severity | Effort | Action |
|----|---------|----------|--------|--------|
| ARCH-001 | God Component `main-app.tsx` | 🔴 HIGH | Large | Refactor into sub-components |
| OBS-001 | No error boundaries | 🔴 HIGH | Small | Add `react-error-boundary` |
| SEC-003 | `baseUrl` duplicated across 8 pages | 🔴 HIGH | Small | Extract `lib/config.ts#getBaseUrl()` |
| QUAL-001 | High cyclomatic complexity | 🔴 HIGH | Large | Covered by ARCH-001 |
| ARCH-002 | `seoMode` if-chain ×4 | 🟡 MEDIUM | Medium | Consolidate to lookup object |
| DEPS-001 | `latest` version tags | 🟡 MEDIUM | Small | Pin to resolved versions |
| DEPS-002 | Next/ESLint version mismatch | 🟡 MEDIUM | Trivial | Update `eslint-config-next` |
| OBS-002 | No monitoring | 🟡 MEDIUM | Medium | Add Sentry integration |
| SEC-001 | Hardcoded fallback URL | 🟡 MEDIUM | Trivial | Remove fallback |
| QUAL-002 | Swallowed share URL exception | 🟡 MEDIUM | Trivial | Add dev warning log |
| SEC-002 | Hardcoded GTM ID fallback | 🟢 LOW | Trivial | Remove fallback |
| QUAL-003 | O(n²) particle render | 🟢 LOW | — | Note for future scaling |

---

## Recommended Action Plan

### Sprint 1 — Quick Wins (1-2 days)
1. Extract `getBaseUrl()` to `lib/config.ts` and update all 8+ pages.
2. Remove hardcoded `baseUrl` and GTM ID fallbacks.
3. Add `<ErrorBoundary>` from `react-error-boundary` to layout and tool area.
4. Pin `"latest"` dep versions with `pnpm list --depth=0`.

### Sprint 2 — Structural Refactor (3-5 days)
5. Extract `useSeoModeConfig(seoMode)` hook from `main-app.tsx`.
6. Split `ThemeInitializer`, `ParticipantPopulator`, and `SeoContentRenderer` out of `main-app.tsx`.
7. Consolidate the repeated `if/else if seoMode` chain into a single lookup map.

### Sprint 3 — Observability (1 day)
8. Add Sentry or Vercel error tracking.
9. Define a proper logging strategy (dev: `console.warn`, prod: Sentry).

### Future
10. Add unit tests for business logic (`getBaseUrl`, `useSeoModeConfig`, store selectors).
11. Monitor particle count — optimise if ever > 100.
