# Performance Audit Log

| Date | Metric Target | Action | Result/Impact |
|------|---------------|--------|---------------|
| 2024-05-24 | Initialization | Created Performance Journal | Baseline established |
| 2024-05-24 | Image Optimization | Refactored VisualEditor to use next/image | Visual Verified with Playwright |
| 2026-01-28 | Bundle Size | Removed `recharts` and `components/ui/chart.tsx` | Reduced dependency count, removed dead code |
| 2026-01-28 | LCP | Replaced `Loader2` spinner with `AppSkeleton` in `MainApp` | Improved FCP/LCP by showing layout skeleton during hydration |
| 2026-01-27 | Perceived Performance | Replaced MainApp spinner with AppSkeleton | Improved LCP and Reduced Layout Shift |
| 2026-01-27 | Bundle Size | Removed unused recharts dependency | Reduced bundle size |
| 2026-01-29 | FCP Optimization | Removed 5 unused Google Fonts (Roboto, Montserrat, Open Sans, Lato, Poppins) from global layout | Reduced critical CSS size and eliminated potential font downloads; implemented system-font fallbacks for legacy data. |
| 2026-01-29 | LCP & SEO | Enabled SSR in MainApp | Removed global blocking skeleton, implemented granular skeletons, and enabled server-side rendering of SEO content and layout. |
| 2026-01-30 | LCP & FCP | Optimized MainApp Animations | Removed `initial={{ opacity: 0 }}` from Header, H1, and Main Section to prevent LCP delay. Removed unused `AppSkeleton` import. |
| 2026-02-02 | TBT & Bundle | Refactored `WheelGeo` and `Glossary` to Server Components | Removed hydration cost for large text blocks and isolated `framer-motion` to small Client Islands (`WheelVisual`, `TryToolButton`). |
| 2026-02-12 | TBT & Bundle | Refactored `WheelGeo` and `Glossary` to Server Components | Removed hydration cost for large static content. Isolated interactivity into `TryToolButton` and `WheelGeoVisual`. |
| 2026-05-22 | FCP & Bundle | Refactored `MainApp` to Code Split & Dynamic Import | Reduced initial JS bundle by splitting `MainApp` and removing static imports of all Geo components. Pages now lazy load the app shell. |
| 2026-05-23 | Bundle & Runtime | Configured `next.config.mjs` & Optimized Listeners | Enabled `optimizePackageImports` for `lucide-react`/`radix-ui`. Replaced sync scroll listener in `StickyShareFooter` with throttled rAF loop. |
| 2026-05-23 | CLS & FOUT | Refactored Font Loading in `MainApp` | Switched from inline style font injection to conditional Tailwind classes (`font-sans`/`font-display`) to improve CSSOM construction. |
| 2026-06-15 | Bundle Size & LCP | Refactored GEO Components | Removed `framer-motion` and `animate-pulse` from `country-geo.tsx`, `versus-geo.tsx`, `yes-no-geo.tsx`, `list-randomizer-geo.tsx`, `rng-geo.tsx`, `secret-santa-geo.tsx`, and `team-geo.tsx` to reduce CPU work, eliminate layout shifts, and lower LCP times for static content. |
