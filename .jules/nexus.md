# Nexus Journal - Semantic Accessibility Log

## 2024-05-22 - MainApp/Header
**Blocker:** The application logo/title in the header was a non-interactive `div`, creating a navigation trap (users cannot click to go home) and missing an opportunity to pass internal link juice to the root domain.
**Bridge:** Wrapped the logo and title in a `Link` component pointing to `/` with an `aria-label`.
**Signal:** Improved internal linking structure (SEO) and restored expected navigation behavior (UX/A11y).

## 2024-05-23 - ListRandomizerGeo/PopularUses
**Blocker:** "Popular Uses" section in List Randomizer was a collection of generic `div`s, hiding the relationship between items from crawlers.
**Bridge:** Converted the grid container to a `ul` with `role="list"` and items to `li`.
**Signal:** Improved semantic landmarks (Priority 3), reinforcing the relationship between the use cases for the List Randomizer tool.
