# AGENTS.md

Development rules and environment guide for AI agents (Jules, Claude, Codex, Cursor, Gemini, etc.) working in this repo.

> Nested `AGENTS.md` files exist in `messages/`, `components/sorteo/`, `app/[locale]/`, and `tests/`. When touching files inside those directories, read the nearest `AGENTS.md` first — agents load the closest one to the files they edit.

---

## 1. Stack

- **Framework:** Next.js `16.1.6` (App Router, React Server Components enabled)
- **Runtime:** React `19.2`, TypeScript `~5.9` (strict mode)
- **Styling:** Tailwind CSS `v4` (via `@tailwindcss/postcss`), `tw-animate-css`
- **UI kit:** shadcn/ui (`new-york` style) + Radix UI primitives + `lucide-react` icons
- **State:** Zustand (`lib/sorteo-store.ts`, persisted via `zustand/middleware`)
- **Animations:** Framer Motion (use with care — see rules below)
- **i18n:** `next-intl` v4 — locales: `en` (default), `es`, `pt`
- **Forms:** `react-hook-form` + `zod`
- **Monitoring:** Sentry (`@sentry/nextjs`, tunnel route `/monitoring`)
- **Analytics:** Vercel Analytics + Speed Insights, Google Tag Manager
- **Testing:** Playwright (`tests/e2e/`) — no unit test framework configured
- **Package manager:** `pnpm` (always — do not use `npm` or `yarn`)
- **Node:** use the version in `.nvmrc` if present, otherwise Node `>=20`

There is **no backend, no database, no Prisma, no auth**. This is a client-heavy Next.js app with RSC for SEO content. All persistence is in `localStorage` via Zustand.

---

## 2. Environment setup

First-time setup on a fresh VM (Jules runs this automatically if configured in the setup script):

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm exec playwright install --with-deps chromium   # only if you will run e2e tests
```

### Commands (all use `pnpm`)

| Command | Purpose |
|---|---|
| `pnpm dev` | Next dev server on `http://localhost:3000` |
| `pnpm build` | Production build (runs `next-sitemap` postbuild) |
| `pnpm start` | Start production server (after `build`) |
| `pnpm lint` | ESLint (`next/core-web-vitals` + `next/typescript`) |
| `pnpm lint:fix` | ESLint with autofix |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm test:e2e` | Playwright e2e (auto-spawns `pnpm dev` via `webServer` in `playwright.config.ts`) |
| `pnpm test:e2e -- path/to/spec.ts` | Run a single spec |
| `pnpm test:e2e:ui` | Playwright interactive UI mode |
| `pnpm verify` | `lint` + `typecheck` — **run before opening a PR** |

### Required before every PR

```bash
pnpm verify
pnpm build           # catches RSC/metadata errors that lint misses
pnpm test:e2e        # if you touched pages, routing, or UI that the e2e specs exercise
```

Do not submit a PR without these passing. If a command fails, fix it — do not open the PR with a known-broken check.

### Environment variables

None are required to run `dev`, `build`, `lint`, `typecheck`, or `test:e2e` locally. These are optional and only take effect in production builds:

- `SENTRY_DSN` / `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_ORG`, `SENTRY_PROJECT` — Sentry config
- `NEXT_PUBLIC_GTM_ID` — Google Tag Manager
- `BASE_URL` — Overrides Playwright's auto-spawned dev server when running e2e against a deployed URL

---

## 3. Repository layout

```
app/
  [locale]/              # all user-facing routes live under this i18n segment
    layout.tsx           # RootLayout — fonts, providers, JSON-LD (Software/Org/WebSite)
    page.tsx             # homepage (MainApp + WheelGeo + Glossary + SeoContent)
    <tool>/page.tsx      # one folder per tool landing page (dice-roller, coin-flip, …)
  api/
    og/                  # dynamic OG image generation (ImageResponse)
  global-error.tsx       # Sentry global error boundary
components/
  sorteo/                # app-specific components (drawing modes, GEO sections, main-app)
    modes/               # the 6 sorteoStyle implementations (grid, slot, matrix, …)
    hooks/               # component-local hooks
  ui/                    # shadcn/ui primitives — do NOT hand-edit; regenerate via shadcn CLI
  versus/                # versus-tool-specific components
hooks/                   # mixed: React hooks (use-mobile, use-toast) + Claude Code hook scripts (*.py)
lib/
  sorteo-store.ts        # Zustand store (Participants, theme, winner, history)
  utils.ts               # `cn()`, `safeJsonLdStringify()`
  config.ts              # `getBaseUrl()`
  countries.ts           # static country list
i18n/
  routing.ts             # locales = ['en','es','pt'], defaultLocale = 'en'
  request.ts             # loads messages/<locale>.json per request
messages/                # en.json, es.json, pt.json (nested AGENTS.md)
middleware.ts            # next-intl middleware (matcher '/', '/(es|en|pt)/:path*')
next.config.mjs          # Sentry + next-intl wrappers, optimizePackageImports
sentry.{client,edge,server}.config.ts
instrumentation.ts       # Sentry instrumentation
tests/e2e/               # Playwright specs (nested AGENTS.md)
playwright.config.ts
```

**Path alias:** `@/*` maps to the repo root (e.g., `@/components/ui/button`, `@/lib/utils`). Always use the alias — never relative paths like `../../components`.

---

## 4. Coding conventions

### 4.1 General
- **Language:** all code, comments, commit messages, and PR descriptions in **English**.
- **Types:** strict TS, no `any` unless interoperating with untyped external data (then narrow immediately).
- **Naming:** descriptive, no abbreviations. Components `PascalCase`, hooks `useCamelCase`, files `kebab-case.tsx`.
- **Small, focused diffs.** One concern per PR. Don't refactor surrounding code unrelated to the task.
- **Don't add speculative abstractions, fallbacks, or feature flags.** Only handle errors at real system boundaries (fetch, user input, external API).
- **Comments:** rare. Explain *why*, not *what*. No task IDs, no history. If a well-named symbol already tells the story, no comment.

### 4.2 Next.js / App Router
- Default to **Server Components**. Add `"use client"` only when the component genuinely needs state, effects, browser APIs, or event handlers.
- Extract client interactivity into small "islands" (see `TryToolButton`, `WheelVisual`) and keep parents server.
- `params` and `searchParams` are **Promises** in Next 16 — always `await` them: `const { locale } = await params`.
- Use `setRequestLocale(locale)` at the top of every `[locale]` layout/page to enable static rendering.
- `generateStaticParams` must return `routing.locales.map((locale) => ({ locale }))`.
- Dynamic metadata in `generateMetadata` can read `searchParams` (e.g., `template_title`, `template_color` for viral shares). Do NOT re-add `export const dynamic = 'force-static'` on tool pages — it breaks dynamic OG images.
- Navigation: import `Link`, `useRouter`, `usePathname`, `redirect` from `@/i18n/routing` (NOT from `next/link` or `next/navigation`) so locale prefixing works.

### 4.3 Styling
- Tailwind **v4** syntax — CSS-first config in `app/globals.css` (`@theme`, `@custom-variant`, etc.). **No `tailwind.config.ts`** — don't create one. If you need a new token or utility, add it to `globals.css`.
- Use `cn()` from `@/lib/utils` for conditional classes.
- Follow the dark-themed design system already in `globals.css` (CSS variables: `--primary`, `--foreground`, `--background`, …).
- Icons: `lucide-react` only.
- shadcn/ui: **do not hand-edit `components/ui/*`**. To add a new primitive: `pnpm dlx shadcn@latest add <component>`.

### 4.4 State
- All giveaway/theme state lives in the Zustand store at `lib/sorteo-store.ts`. Don't create parallel stores.
- Winner selection MUST go through `selectSecureWinner()` — it uses `crypto.getRandomValues` for unbiased selection and generates a verification ID. Never use `Math.random()` for winner selection.
- The store is persisted to `localStorage` under key `sorteo-storage` with a `partialize` allowlist. If you add a field that must survive reloads, update `partialize` explicitly.
- Access hydrated state via `hasHydrated` to avoid SSR mismatch flashes.

### 4.5 i18n (next-intl)
- **Any new user-facing string MUST be added to all 3 locale files** (`messages/en.json`, `messages/es.json`, `messages/pt.json`) with identical key paths. A missing key will throw at runtime and break SSR.
- Prefer `useTranslations('Namespace')` in components and `getTranslations({ locale, namespace })` in server code.
- For interpolated rich text, use `t.rich(key, { b: (c) => <strong>{c}</strong>, … })` — see `wheel-geo.tsx` for the pattern.
- Never inline user-visible strings. Never use English as a fallback in code — missing translations are treated as bugs, not soft-fallbacks.
- See [`messages/AGENTS.md`](./messages/AGENTS.md) for the full workflow.

### 4.6 Performance rules (hard constraints)
These come from `.jules/performance_rules.md` and are **non-negotiable**:

- **No entrance animations on LCP elements.** No `initial={{ opacity: 0 }}` on headers, H1s, hero images, or the main section.
- **No `framer-motion` or `animate-pulse` on static GEO components** (anything ending in `-geo.tsx` or inside `SeoContent`). They are server-rendered for crawlers — keep them plain HTML/CSS.
- **Heavy interactive widgets** (`Confetti`, `VisualEditor`, `MainApp`, drawing modes) load via `next/dynamic`, often with `ssr: false` and a skeleton fallback.
- **New dependencies over ~10 KB gzipped** must be dynamically imported, not added to the main bundle.
- **`next/image`** with explicit `width`/`height` (or `fill` inside a sized container) to prevent CLS. Formats `avif`/`webp` already enabled.
- **Scroll/resize/touch listeners** must be `{ passive: true }` and throttled via `requestAnimationFrame` (see `sticky-share-footer.tsx`).
- If you add a Radix or icon-heavy package, add it to `experimental.optimizePackageImports` in `next.config.mjs`.

### 4.7 SEO / GEO
- Every tool page renders a JSON-LD block using `safeJsonLdStringify()` from `@/lib/utils` — never raw `JSON.stringify` (it doesn't escape `<`, `>`, `&`). Use `dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(jsonLd) }}`.
- Always supply `generateMetadata` with `alternates.canonical` and `openGraph`/`twitter` blocks.
- The `-geo.tsx` components ("Direct Answer" blocks) are SEO-critical — visible FAQs, HowTo schema, semantic landmarks (`section`, `ul[role="list"]`, `dl/dt/dd`, `aria-labelledby`). Don't regress these into generic `div` soup.

### 4.8 Sentry
- Do not log PII, participant names, participant emails, or winner data to Sentry. The store lives in the browser — there is no server-side capture of user content, and it should stay that way.
- Do not disable the tunnel route (`/monitoring`) or `hideSourceMaps`.

### 4.9 Testing
- E2E specs live in `tests/e2e/` and use Playwright. See [`tests/AGENTS.md`](./tests/AGENTS.md).
- There is no Vitest/Jest. If the task requires unit tests, ask first before introducing a new test framework.

---

## 5. Workflow for agents

1. **Understand before editing.** Read the nearest `AGENTS.md`, then the files you intend to touch, then adjacent siblings for patterns.
2. **Plan small.** Break work into minimal, verifiable steps.
3. **Write the change.** Match existing style — imports order, quote style, semicolons, indentation.
4. **If you add a new user-facing string → update `en.json`, `es.json`, `pt.json`.** No exceptions.
5. **Verify locally:**
   ```bash
   pnpm verify            # lint + typecheck
   pnpm build             # catches RSC/metadata/i18n errors
   pnpm test:e2e          # if you touched pages/UI/routing
   ```
6. **Commit message:** short, imperative, English (`feat: add random-card tool`, `fix: prevent CLS on wheel visual`).
7. **PR description:** what changed and *why*, test plan, screenshots for UI changes. Mention any locale keys added.

### What NOT to do

- ❌ Don't introduce a backend, DB, Prisma, or auth — none of that exists here.
- ❌ Don't use `Math.random()` for winner selection — use `selectSecureWinner()`.
- ❌ Don't hand-edit `components/ui/*` — use the shadcn CLI.
- ❌ Don't add user-visible strings outside `messages/*.json`.
- ❌ Don't re-add `framer-motion` to `-geo.tsx` components or `SeoContent`.
- ❌ Don't use `next/link` directly — use the localized `Link` from `@/i18n/routing`.
- ❌ Don't create a `tailwind.config.ts` — this is Tailwind v4, config lives in CSS.
- ❌ Don't commit with failing `pnpm verify` or known-broken build.

---

## 6. Operational journals

Prior context (not instructions, but useful background) lives in:

- [`.jules/apex.md`](./.jules/apex.md) — SEO/content growth log
- [`.jules/viralis.md`](./.jules/viralis.md) — social-share/viral loop experiments
- [`.jules/nexus.md`](./.jules/nexus.md) — accessibility / semantic-HTML fixes
- [`.jules/performance_rules.md`](./.jules/performance_rules.md) — **canonical performance rules** (section 4.6 summarizes these)
- [`.jules/audit_log.md`](./.jules/audit_log.md) — performance audit history

Read the relevant journal before making changes in the same area so you don't undo a previous fix.
