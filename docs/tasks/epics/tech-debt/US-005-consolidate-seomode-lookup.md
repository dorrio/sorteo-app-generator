# Story: US-005 - Consolidate `seoMode` if-chains into lookup map

## Status: Done ✅ (2026-03-09)

## Context
The codebase currently contains several instances where logic depends on the `seoMode` prop. This is often implemented using long `if-else` chains or `switch` statements, which makes the code harder to read and maintain as new modes are added.

## Acceptance Criteria
- [x] Refactor `main-app.tsx` to use a lookup map for mode component rendering.
- [x] Refactor `Glossary` component to use a mapping between `seoMode` and relevant term IDs.
- [x] Refactor `usePopulationLogic` hook to use a mapping for default participants.
- [x] Ensure all refactors maintain existing functionality and type safety.
- [x] (Optional) Move shared mapping logic to a dedicated constant file if appropriate.

## Technical Notes
- Use `Record<SeoMode, React.ComponentType<any>>` or similar for component mapping.
- For Glossary, a `Set<string>` or `string[]` per mode can define visibility.
- Ensure `Provably Fair` term is always included as it's a global requirement.

## Tasks
1. T1: Identify all `seoMode` dependent blocks.
2. T2: Refactor `main-app.tsx` component rendering.
3. T3: Refactor `Glossary` filtering logic.
4. T4: Refactor `usePopulationLogic` data seeding.
5. T5: Verification via `tsc` and manual audit.
