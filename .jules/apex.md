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
