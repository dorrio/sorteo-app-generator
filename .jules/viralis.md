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

## 2026-02-04 - [ShareFlow/Friction]
**Hypothesis:** Users manually copying links often paste them into browser bars or non-social apps. The previous "Text + URL" format caused 404s and friction.
**Implementation:** Updated `ShareButton.tsx` and `WinnerCeremony.tsx` "Copy Link" action to copy **URL only**. Added explicit "Invite Friends" CTA for multi-participant lists. Added Telegram and LinkedIn support.
**Outcome:** Expect reduced bounce rate from broken links and higher share engagement due to expanded channel support.

## 2026-02-05 - [Sharing/Platform]
**Hypothesis:** If we add explicit sharing options for Telegram and LinkedIn, users who prefer these networks will share more frequently, and changing the 'Copy Link' feature to copy only the URL will reduce 404 errors caused by pasting the previous 'text + URL' combo directly into browsers.
**Implementation:**
1. Updated `components/ui/share-button.tsx` to add Telegram and LinkedIn `DropdownMenuItem` using respective URLs, and changed `copyToClipboard` to copy only `url`.
2. Updated `components/sorteo/winner-ceremony.tsx` similarly to add Telegram and LinkedIn, and changed `copyToClipboard` to copy only `shareUrl`.
**Outcome:** Expect increased conversion rates from LinkedIn and Telegram due to reduced social friction, and decreased bounce rates caused by malformed pasted URLs.
