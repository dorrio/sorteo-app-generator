---
name: ln-510-quality-coordinator
description: Coordinates code quality checks, tech debt cleanup, and regressions. Invoked by the Quality Gate.
---

# Quality Coordinator Skill

When invoked, act as the Quality Coordinator. Your goal is to run a deep-dive quality analysis of the codebase for the current Story before handing it back to the Quality Gate.

## Prerequisites
- The Story is in the "To Review" state and has been passed down by the Quality Gate (`ln-500`).

## Steps to Execute

1. **Static Analysis & Metrics:**
   - Review the modified files for Code Smells (e.g., duplicated code, overly complex methods).
   - Verify that the changes align with the project's architecture and do not introduce unexpected side-effects.

2. **Tech Debt Cleanup (Optional but Recommended):**
   - Look for obvious tech debt that can be safely auto-fixed (e.g., unused imports, dead code, deprecated methods).
   - If you find any, fix them immediately.

3. **Criteria Validation:**
   - Ensure the Story has no forward dependencies.
   - Ensure that the tests cover the Acceptance Criteria of the Story.

4. **Linters & Formatting:**
   - Execute the project's linters (e.g., ESLint, Biome, Prettier). Fix any auto-fixable errors.

5. **Regression Checks:**
   - Run the project's test suite to ensure that nothing has broken due to the tech debt cleanup or implementation.

6. **Verdict & Reporting:**
   - Compile a list of any remaining issues (e.g., failing tests or complex code smells).
   - Calculate a general Quality Verdict:
     - **PASS**: No issues found.
     - **CONCERNS**: Only minor issues or tech debt remaining.
     - **FAIL**: Tests are failing or major architectural violations exist.
   - Report this verdict back to the user, who will act as the final Quality Gate (`ln-500`) to decide if the Story is "Done".

**Rules:**
- Do not mark the Story as "Done". Only the Quality Gate does that.
- Always run the tests after making tech debt cleanups.
