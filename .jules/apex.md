# APEX Journal - Growth Logs

## 2024-02-23 - Strategy/Context
**Reconnaissance:**
*   **App Type:** Next.js App Router, SaaS/Content Publisher hybrid.
*   **Competitors:** Wheel of Names, AppSorteos, Random.org.
*   **Technical Health:** `next-sitemap` configured with priorities. `next-intl` used for localization.
*   **Schema:** `SoftwareApplication` injected in root layout.

**Gap:**
*   **Secret Santa:** High-volume keyword "Secret Santa Generator" has no dedicated landing page (`/secret-santa-generator`).
*   **Team Generator:** "Team Generator" content exists inside `ListRandomizerGeo` but lacks a dedicated page.

**Action:**
*   Create `/secret-santa-generator` landing page.
*   Implement `SecretSantaGeo` component with "Direct Answer" content.
*   Optimize `MainApp` to support `secret-santa` mode.

**GEO Impact:**
*   Capture "What is a Secret Santa Generator?" queries in ChatGPT/Perplexity.
*   Rank for "Free Secret Santa Generator" transactional queries.
