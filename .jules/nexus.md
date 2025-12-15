## 2024-05-23 - [Home Page & Visual Editor]

**Blocker:** Icon-only buttons (Customize, Verify, Close) lack `aria-label` or rely on `title` (which is not reliable for all screen readers/touch devices). On mobile, the "Customize" button text is hidden via `display: none` (`hidden` class), rendering it empty to assistive tech. These controls are "Semantic Voids" - visually apparent but invisible or confusing to bots and screen readers.

**Bridge:** Add explicit `aria-label` attributes to these buttons using localized strings. This ensures that even when text is hidden or absent, the button's purpose is clearly communicated in the accessibility tree.

**Signal:** Improved crawlability for interactive elements, better Mobile-First indexing scores (as touch targets are now semantically defined), and WCAG compliance for button naming.
