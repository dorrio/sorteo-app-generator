---
name: gen-test
description: "Generate unit or E2E tests for components and routes. Use when asked to write tests, add test coverage, or create test files for React components, Next.js pages, API routes, or utilities."
---

# Test Generator

Generate tests following the project conventions.

## Test Framework Detection

Before generating tests, check which frameworks are available:

1. **E2E tests (Playwright)**: Always available. Config at `playwright.config.ts`. Existing tests at `tests/e2e/`.
2. **Unit tests (Vitest)**: Check if `vitest` is in `package.json`. If not installed, recommend adding it:
   ```bash
   pnpm add -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom
   ```

## E2E Test Convention

Follow the pattern in `tests/e2e/card-bingo.spec.ts`:

- Place E2E tests in `tests/e2e/<feature>.spec.ts`
- Use `const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'`
- Test with locale prefix in URL path (e.g., `/es/route-name`)
- Use descriptive test names in English
- Assert page content loads correctly with `toContainText`

## Unit Test Convention

- Place unit tests adjacent to source: `component.test.tsx` next to `component.tsx`
- Use `describe`/`it` blocks with clear English descriptions
- For React components: use `@testing-library/react` with `render`, `screen`, `fireEvent`
- For utilities/hooks: test pure logic without rendering
- Mock `next-intl` translations with `NextIntlClientProvider`

## Rules

- All test descriptions and comments in English
- TypeScript strict: fully typed test utilities and mocks
- Test user-visible behavior, not implementation details
- For i18n components, test with at least one locale
- Never hardcode translation strings; use translation keys or mock the translation function
- Include both happy path and error scenarios
