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

## 2026-01-29 - [Share/SmartHybridShare]
**Hypothesis:** If we restrict the Native Web Share API (`navigator.share`) to only trigger on touch-enabled devices (`(pointer: coarse)`), we will reduce friction for desktop users who currently see unhelpful native OS share dialogs, while preserving the seamless one-click sharing experience for mobile users. The custom dropdown menu is superior on desktop.
**Implementation:** Updated `canShareNative` logic in `ShareButton`, `WinnerCeremony`, and `VerifyContent` components to evaluate `window.matchMedia('(pointer: coarse)').matches` alongside the existence of `navigator.share`.
**Outcome:** Expect increased successful link copies and higher share completion rates on desktop environments without negative impact on mobile sharing.

## 2026-01-30 - [Share/Dropdowns]
**Hypothesis:** If we add Telegram and LinkedIn sharing options to the fallback DropdownMenu components (`ShareButton` and `WinnerCeremony`), we will tap into professional networks and private messaging clusters, increasing the K-Factor and overall visibility of the sweepstakes.
**Implementation:** Updated `components/ui/share-button.tsx` and `components/sorteo/winner-ceremony.tsx` to include `telegramUrl` (`https://t.me/share/url?url={url}&text={text}`) and `linkedinUrl` (`https://www.linkedin.com/sharing/share-offsite/?url={url}`) computations, and added `DropdownMenuItem` entries for both platforms.
**Outcome:** Expect increased sharing across professional circles and encrypted messaging, leading to a higher conversion rate.

## 2026-05-24 - [Share/CopyLink]
**Hypothesis:** If we change the "Copy Link" action to copy *only* the URL instead of prefixing it with descriptive text (`${text} ${url}`), we will prevent "404 Not Found" or invalid URL errors that occur when users paste the copied text directly into their browser's address bar.
**Implementation:** Updated `copyToClipboard` in `components/ui/share-button.tsx`, `components/sorteo/winner-ceremony.tsx`, and `app/[locale]/verify/verify-content.tsx` to copy `url` or `shareUrl` strictly without any preceding text.
**Outcome:** Expect a reduction in broken links and higher conversion rate from direct link sharing via copy-paste.
