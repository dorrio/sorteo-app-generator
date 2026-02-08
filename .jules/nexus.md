# Nexus Journal - Semantic Accessibility Log

## 2024-05-22 - MainApp/Header
**Blocker:** The application logo/title in the header was a non-interactive `div`, creating a navigation trap (users cannot click to go home) and missing an opportunity to pass internal link juice to the root domain.
**Bridge:** Wrapped the logo and title in a `Link` component pointing to `/` with an `aria-label`.
**Signal:** Improved internal linking structure (SEO) and restored expected navigation behavior (UX/A11y).

## 2024-05-23 - ListRandomizerGeo/PopularUses
**Blocker:** "Popular Uses" section in List Randomizer was a collection of generic `div`s, hiding the relationship between items from crawlers.
**Bridge:** Converted the grid container to a `ul` with `role="list"` and items to `li`.
**Signal:** Improved semantic landmarks (Priority 3), reinforcing the relationship between the use cases for the List Randomizer tool.

## 2024-05-24 - VisualEditor/SelectionControls
**Blocker:** Visual Editor selection states (Presets, Styles, Views) were visual-only (border colors), making them "Semantic Voids" for screen readers and bots, as they relied solely on CSS classes for state indication.
**Bridge:** Implemented `role="radiogroup"` on containers and `role="radio"` with `aria-checked` attributes on individual buttons.
**Signal:** Improved WCAG compliance by exposing state to assistive technologies and search bots, ensuring the interactive structure is machine-readable.

## 2024-05-25 - WinnerCeremony
**Blocker:** The `WinnerCeremony` modal lacks semantic role definition, making it a "Semantic Void". Screen readers cannot detect the context switch to a dialog, nor identify the winner information immediately.
**Bridge:** Add `role="dialog"`, `aria-modal="true"`, and connect the title and winner name via `aria-labelledby` and `aria-describedby`.
**Signal:** Improved accessibility compliance (WCAG) and better context for bots crawling the "Success" state (if they ever trigger it, or for the static snapshot if rendered).

## 2024-05-26 - RootLayout
**Blocker:** The application lacked a "Skip to Content" link, forcing keyboard users and screen readers to navigate through repetitive header elements before reaching the main tool, and missing a standard structural signal for search engines.
**Bridge:** Implemented a semantic `<a>` tag as the first child of `<body>` pointing to `#sorteo-section`, visible only on focus.
**Signal:** Improved WCAG 2.4.1 compliance and provided a clear "Main Content" signal to crawlers (Priority 1 Navigation).

## 2024-05-27 - MainApp/Sidebar
**Blocker:** Sidebar tools (Participants, History) were generic `div` wrappers, hiding their functional boundaries within the `aside`.
**Bridge:** Converted wrappers to `section` elements and linked them to their headings via `aria-labelledby`.
**Signal:** Improved semantic landmarks (Priority 3), enhancing structural clarity for crawlers and assistive technology.

## 2026-02-02 - SorteoRoulette
**Blocker:** The "Wheel of Names" component (`SorteoRoulette`) was a collection of generic `div`s, hiding the list of participants from crawlers and screen readers.
**Bridge:** Converted the container to a `div` with `role="list"` and participants to `div`s with `role="listitem"`, while hiding decorative elements with `aria-hidden="true"`.
**Signal:** Improved semantic structure (Priority 3), ensuring the core content (participants list) is indexable and accessible.

## 2026-02-03 - SiteFooter
**Blocker:** The footer navigation links were generic `div`s without a semantic landmark, and the "Extended Tools" list lacked an accessible heading (hidden via `invisible` for visual alignment), making the navigation structure opaque to screen readers and bots.
**Bridge:** Wrapped the footer link columns in a `<nav>` with a descriptive `aria-label`, and replaced the invisible heading with a dual `sr-only` heading (for a11y) and `aria-hidden` spacer (for layout).
**Signal:** Improved semantic landmarks (Priority 3) and restored accessible names for navigation sections, enhancing sitewide crawlability and structure.
## 2026-02-03 - HistoryPanel
**Blocker:** The "History" section (`HistoryPanel`) disappeared from the accessibility tree (returning a `div` instead of `section`) when the list of winners was empty, creating a "Semantic Void" and inconsistent landmarks.
**Bridge:** Refactored `HistoryPanel` to always render the `<section>` with `aria-labelledby`, placing the empty state message *inside* the semantic container.
**Signal:** Improved semantic stability (Priority 3), ensuring the "History" landmark is always discoverable by screen readers and crawlers regardless of content state.

## 2026-02-04 - ParticipantManager/List
**Blocker:** The "Edit" and "Delete" buttons in the participant list were hidden via `opacity: 0`, creating a "Semantic Void" and a navigation trap for keyboard users (who could focus them but not see them).
**Bridge:** Added `focus-within:opacity-100` to the container, ensuring interactive elements become visible when they receive focus.
**Signal:** Improved WCAG 2.1 compliance (Focus Visible) and ensured deeper link crawlability for bots that follow tab order or focusable elements.
