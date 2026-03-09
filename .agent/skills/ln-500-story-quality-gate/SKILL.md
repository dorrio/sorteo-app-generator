---
name: ln-500-story-quality-gate
description: Act as the final Quality Gate for a Story. Calculates Quality Score, evaluates NFRs, and decides the 4-level gate verdict (PASS/CONCERNS/FAIL/WAIVED) before a Story can be merged.
---

# Story Quality Gate Skill

When invoked, act as the Story Quality Gate. Your goal is to run the final quality checks on a completed Story and determine if it is ready to be merged.

## Prerequisites
- All implementation tasks for the active Story must be completed (the Story should be in "To Review").
- The implementation code should have corresponding tests written, and those tests should be passing.

## Steps to Execute

1. **Static Analysis & Linters:**
   - Run type checking (e.g., TypeScript compilation checks).
   - Run the linter (e.g., ESLint, Biome, or standard).
   - Run format checking (e.g., Prettier).

2. **Regression & Test Execution:**
   - Run the full project test suite (`npm run test` or similar) to ensure no regressions were introduced.

3. **Criteria Validation:**
   - Review the Acceptance Criteria of the Story.
   - Verify visually or by checking the code that each criterion has been met.
   - Review Non-Functional Requirements (NFRs): Security, Performance, Maintainability.

4. **Calculate Verdict:**
   Assign a 4-level gate verdict based on the results:
   - **PASS**: All checks pass perfectly. No issues found.
   - **CONCERNS**: Minor issues exist (e.g., non-blocking linter warnings, minor tech debt), but acceptable risk.
   - **FAIL**: Blocking issues found (e.g., tests fail, build fails, missing AC).
   - **WAIVED**: Issues exist but the user explicitly approved skipping them.

5. **Closing Actions:**
   - **On PASS/CONCERNS/WAIVED**: Ask the user: "Quality Gate passed with verdict [VERDICT]. Would you like me to mark the Story as Done?" 
     - If yes, update the Kanban board to mark the Story as "Done".
   - **On FAIL**: Report the exact issues to the user. DO NOT mark the Story as Done. Recommend or create fix tasks on the Kanban board to address the failures, changing the Story status to "To Rework".

**Rules:**
- ONLY the Quality Gate can mark a Story as "Done".
- You must physically run the required test and linting commands if possible, rather than assuming the code works.
