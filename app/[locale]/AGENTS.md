# AGENTS.md — `app/[locale]/`

Internationalized App Router segment. Every user-facing page lives here.

## Structure

- `layout.tsx` — RootLayout: fonts (`Inter`, `Space_Grotesk`, `Geist_Mono`), providers (`NextIntlClientProvider`, `ThemeProvider`, `ErrorBoundaryWrapper`, `Toaster`), global JSON-LD (`SoftwareApplication`, `Organization`, `WebSite`), GTM, skip-to-content link.
- `page.tsx` — homepage (`Sorteo Pro`).
- `<tool>/page.tsx` — one folder per tool landing page: `wheel-of-names`, `random-number-generator`, `list-randomizer`, `coin-flip`, `dice-roller`, `random-letter-generator`, `random-month-generator`, `random-country-generator`, `random-card-generator`, `bingo-number-generator`, `truth-or-dare-generator`, `rock-paper-scissors`, `secret-santa-generator`, `team-generator`, `instagram-comment-picker`, `yes-or-no-wheel`, `glossary`, `versus/…`, `alternativa-*`.
- `verify/` — giveaway verification flow.
- `error.tsx` — per-locale error boundary.

## Hard rules

1. **Always `await` `params` and `searchParams`** — they're Promises in Next 16:
   ```ts
   const { locale } = await params;
   const { template_title } = await searchParams;
   ```
2. **Call `setRequestLocale(locale)`** at the top of every layout/page to enable static rendering.
3. **`generateStaticParams`** must return `routing.locales.map((locale) => ({ locale }))` from `@/i18n/routing`.
4. **Validate the locale** (`if (!routing.locales.includes(locale as any)) notFound()`) in `layout.tsx` — already done; don't remove it.
5. **`generateMetadata`** is required on every page:
   - `alternates.canonical` — absolute or relative path including the locale.
   - `alternates.languages` — include all three locales where applicable.
   - `openGraph` + `twitter` blocks with dynamic `ogImageUrl` via `/api/og`.
   - Support `template_title` / `template_color` / `list` searchParams for viral share customization (see `viralis.md` pattern in `page.tsx`).
6. **Do NOT add `export const dynamic = 'force-static'`** to tool pages — it blocks `searchParams` access in `generateMetadata` and breaks the dynamic OG image / viral loop. Tool pages stay opt-in dynamic so shares render custom branding.
7. **JSON-LD** via `dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(jsonLd) }}`. Include a `BreadcrumbList` per page and any tool-specific schema (`FAQPage`, `HowTo`, `SoftwareApplication`).
8. **Navigation** inside pages: import `Link` from `@/i18n/routing`, not `next/link`.
9. **Heavy clients** (`MainApp`, drawing UIs) load via `next/dynamic` at the top of `page.tsx` with a skeleton fallback. The `-geo.tsx` / `glossary` / `seo-content` components render server-side for crawlers.

## Adding a new tool page

1. Create `app/[locale]/<tool-slug>/page.tsx` mirroring an existing tool (e.g., `dice-roller/page.tsx`).
2. Create the matching `-geo.tsx` component in `components/sorteo/` (Server Component, see rules in `components/sorteo/AGENTS.md`).
3. Add all user-visible strings to `messages/en.json`, `messages/es.json`, `messages/pt.json` under a new namespace (e.g., `DiceGeoPage`).
4. Add the tool to the footer/glossary internal linking where appropriate.
5. Add an entry in `next-sitemap.config.js` if it needs custom priority/changefreq.
6. Add at least one Playwright smoke test in `tests/e2e/` verifying the `h1` and a distinctive glossary term render in `es` (the highest-traffic locale).
