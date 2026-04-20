# Performance Rules & Constraints

## 🚨 CRITICAL CONSTRAINTS
1.  **Performance First:** FCP must be under 1.0s. Any change increasing FCP > 20ms is rejected.
2.  **Bundle Budget:** New dependencies > 10kb (gzipped) must be loaded via `next/dynamic`.
3.  **Critical Path:** No blocking scripts in `<head>`.
4.  **Zero CLS:** All containers must have reserved space. `next/image` must use `sizes` or `width`/`height`.

## ✅ GOOD PATTERNS (Do This)
*   **Font Loading:** Use `next/font` with `variable` injection in `layout.tsx`. Browser only downloads used fonts. Use Tailwind classes (`font-sans`) over inline styles where possible.
*   **Tree Shaking:** Explicitly configure `experimental.optimizePackageImports` in `next.config.mjs` for heavy icon libraries (`lucide-react`) and UI kits (`@radix-ui`, `lodash`, `date-fns`).
*   **Event Listeners:** Always use `{ passive: true }` for scroll/touch listeners. Throttle high-frequency events (scroll, resize) using `requestAnimationFrame`.
*   **Inert Handling:** Use imperative `ref.current.inert = true` for overlays to ensure accessibility without hydration mismatches.
*   **Dynamic Imports:** Use `next/dynamic` with `ssr: false` for heavy interactive components (e.g., `Confetti`, `VisualEditor`).
*   **Image Optimization:** Use `next/image` with `unoptimized` for user-generated content (Blob URLs) while maintaining layout stability with `fill`. Enable `avif` and `webp` formats in `next.config.mjs`.
*   **Skeleton Loading:** Use Skeletons instead of spinners during hydration to match SSR layout and improve perceived performance.
*   **Granular Skeletons:** Use component-level skeletons (e.g., `ParticipantListSkeleton`) instead of page-level blocking skeletons to enable SSR of static content.
*   **Server Component Extraction:** For content-heavy sections (SEO text, FAQ, Glossary), extract interactivity into small "Client Islands" (e.g., `<TryToolButton>`) and make the parent a Server Component. This removes hydration cost for large static text and drastically reduces the client bundle.
*   **Heavy Shell Splitting:** The main application shell (if heavy) must be loaded via `next/dynamic` with a skeleton fallback to ensure rapid FCP.

## ❌ BAD PATTERNS (Avoid This)
*   **Sync Imports:** Importing heavy widgets directly in the main bundle.
*   **Raw `<img>`:** Using standard image tags without explicit dimensions.
*   **Layout Shift:** Missing skeleton states for dynamic content.
*   **LCP Blocking:** Using entrance animations (e.g., `initial={{ opacity: 0 }}`) on LCP elements (Header, H1, Hero Image).
*   **Static Layout Shifts:** Using `framer-motion` or continuous CSS animations (like `animate-pulse`) on purely static, non-interactive GEO components. Use standard HTML elements for these.
*   **Unnecessary Client Components:** Using `"use client"` on large components just because they contain one interactive button, animation, or `Link`. Split it up!
*   **Unoptimized Listeners:** Attaching raw `scroll` or `resize` listeners without throttling or debouncing.
-   **Next.js Dynamic Import Aliasing:** Do NOT add `export const dynamic = 'force-static'` to tool pages (it blocks `searchParams` in `generateMetadata` and breaks dynamic OG image rendering) — remove that export instead, and you can import `next/dynamic` normally without aliasing.