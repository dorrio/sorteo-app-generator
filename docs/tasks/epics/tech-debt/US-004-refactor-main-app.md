# [US-004] Refactor `main-app.tsx` God Component

**Epic:** tech-debt
**Type:** Refactoring
**Priority:** High
**Status:** Done ✅ (2026-03-09)
**Estimate:** L (8h)

---

## REAL GOAL
Simplify the `main-app.tsx` "God Component" by extracting complex state into hooks and breaking out specific rendering modes into their own components, improving readability and maintainability without altering existing functionality.

---

## Acceptance Criteria

- [x] All theme and sorting state logic is extracted into custom hooks (`useThemeInitialization`, `usePopulationLogic`, `useShareContent`) under `components/sorteo/hooks/`.
- [x] Rendering paths for specific SEO modes are broken down into separate components under `components/sorteo/modes/` (e.g., `ListMode`, `NumberMode`, `WheelMode`, `MiscModes`).
- [x] `main-app.tsx` is significantly reduced in size and acts primarily as a clean composition layer for the hooks and modes.
- [x] No regression in the functionality, SEO metadata behavior, or Share actions for `list-randomizer`, `rng`, `wheel`, and all other mini-games.

---

## Technical Notes

- **Phase 1 (Hooks extraction):** 
  - Do not change UI logic. Extract state into `useThemeInitialization.ts`, `usePopulationLogic.ts`, and `useShareContent.ts` in the `components/sorteo/hooks/` directory. Create a barrel file (`index.ts`).
- **Phase 2 (UI Component extraction):**
  - Extract the visual rendering chunks based on `seoMode`.
  - Create `ListMode.tsx`, `NumberMode.tsx`, `WheelMode.tsx`, and `MiscModes.tsx` in the `components/sorteo/modes/` directory. Create a barrel file (`index.ts`).
- **Context API vs Props:** Stick to standard props drilling since the tree shouldn't be deeper than 2-3 levels. Re-evaluate if it exceeds that.

---

## Implementation Tasks (Foundation-First)

*   **[US-004-T1] Extract `MainApp` state into custom hooks**
    *   **Description:** Extract state logic into `components/sorteo/hooks/useThemeInitialization.ts`, `components/sorteo/hooks/usePopulationLogic.ts`, and `components/sorteo/hooks/useShareContent.ts`. Include a barrel index.ts. Update `main-app.tsx` to use these hooks.
    *   **Verify:** `inspect` (The app still compiles and manual tests run properly).
*   **[US-004-T2] Extract `WheelMode` component**
    *   **Description:** Extract the `wheel` (and related wheel modes) UI logic into `components/sorteo/modes/WheelMode.tsx`. Update `main-app.tsx` to render it when applicable.
    *   **Verify:** `inspect` (`/` and `/wheel` pages render properly with the wheel).
*   **[US-004-T3] Extract `ListMode` component**
    *   **Description:** Extract the `list-randomizer` (and team, secret-santa) logic into `components/sorteo/modes/ListMode.tsx`.
    *   **Verify:** `inspect` (`/list-randomizer` renders properly).
*   **[US-004-T4] Extract `NumberMode` component**
    *   **Description:** Extract the `rng` logic into `components/sorteo/modes/NumberMode.tsx`.
    *   **Verify:** `inspect` (`/random-number-generator` renders properly).
*   **[US-004-T5] Extract `MiscModes` and complete refactor**
    *   **Description:** Extract the rest of the modes (e.g. dice, coin, letter, instagram) and unify the `seoMode` rendering into a cleaner switch/map.
    *   **Verify:** `inspect` (Various mini-generator pages render correctly and `main-app.tsx` is clean).
