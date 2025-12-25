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
## 2025-12-17 - [Home Page Content]

**Blocker:** The Features, How-To, and FAQ sections in `SeoContent` were implemented as generic `div` grids. This "Semantic Void" prevented search engines from understanding the list relationships (unordered, ordered, and definition lists) and reduced the accessibility for screen reader users who rely on list navigation.

**Bridge:** Refactored the structure to use semantic HTML:
*   **Features:** Converted to `<ul>` with `<li>` items.
*   **How-To:** Converted to `<ol>` with `<li>` items to reflect the ordered nature of instructions.
*   **FAQ:** Converted to `<dl>` (Description List) with `<dt>` (terms) and `<dd>` (definitions) to explicitly associate questions with answers.

**Signal:** Improved semantic understanding for bots (Step-by-step instructions, Definition pairings), better screen reader navigation (List item counts, shortcuts), and stronger correlation with the injected JSON-LD Schema.

## 2025-12-18 - [Landing Page]

**Blocker:** The "Visual Abstract" in `WheelGeo` was a large, interactive `div` element acting as a primary Call to Action (CTA) but lacking semantic meaning. This "div button" was invisible to screen readers and keyboard users, and search engines failed to recognize it as a key interaction point.

**Bridge:** Converted the interactive `div` into a semantic `<button>` element with `type="button"` and a localized `aria-label`. This promotes the element from generic layout noise to a functional control in the accessibility tree.

**Signal:** The element is now focusable and clickable via keyboard. Search engines correctly interpret it as an interactive element linked to the "Try Wheel" action, reinforcing the page's primary conversion goal.

## 2025-12-19 - [Instagram Landing Page & SEO Content]

**Blocker:** Feature lists and "How To" steps in `InstagramPickerPage`, `SeoContent`, and `WheelGeo` utilize CSS classes like `list-none` (or `grid`/`flex` layouts) which can inadvertently strip list semantics in certain screen readers (notably VoiceOver on Safari). This creates a "Semantic Void" where a visual list is perceived as a flattened stream of text by assistive technology and bots.

**Bridge:** Explicitly added `role="list"` to the `<ul>` and `<ol>` containers. This ARIA attribute restores the semantic list structure in the accessibility tree, ensuring that the elements are correctly announced as lists with a specific number of items, regardless of their visual styling.

**Signal:** Improved structural understanding for search engines (reinforcing the "List" nature of features and steps) and critical accessibility fix for Apple ecosystem users/bots, directly impacting the "Technical Quality" score.
## 2025-12-20 - [SEO Content Component]

**Blocker:** The Features and How-To lists in `SeoContent` utilize `list-none` and grid layouts, which strips list semantics for some screen readers, reverting them to plain text streams.

**Bridge:** Applied `role="list"` to the `<ul>` and `<ol>` containers to enforce semantic list structure in the accessibility tree.

**Signal:** Restores proper list item counting and navigation for assistive technology and improves structural clarity for search bots.
