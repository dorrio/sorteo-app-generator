---
description: Pipeline Orchestrator that reads the Kanban board, lets the user pick ONE Story, and drives it through the agile pipeline via Antigravity skills.
---

# /ln-orchestrator
Meta-orchestrator workflow that guides the user through the agile development pipeline (task planning -> validation -> execution -> quality gate).

**Steps:**

1. **Kanban Discovery & Story Selection**
   - Read the Kanban board (typically located at `docs/tasks/kanban_board.md`).
   - Parse all status sections: Backlog, Todo, In Progress, To Review, To Rework.
   - List the available Stories with their ID, title, status, and derived Target Stage (0, 1, 2, or 3).
   - If the Kanban board is empty or missing, ask the user what story they want to work on.
   - Ask the user: "Which story would you like to process? Please provide the Story ID or number." (Wait for their response).

2. **Pre-flight Business Questions**
   - Once the user selects a Story, read its description and metadata.
   - Identify any missing business definitions (e.g., specific libraries, exact UI preferences, third-party providers).
   - If there are business ambiguities, ask the user in a SINGLE batch of questions. Wait for their response before proceeding.

3. **Branch Preparation**
   - Ensure the `develop` branch exists and is up to date with `main`, then create or checkout a feature branch for the selected story using `git`. Use `run_command` to execute git operations.
   - Example feature branch name: `feature/<story-id>-<short-slug>`.

4. **Pipeline Execution (Stage by Stage)**
   Drive the selected Story through its necessary stages based on its current status. At each step, invoke the relevant Antigravity skill or perform the manual actions required for the stage. Note: the actual skills (`ln-300`, `ln-310`, `ln-400`, `ln-500`) should be located in `.agent/skills/`.

   * **Stage 0 (Task Planning - `ln-300`):** If the story has no tasks, run task planning to break it down.
   * **Stage 1 (Story Validator - `ln-310`):** Validate the story and tasks.
   * **Stage 2 (Story Executor - `ln-400`):** Execute the code changes incrementally.
   * **Stage 3 (Quality Gate - `ln-500`):** Run audits, linters, and verify the changes against acceptance criteria.

   *Pause and confirm with the user before transitioning between major stages if significant changes are being made.*

5. **Review & Merge Coordination**
   - Check the code quality. Generate a pipeline execution report.
   - Ask the user: "Story {id} completed. Would you like to merge `feature/{id}` into `develop`?"
   - If the user confirms, perform a squash or fast-forward merge into `develop` and clean up the feature branch.
   - Update the Kanban board to reflect the new status (Done).

**Guardrails & Rules:**
- Only process ONE Story at a time.
- Always wait for the user's confirmation before creating branches or writing significant code.
- Ensure the user is the one making business decisions, not the AI.
- Keep the Kanban board as the Single Source of Truth; update it as the story progresses.
