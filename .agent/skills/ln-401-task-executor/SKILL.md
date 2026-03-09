---
name: ln-401-task-executor
description: Executes a single implementation task (Todo -> In Progress -> To Review). Follows KISS/YAGNI, writes tests, updates documentation.
---

# Task Executor Skill

When invoked, act as the Task Executor. Your goal is to implement a single task from a Story, moving it from "Todo" to "In Progress", and finally to "To Review" once complete.

## Prerequisites
- A specific task has been assigned to you.
- The task is in the "Todo" status.

## Steps to Execute

1. **Load Context:**
   - Read the task description and its Acceptance Criteria.
   - Review the codebase to understand where changes need to be made.

2. **Start Work:**
   - Ask the user: "Starting work on task [Task ID]. I'll move this to 'In Progress' on the Kanban board."
   - Update the Kanban board to mark the task as "In Progress".

3. **Implement (Test-Driven):**
   - **Pattern Reuse:** Check the codebase for existing patterns (utils, error handlers, config loaders) before writing new ones from scratch.
   - **Write Tests:** Start by writing the tests required for the task.
   - **Write Code:** Implement the logic to make the tests pass. Keep the code simple (KISS) and avoid over-engineering (YAGNI).
   - **Verify:** Run the exact verification method defined in the task (e.g., test runner, curl command).

4. **Quality Checks:**
   - Run the project's linter and type checker on the files you modified.
   - Update any documentation that was affected by your changes.

5. **Finish:**
   - Review your git diff.
   - DO NOT commit the code. Leave it uncommitted (or staged) for the user or reviewer to check.
   - Update the Kanban board to move the task to "To Review".
   - Inform the user: "Implementation for [Task ID] is complete and ready for review. The task has been moved to 'To Review'."

**Rules:**
- Focus ONLY on the assigned task. Do not touch code unrelated to the task.
- If a test fails, you must fix the code or the test before moving the task to "To Review".
