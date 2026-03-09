---
name: ln-300-task-coordinator
description: Analyzes a Story, builds an optimal execution plan (1-8 implementation tasks), and breaks it down into actionable steps. Use this skill when the user wants to start a story and needs to plan its tasks.
---

# Task Coordinator Skill

When invoked, act as the Task Coordinator for the selected Story. Your goal is to build an optimal implementation task plan and document it before any code is written.

## Prerequisites
- The user has selected a Story to work on.
- The Story has clear Acceptance Criteria (AC) and Technical Notes.

## Steps to Execute

1. **Load Context & Goal Articulation:**
   - Read the selected Story from `docs/tasks/kanban_board.md` (or the equivalent location).
   - State the **REAL GOAL** of this Story in one sentence (e.g., "Allow users to log in with Google"). This is the deliverable, not the technical process.

2. **Decompose into an IDEAL Plan:**
   - Break down the Story into 1 to 8 **implementation tasks**.
   - Make sure tasks are organized in a **Foundation-First order** (e.g., Database -> Logic -> UI).
   - Do NOT include isolated testing or refactoring tasks in this plan. Tests should be written as part of each implementation task (TDD).

3. **Task Independence & Verification:**
   - Ensure there are no forward dependencies (Task 2 cannot depend on Task 3).
   - Each task MUST have a clear, measurable outcome and a **verification method** for its Acceptance Criteria:
     - `verify: test` (e.g., write/run a unit test)
     - `verify: command` (e.g., curl an endpoint)
     - `verify: inspect` (e.g., visual check of UI)

4. **Task Output Creation:**
   - For each planned task, create an entry in the Kanban board under the Story.
   - Summarize the final IDEAL plan to the user for approval. 
   - Ask: "Does this task breakdown look good? Once approved, we can move to the validation or execution stage."

**Rules:**
- Do not start writing application code until the user approves the task plan.
- Ensure the Kanban board remains the Single Source of Truth. Update it to reflect the new tasks.
