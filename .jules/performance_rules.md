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
*   **Targeted Loading States:** When using `next/dynamic`, provide a `loading` component that matches the dimensions and shape of the lazy-loaded component to prevent CLS.
*   **Image Optimization:** Use `next/image` with `unoptimized` for user-generated content (Blob URLs) while maintaining layout stability with `fill`.
*   **Skeleton Loading:** Use Skeletons instead of spinners during hydration to match SSR layout and improve perceived performance.
*   **Granular Skeletons:** Use component-level skeletons (e.g., `ParticipantListSkeleton`) instead of page-level blocking skeletons to enable SSR of static content.

## ❌ BAD PATTERNS (Avoid This)
*   **Sync Imports:** Importing heavy widgets directly in the main bundle.
*   **Raw `<img>`:** Using standard image tags without explicit dimensions.
*   **Layout Shift:** Missing skeleton states for dynamic content.
