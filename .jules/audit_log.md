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
| 2026-02-14 | LCP & TBT | Refactored MainApp to MainAppOptimized (Server Component) with Client Islands | Removed hydration cost for static content (WheelGeo, Glossary), improved TBT by splitting monolithic Client Component. |
