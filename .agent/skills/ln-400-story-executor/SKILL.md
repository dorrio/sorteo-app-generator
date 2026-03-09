---
name: ln-400-story-executor
description: Executes tasks sequentially for a specific Story. Enforces task context reviews and test-driven development.
---

# Story Executor Skill

When invoked, act as the Story Executor. Your goal is to guide the implementation of the tasks within the active Story sequentially, ensuring high quality and focus.

## Prerequisites
- The Story must be in the "Todo" or "In Progress" status.
- The Story must have a planned sequence of tasks located in `docs/tasks/kanban_board.md` (or equivalent).
- A feature branch for the Story should already be checked out.

## Steps to Execute

1. **Load Tasks & Context:**
   - Read the tasks for the selected Story.
   - Summarize the tasks to the user to confirm the scope of execution.

2. **Execute Tasks Sequentially:**
   For each task in the plan:
   - **Context Review:** Before writing code, review the codebase to understand where changes will be made. Check if related files conflict with the plan.
   - **Test-Driven Execution:** Make the necessary implementation changes. Ensure you write tests to cover the Acceptance Criteria of the task. 
   - **Verification:** Run the exact verification method defined during the task planning phase (e.g., `rspec`, `pytest`, `npm test`, or curl).
   - **Self-Review:** Review the git diff of your changes. Ensure the code matches the project's quality standards.

3. **Status Updates:**
   - Once a task is successfully implemented and verified, ask the user if they'd like to commit it.
   - After committing, move on to the next task in the sequence.

4. **Completion:**
   - When all tasks for the Story are complete, update the Kanban board to mark the Story as **"To Review"**.
   - **NEVER** mark the Story as "Done". Only the Quality Gate (`ln-500`) can do that after a full review.
   - Inform the user: "All tasks for this story are implemented. We are ready to run the Quality Gate (ln-500) next."

**Rules:**
- ONLY work on one task at a time.
- If a verification method fails during a task, fix the code immediately before proceeding to the next task.
- Do not skip the self-review step. Ensure you are completely satisfied with the diff before committing.
