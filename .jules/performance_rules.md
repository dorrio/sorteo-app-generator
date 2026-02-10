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
*   **Server Component Islands:** Extract small interactive parts (buttons, toggles) into "Client Islands" to keep the parent component as a Server Component (RSC). This drastically reduces the client bundle for content-heavy sections.

## ❌ BAD PATTERNS (Avoid This)
*   **Sync Imports:** Importing heavy widgets directly in the main bundle.
*   **Raw `<img>`:** Using standard image tags without explicit dimensions.
*   **Layout Shift:** Missing skeleton states for dynamic content.
*   **LCP Blocking:** Using entrance animations (e.g., `initial={{ opacity: 0 }}`) on LCP elements (Header, H1, Hero Image).
*   **Client Component Bloat:** Making an entire large section `"use client"` just for one button or animation. Split it up!
