## 2024-05-23 - [Home Page & Visual Editor]

**Blocker:** Icon-only buttons (Customize, Verify, Close) lack `aria-label` or rely on `title` (which is not reliable for all screen readers/touch devices). On mobile, the "Customize" button text is hidden via `display: none` (`hidden` class), rendering it empty to assistive tech. These controls are "Semantic Voids" - visually apparent but invisible or confusing to bots and screen readers.

**Bridge:** Add explicit `aria-label` attributes to these buttons using localized strings. This ensures that even when text is hidden or absent, the button's purpose is clearly communicated in the accessibility tree.

**Signal:** Improved crawlability for interactive elements, better Mobile-First indexing scores (as touch targets are now semantically defined), and WCAG compliance for button naming.

## 2024-12-15 - [Visual Editor]

**Blocker:** The visual editor tabs were implemented using generic buttons and divs, lacking the semantic structure required for screen readers and bots to understand the relationship between the tabs and their content panels. This creates a "Semantic Void" where the visual hierarchy is not reflected in the code structure.

**Bridge:** Refactored the tab interface to use the WAI-ARIA Tab pattern:
*   Added `role="tablist"` to the container with an appropriate label.
*   Added `role="tab"`, `aria-selected`, and `aria-controls` to the tab buttons.
*   Added `role="tabpanel"`, `aria-labelledby`, and `tabIndex="0"` to the content panels.

**Signal:** Improved accessibility for screen reader users who can now navigate the tabs using standard keyboard interactions and understand the context of the content. Search engines can better understand the structure of the editor interface.

## 2025-05-18 - [SEO Content Component]

**Blocker:** Key content sections (Features, How-To Steps, FAQs) were implemented using generic `div` containers. This "div soup" fails to communicate the structural relationships of the content to search engines and assistive technologies (e.g., that the FAQ is a list of question/answer pairs, or that features are a list of items).

**Bridge:** Refactored the semantic structure:
*   **Features & Steps:** Converted generic `div` grids into `ul`/`ol` lists with `li` items.
*   **FAQ:** Converted the Q&A section into a Description List (`dl`) with `dt` (terms) and `dd` (definitions).
*   **Landmarks:** Wrapped sections in `<section>` tags with `aria-label`s to create navigable landmarks.

**Signal:** Enhanced understanding for Googlebot (better discrimination of list items and Q&A structures) and improved navigation for screen readers. This directly supports the `FAQPage` schema by mirroring it in the HTML structure.
