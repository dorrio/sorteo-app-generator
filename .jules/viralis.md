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

## 2026-01-29 - [WinnerCeremony/Share]
**Hypothesis:** Sharing the actual Winner Certificate image directly via Native Share API (instead of just a link) will significantly increase engagement and reshare rates on visual platforms like WhatsApp and Instagram Stories.
**Implementation:** Updated `shareNative` in `WinnerCeremony` and `VerifyContent` to asynchronously generate the OG Image as a Blob and attach it to the `navigator.share` payload.
**Outcome:** Expect higher viral loop conversion as users can instantly share the "Proof of Victory" image with one tap.
