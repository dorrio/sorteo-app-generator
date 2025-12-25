# Apex Growth Log

## 2024-05-23 - Initialization
**Context:** Initializing Apex agent for SEO/GEO optimization.
**Gap:** Project lacks a dedicated SEO journal and potential GEO strategies are unknown.
**Action:** Created `.jules/apex.md`. Started reconnaissance of codebase.
**GEO Impact:** Setting the stage for systematic improvements.
## 2024-05-23 - GEO & Schema Optimization
**Context:** Optimizing for Generative Engine Optimization (GEO) and improving Schema coverage.
**Gap:** Main landing page lacked `SoftwareApplication` schema and Direct Answer was generic.
**Action:**
*   **Direct Answer:** Optimized `what_is_text` in `messages/en.json` and `es.json` with clear definitions and bold entities (e.g., **free giveaway tool**, **random winners**).
*   **Schema:** Injected `SoftwareApplication` JSON-LD into `SeoContent.tsx`.
*   **Component:** Updated `SeoContent` to support rich text rendering for bold tags.
**GEO Impact:** Direct Answer is now formatted for AI extraction (concise, entity-rich). Schema signals app type explicitly to Google.
## 2024-05-23 - Versus Page & Architecture
**Context:** Enhancing the Competitor Alternative page (`/alternativa-appsorteos`) and Global Schema.
**Gap:** The specific versus page lacked Breadcrumb schema, and the global `SoftwareApplication` schema was basic.
**Action:**
*   **Breadcrumb Schema:** Injected `BreadcrumbList` JSON-LD into `app/[locale]/alternativa-appsorteos/page.tsx` to establish hierarchy (Home > AppSorteos Alternative).
*   **Global Schema:** Enriched `layout.tsx` schema with `applicationSubCategory: "Social Media Tool"`, `screenshot`, and `featureList`.
*   **Sitemap:** Verified `next-sitemap` prioritizes the versus page (0.9).
**GEO Impact:** Improved entity understanding for LLMs (Sorteo Pro is a *Social Media Tool* alternative to AppSorteos) and better structure for Google.

## 2025-02-20 - Wheel of Names Dominance
**Context:** Targeting the high-volume "Wheel of Names" keyword intent.
**Gap:** The `WheelGeo` component was static and passive. Users arriving for "Wheel" intent saw a "Grid" by default and had to manually find the setting. `pt.json` was missing the `WheelGeo` translation block entirely.
**Action:**
*   **Interactive GEO:** Upgraded `WheelGeo` component to include a "Try Wheel Mode" button. This button dynamically updates the `useSorteoStore` to `roulette` style and scrolls the user to the game area.
*   **Localization:** Added missing `WheelGeo` translation block to `messages/pt.json`.
*   **Conversion:** Added a CTA button ("Try Wheel Mode Now") to the SEO text, linking the informational intent ("What is a wheel?") directly to the transactional utility.
**GEO Impact:**
*   **Direct Answer:** The content defines "Wheel of Names" clearly for LLMs.
*   **UX Alignment:** The "Try It" action proves to the user (and bounce rate metrics) that the page *is* what they are looking for, reducing pogo-sticking (a negative ranking signal).

## 2025-02-21 - Glossary & Schema Authority
**Context:** Filling semantic voids for technical terms and strengthening entity recognition.
**Gap:** Competitors defined terms like "RNG" and "Provably Fair" to capture "What is..." queries, but we lacked a dedicated definition section. `pt.json` Direct Answer was also generic and duplicated keys.
**Action:**
*   **Glossary Component:** Created `components/sorteo/glossary.tsx` using `<dl>` for semantic definitions of "RNG", "Provably Fair", and "Instagram Comment Picker".
*   **Schema Injection:** Injected `DefinedTermSet` schema into the Glossary component.
*   **Refinement:** Updated `layout.tsx` global schema to list features as an array including "Provably Fair RNG".
*   **Direct Answer (PT):** Rewrote `messages/pt.json` to include bold entities (`<b>Sorteio Pro</b>`, `<b>ferramenta de sorteio gratuita</b>`) matching the EN/ES strategy.
**GEO Impact:**
*   **Knowledge Graph:** `DefinedTermSet` schema helps Google associate Sorteo Pro with technical reliability (RNG).
*   **Long-Tail Ranking:** Optimizing for questions like "Is Sorteo Pro fair?" or "What is an Instagram Comment Picker?".

## 2025-02-21 - Versus Page Authority & Global Schema
**Context:** Establishing "Sorteo Pro" as the definitive free alternative to AppSorteos and consolidating schema authority.
**Gap:** The high-value page `/alternativa-appsorteos` lacked a "Direct Answer" block (zero-click result) and specific `SoftwareApplication` features. The Home page had duplicate schema injections (Layout vs SeoContent).
**Action:**
*   **Global Schema:** Moved `aggregateRating` (4.9 stars) to the global `layout.tsx` so *every* page (including Versus) displays stars in SERPs.
*   **Schema Cleanup:** Removed redundant `SoftwareApplication` injection from `seo-content.tsx`.
*   **GEO Strategy:** Injected a dedicated "Direct Answer" block into `app/[locale]/alternativa-appsorteos/page.tsx` defining Sorteo Pro as the "best free alternative".
*   **Localization:** Added optimized translation keys for the Direct Answer in EN, ES, and PT.
**GEO Impact:**
*   **Zero-Click Dominance:** We now explicitly answer "What is the best free alternative to AppSorteos?" with entity-rich text.
*   **CTR Boost:** All pages now benefit from `AggregateRating` schema.
