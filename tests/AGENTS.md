# AGENTS.md — `tests/`

Playwright end-to-end tests. No unit-test framework is configured.

## Layout

```
tests/
  e2e/
    <name>.spec.ts
```

Config: [`../playwright.config.ts`](../playwright.config.ts).

## Running

```bash
pnpm test:e2e                    # headless, auto-starts `pnpm dev` as webServer
pnpm test:e2e -- tests/e2e/card-bingo.spec.ts    # single file
pnpm test:e2e:ui                 # interactive UI mode
BASE_URL=https://preview.example pnpm test:e2e   # run against a deployed URL (skips webServer)
```

First time on a new VM: `pnpm exec playwright install --with-deps chromium` (or `pnpm test:e2e:install`).

## Conventions

- **Use `baseURL`.** `playwright.config.ts` sets `baseURL`, so specs can do `await page.goto('/es/dice-roller')` — no `http://localhost:3000` prefix needed. The existing `card-bingo.spec.ts` predates this and still uses a manual `BASE_URL` env — fine to keep, but new specs should use relative paths.
- **Prefer Spanish (`/es/...`) locale for smoke tests** — highest traffic and most-translated strings. Add `/en` variants when a test covers locale-sensitive behavior (metadata, canonical URLs).
- **Test user-visible text, not DOM structure.** Use `page.getByRole('heading', ...)`, `page.getByText(...)` — resilient to refactors. Avoid deep CSS selectors.
- **No flaky waits.** Use Playwright's auto-waiting (`expect(...).toBeVisible()`, `toHaveText(...)`). Don't `page.waitForTimeout(...)`.
- **Mock nothing by default.** These are end-to-end; if a test needs to mock the network, ask first.

## Scope

Good candidates for an e2e test:

- Each tool's landing page renders its `h1` and a glossary-term signal (see existing `card-bingo.spec.ts`).
- The homepage starts a giveaway flow (add participants → start → winner ceremony appears).
- Locale switching preserves the current tool slug.
- Viral loop: visiting `/es/wheel-of-names?template_title=Foo` surfaces `Foo` in the `<title>` and `og:image`.

Things that are NOT e2e territory — don't add them here:

- Pure utility tests (e.g., `safeJsonLdStringify`) — no unit framework yet; ask before adding one.
- Visual regression — we don't have a baseline snapshot system. Use DOM assertions instead.

## Before committing a test

- The test passes locally against `pnpm dev`.
- The test name is imperative and describes the outcome, not the mechanism (`"Random Card Generator loads correctly"` ✅; `"it clicks the button"` ❌).
- No console errors expected from the page under test — if there are, fix them or document why.
