# [US-002] Add Error Boundaries

**Epic:** tech-debt
**Type:** Implementation
**Priority:** High
**Status:** Todo
**Estimate:** XS (< 2h)

---

## Problem

There is no `<ErrorBoundary>` anywhere in the app. A runtime error in any component (canvas drawing failure, malformed data, etc.) crashes the **entire page** with a blank white screen.

**Audit finding:** OBS-001.

---

## Acceptance Criteria

- Root-level `<ErrorBoundary>` wrapping the main content in `app/[locale]/layout.tsx`.
- The fallback UI must be user-friendly (not a blank white screen).
- SSR-compatible: the error boundary must only activate on the client.
- `react-error-boundary` package must be added to `package.json`.

---

## Technical Approach

1. Install: `pnpm add react-error-boundary`
2. Create `components/ui/error-boundary-wrapper.tsx`:
```tsx
"use client"
import { ErrorBoundary } from "react-error-boundary"

function FallbackComponent({ error }: { error: Error }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <h2 className="text-xl font-bold">Something went wrong</h2>
      <p className="text-muted-foreground text-sm">{error.message}</p>
      <button onClick={() => window.location.reload()}>Try again</button>
    </div>
  )
}

export function ErrorBoundaryWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary FallbackComponent={FallbackComponent}>
      {children}
    </ErrorBoundary>
  )
}
```
3. Wrap `{children}` in `app/[locale]/layout.tsx` with `<ErrorBoundaryWrapper>`.

---

## Affected Components

- `components/ui/error-boundary-wrapper.tsx` (NEW)
- `app/[locale]/layout.tsx`
- `package.json`
