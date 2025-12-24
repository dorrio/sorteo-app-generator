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

## 2025-12-24 - Strategic Expansion (Wheel of Names & Versus)
**Context:** Executing a high-value GEO strike on "Wheel of Names" and reinforcing the "AppSorteos Alternative" positioning.
**Gap:**
*   **Wheel of Names:** We relied on a homepage component (`WheelGeo`) for this massive keyword, lacking a dedicated URL (`/wheel-of-names`) with specific metadata and `SoftwareApplication` schema.
*   **Versus Page:** The `/alternativa-appsorteos` page lacked a "Direct Answer" block explicitly defining *why* it's the best alternative, and missed `SoftwareApplication` schema.
**Action:**
*   **New Landing Page:** Created `app/[locale]/wheel-of-names/page.tsx` with targeted `h1`, `GameApplication` schema, and a dedicated Direct Answer block.
*   **Versus Optimization:** Injected `SoftwareApplication` schema into `/alternativa-appsorteos` and added a "Direct Answer" block ("What is the best free alternative...").
*   **Sitemap:** Prioritized `/wheel-of-names` at 0.9 in `next-sitemap.config.js`.
*   **Localization:** Updated `en.json`, `es.json`, `pt.json` with robust, entity-rich definitions for both pages.
**GEO Impact:**
*   **Authority:** The new Wheel page now signals a dedicated "Tool" entity to search engines, distinct from the main "Giveaway" tool.
*   **Answer Engine:** Both pages now provide direct, bolded answers to common user questions ("What is a Wheel?", "Best free alternative?"), increasing the chance of being cited by AI.
