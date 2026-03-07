# Performance Rules & Constraints

## 🚨 CRITICAL CONSTRAINTS
1.  **Performance First:** FCP must be under 1.0s. Any change increasing FCP > 20ms is rejected.
2.  **Bundle Budget:** New dependencies > 10kb (gzipped) must be loaded via `next/dynamic`.
3.  **Critical Path:** No blocking scripts in `<head>`.
4.  **Zero CLS:** All containers must have reserved space. `next/image` must use `sizes` or `width`/`height`.

## ✅ GOOD PATTERNS (Do This)
*   **Font Loading:** Use `next/font` with `variable` injection in `layout.tsx`. Browser only downloads used fonts.
*   **Inert Handling:** Use imperative `ref.current.inert = true` for overlays to ensure accessibility without hydration mismatches.
*   **Dynamic Imports:** Use `next/dynamic` with `ssr: false` for heavy interactive components (e.g., `Confetti`, `VisualEditor`).
*   **Image Optimization:** Use `next/image` with `unoptimized` for user-generated content (Blob URLs) while maintaining layout stability with `fill`.
*   **Skeleton Loading:** Use Skeletons instead of spinners during hydration to match SSR layout and improve perceived performance.
*   **Granular Skeletons:** Use component-level skeletons (e.g., `ParticipantListSkeleton`) instead of page-level blocking skeletons to enable SSR of static content.
*   **Server Component Extraction:** For content-heavy sections (SEO text, FAQ, Glossary), extract interactivity into small "Client Islands" (e.g., `<TryToolButton>`) and make the parent a Server Component. This removes hydration cost for static text.
*   **Optimized Package Imports:** Use `experimental.optimizePackageImports` in `next.config.mjs` for large barrel-file libraries (e.g., `lucide-react`, `date-fns`, `lodash`, `@radix-ui/*`).
*   **Composition Pattern:** Always pass heavy content (e.g., Geo components, Articles, SEO text) as Server Component `children` to Client Component shells (`MainApp`). Never import heavy components directly inside a `"use client"` file.
*   **Static Content Injection:** Always pass heavy static content (SEO text, FAQ) as `children` to Client Components (like `MainApp`). Avoid importing them statically inside the Client Component to prevent bundle bloat.

## ❌ BAD PATTERNS (Avoid This)
*   **Sync Imports:** Importing heavy widgets directly in the main bundle.
*   **Large Fallback Blocks:** Using large conditional rendering blocks (e.g., `seoMode === 'wheel' ? <WheelGeo /> ...`) inside Client Components. This forces the bundler to include all conditional components. Use Composition (`children`) instead.
*   **Raw `<img>`:** Using standard image tags without explicit dimensions.
*   **Layout Shift:** Missing skeleton states for dynamic content.
*   **LCP Blocking:** Using entrance animations (e.g., `initial={{ opacity: 0 }}`) on LCP elements (Header, H1, Hero Image).
*   **Unnecessary Client Components:** Using `"use client"` on large components just because they contain one interactive button or `Link`.
