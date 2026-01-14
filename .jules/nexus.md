## 2026-01-02 - [Winner Ceremony]

**Blocker:** The social sharing actions in the `WinnerCeremony` modal were implemented as `DropdownMenuItem` `div`s with `onClick` handlers. This "Link Juice Killer" meant search engines (Googlebot) could not crawl or index the outbound social links to Twitter, Facebook, and WhatsApp, missing an opportunity for entity association and "Shareability" signals. It also prevented users from using native browser behaviors like "Open in new tab".

**Bridge:** Refactored the items to use the `asChild` prop on `DropdownMenuItem`, rendering semantic `<a>` tags with `href` attributes containing pre-calculated intent URLs.

**Signal:** Converts "dead" interactive elements into crawlable, semantic links, improving the page's connectivity graph and ensuring full accessibility for users (and bots) who rely on standard link behavior.
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

## 2025-12-21 - [Glossary]

**Blocker:** The Glossary component was using a generic `div` grid structure with `h3` for terms. This "Semantic Void" failed to explicitly communicate the term-definition relationship to search engines and assistive technology, treating it as just a collection of boxes.

**Bridge:** Refactored the component to use a semantic `<dl>` (Description List) with `<dt>` (Definition Term) and `<dd>` (Definition Description).

**Signal:** Provides a strong signal to Google (and screen readers) that this content is a Glossary, directly reinforcing the "DefinedTermSet" schema and improving the likelihood of appearing in Rich Snippets or Direct Answers.

## 2025-12-22 - [Participant Manager]

**Blocker:** The participant input fields (Single Name and Bulk List) in `ParticipantManager` relied solely on placeholders for visual labeling. This created a "Semantic Void" where screen readers and bots would encounter "Edit text" controls without context (WCAG 3.3.2 failure), as placeholders are not robust accessible names.

**Bridge:** Added explicit `aria-label` attributes to the `Input` and `Textarea` components, using the existing localized placeholder strings (`t("single_placeholder")`, `t("bulk_placeholder")`) as the accessible names.

**Signal:** Ensures that the core functionality of the app (adding participants) is fully accessible to screen reader users and correctly understood by search engines indexing the form structure.

## 2025-12-30 - [Global Layout]

**Blocker:** The `SoftwareApplication` JSON-LD schema injected in `app/[locale]/layout.tsx` contained hardcoded English strings for `featureList` and `description`. This created a "Semantic Void" where localized versions of the site (e.g., `/es`, `/pt`) sent English metadata signals to Googlebot, reducing relevance in local SERPs and creating a mismatch between visible content and structured data.

**Bridge:** Localized the schema injection by implementing a new `GlobalSchema` namespace in `messages/*.json` and replacing hardcoded strings with `t()` calls via `next-intl`'s `getTranslations`.

**Signal:** Ensures that Rich Snippets (e.g., "Feature List" in Knowledge Graph) match the user's search language, improving CTR and sending a strong "Native Speaker" signal to international crawlers.

## 2025-12-30 - [Verify Page]

**Blocker:** The social sharing buttons on the `/verify` result page were implemented as `DropdownMenuItem` `div`s with `onClick` handlers. This created a "Semantic Void" where search engines could not detect the outbound links to Twitter, Facebook, and WhatsApp, losing valuable entity association signals (Link Juice) and preventing users from using native browser features like "Open in new tab".

**Bridge:** Refactored the DropdownMenu to use semantic `<a>` tags via the `asChild` prop for Twitter, Facebook, and WhatsApp. Pre-calculated the intent URLs during render to ensure they are available in the initial HTML payload.

**Signal:** Googlebot can now follow the outbound social links (improving Entity Recognition and Trust), and the page gains full WCAG compliance for link behavior.

## 2025-12-31 - [Wheel of Names Schema]

**Blocker:** The `FAQPage` JSON-LD schema injected by `WheelGeo` contained raw HTML tags (e.g., `<b>`) in the `acceptedAnswer.text` field. This "Dirty Data" violated Schema.org best practices (which prefer plain text) and risked causing Google to ignore the snippet or display it with broken formatting in search results. The previous sanitization logic (`replace(/\*\*(.*?)\*\*/g, '$1')`) targeted Markdown but failed to handle the HTML tags returned by the translation engine.

**Bridge:** Updated the schema generation logic to use a robust regular expression (`/<[^>]*>?/gm`) that effectively strips all HTML tags from the injected text, ensuring a clean string output.

**Signal:** Provides high-quality, valid structured data to Google, significantly increasing the probability of winning the "What is a Wheel of Names?" Featured Snippet and improving the overall trust signal of the page.

## 2026-01-01 - [RNG Landing Page]

**Blocker:** The features grid in `RngGeo` was implemented using a generic `div` grid structure. This "Semantic Void" meant that search engines and assistive technology perceived the features as disconnected content blocks rather than a related list of attributes.

**Bridge:** Refactored the features grid to use a semantic `<ul>` (Unordered List) with `<li>` (List Items). Explicitly added `role="list"` to the container to prevent list semantics from being stripped by the `grid` CSS layout in some browsers/screen readers.

**Signal:** Provides a clear structural signal to Googlebot that these elements are a list of features, improving the understanding of the page's content hierarchy and enhancing navigation for screen reader users.

## 2026-01-03 - [Versus Page]

**Blocker:** The "Versus" comparison page (`/alternativa-appsorteos`) was implemented as a standalone structure (`<main>`) that did not include the global `SiteFooter`. This created a "Navigation Trap" (Semantic Void) where search engine crawlers hitting this page would reach a dead end without internal links to other key site sections (Glossary, Wheel, RNG). It also prevented PageRank flow from this high-potential landing page to the rest of the site domain.

**Bridge:** Extracted the footer implementation from the monolithic `MainApp` component into a reusable `SiteFooter` component. Integrated `SiteFooter` into both `MainApp` and the `VersusPage` structure.

**Signal:** Restores the internal linking graph, ensuring that "Link Juice" flows from the Versus landing page to other tools, and eliminates the orphan page risk.

## 2026-01-04 - [Tool Landing Pages]

**Blocker:** The "Try It" CTAs in `RngGeo`, `ListRandomizerGeo`, and `WheelGeo` were implemented as buttons with JavaScript `onClick` handlers that programmatically scrolled to the main section using `document.getElementById`. This created a "Semantic Void" where search engines saw a generic button instead of a navigational link to the tool, missing a critical internal linking signal. Additionally, the target ID `sorteo-section` was missing from the DOM, making the buttons functionally broken for scrolling.

**Bridge:**
1. Added `id="sorteo-section"` to the `<main>` element in `MainApp`.
2. Refactored the CTA buttons to use semantic `<a>` tags with `href="#sorteo-section"` (using `Button asChild` where appropriate).
3. Enabled native smooth scrolling via `html { scroll-behavior: smooth; }` in CSS, removing the dependency on JavaScript for navigation while preserving the state update logic in `onClick`.

**Signal:** Converts generic interactions into crawlable internal links, reinforcing the relationship between the SEO landing content and the functional tool. Enhances accessibility by providing standard link behavior and ensuring keyboard navigability.
