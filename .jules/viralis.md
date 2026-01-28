# Viralis Journal - Growth Experiments

## 2026-01-26 - [VerifyPage/Metadata]
**Hypothesis:** If we include `type`, `title`, and `color` parameters in the `og:url` (canonical URL) of the verification page, social platforms will correctly index the specific branded version of the page, preserving the "Viral Loop" context (custom branding and return path) for subsequent shares.
**Implementation:** Updated `generateMetadata` in `app/[locale]/verify/page.tsx` to append these parameters to `canonicalUrl`.
**Outcome:** Expect improved consistency in link previews and higher retention of "Viral Loop" context (users returning to the correct tool variant).

## 2026-01-27 - [Metadata/OG Image]
**Hypothesis:** If we dynamically inject the giveaway title (from `template_title`) into the Page Title and Open Graph Image, users will see "Win a PS5" instead of "Wheel of Names" on social media, increasing CTR by estimated 20%.
**Implementation:**
1. Enhanced `app/api/og/route.tsx` to support custom titles/colors in Tool Promo mode.
2. Updated `app/[locale]/wheel-of-names/page.tsx` and `app/[locale]/page.tsx` to read `searchParams` and override metadata.
**Outcome:** Shared links now show the exact custom giveaway name and branding color, reducing the disconnect between the "invite" and the "landing page".
