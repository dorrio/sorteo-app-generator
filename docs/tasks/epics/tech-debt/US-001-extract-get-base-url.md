# [US-001] Extract getBaseUrl() helper

**Epic:** tech-debt
**Type:** Refactoring
**Priority:** High
**Status:** Todo
**Estimate:** XS (< 2h)

---

## Problem

The `baseUrl` resolution ternary is duplicated in 8+ page files:

```ts
const baseUrl = process.env.NEXT_PUBLIC_APP_URL
  ? process.env.NEXT_PUBLIC_APP_URL
  : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000"
```

Additionally, `app/[locale]/glossary/page.tsx` has a hardcoded fallback URL:
```ts
|| "https://sorteo-app-generator.vercel.app"
```

**Audit finding:** SEC-001, SEC-003.

---

## Acceptance Criteria

- `lib/config.ts` exports a `getBaseUrl()` function with the canonical resolution logic.
- All 8+ page files import and use `getBaseUrl()` instead of the inline ternary.
- The hardcoded `"https://sorteo-app-generator.vercel.app"` fallback in `glossary/page.tsx` is removed.
- No unit tests needed — the logic is trivial. An integration test (existing E2E) is sufficient.

---

## Technical Approach

1. Create `lib/config.ts`:
```ts
export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return "http://localhost:3000"
}
```

2. Search for all occurrences: `grep -r "process.env.NEXT_PUBLIC_APP_URL" app/`
3. Replace each with `import { getBaseUrl } from "@/lib/config"` + `getBaseUrl()`.

---

## Affected Components

- `lib/config.ts` (NEW)
- `app/[locale]/page.tsx`
- `app/[locale]/layout.tsx`
- `app/[locale]/glossary/page.tsx`
- `app/[locale]/random-number-generator/page.tsx`
- `app/[locale]/list-randomizer/page.tsx`
- `app/[locale]/secret-santa-generator/page.tsx`
- `app/[locale]/random-card-generator/page.tsx`
- `app/[locale]/versus/page.tsx`
- `app/[locale]/versus/random-org-vs-sorteo-pro/page.tsx`
