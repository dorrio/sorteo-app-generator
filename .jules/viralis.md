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

## 2026-01-28 - [All Tools/Metadata]
**Hypothesis:** Extending dynamic metadata support to *all* sub-tools (Dice, Secret Santa, Team Generator, etc.) will close the "Viral Leak" where sharing a customized specific tool reverted to generic metadata.
**Implementation:**
1. Removed `export const dynamic = 'force-static'` from 8 tool pages to enable `searchParams` access in `generateMetadata`.
2. Updated `generateMetadata` in all tool pages to read `template_title` and `template_color` and pass them to `api/og` and `og:url`.
3. Standardized translation keys across `en`, `es`, `pt` to support these dynamic titles without build errors.
**Outcome:** Every tool in the suite now supports full viral context persistence. A user sharing a "Christmas Dice Game" will see exactly that in the link preview, not just "Dice Roller".

## 2026-01-29 - [ShareButton/WinnerCeremony]
**Hypothesis:** If we provide a fallback dropdown menu even when the native Web Share API (`navigator.share`) fails or is cancelled by the user, we will capture ~15% of "bounced" shares where users intended to copy the link but couldn't find the option in the native sheet.
**Implementation:**
1. Refactored `ShareButton` and `WinnerCeremony` to implement a "Hybrid Share" pattern: Always render the fallback menu structure.
2. Intercept native share errors (including cancellations) and programmatically open the fallback dropdown instead of doing nothing.
**Outcome:** Eliminates the "dead end" user experience on mobile when cancelling a share, providing an immediate alternative path to copy the link or share via specific apps.
