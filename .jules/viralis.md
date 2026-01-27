# Viralis Journal - Growth Experiments

## 2026-01-26 - [VerifyPage/Metadata]
**Hypothesis:** If we include `type`, `title`, and `color` parameters in the `og:url` (canonical URL) of the verification page, social platforms will correctly index the specific branded version of the page, preserving the "Viral Loop" context (custom branding and return path) for subsequent shares.
**Implementation:** Updated `generateMetadata` in `app/[locale]/verify/page.tsx` to append these parameters to `canonicalUrl`.
**Outcome:** Expect improved consistency in link previews and higher retention of "Viral Loop" context (users returning to the correct tool variant).
