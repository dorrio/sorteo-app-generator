---
name: ln-310-story-validator
description: Validates Stories/Tasks with a GO/NO-GO verdict. Ensures high-quality before implementation begins. Auto-fixes structure when possible.
---

# Story Validator Skill

When invoked, act as the Story Validator. Your goal is to review a planned Story (in the Backlog) and its tasks to ensure they meet the project's standards before development starts.

## Prerequisites
- A Story has been selected and planned (tasks exist).
- The Story is in the "Backlog" status.

## Steps to Execute

1. **Load Context:**
   - Read the Story and its associated tasks from the Kanban board.
   
2. **Audit (Quality Check):**
   Review the tasks against the following criteria:
   - **Completeness:** Do all tasks have clear, actionable Acceptance Criteria?
   - **Independence:** Are the tasks free of forward dependencies?
   - **Verifiability:** Does each task have a clear verification method (test, command, inspect)?
   - **Scope:** Is the scope strictly focused on implementation (no isolated refactoring or testing tasks that should be part of implementation)?
   - **Size:** Are tasks small enough to be completed efficiently?

3. **Auto-Fix & Refine:**
   - If there are minor structural issues (e.g., missing format tags, slight reordering needed for independence), fix them automatically in the Kanban board.
   - If there are major ambiguities (e.g., missing critical requirements, hallucianted libraries), flag them as Penalty Points.

4. **Verdict (GO / NO-GO):**
   - **GO:** If the tasks are well-structured, clear, and actionable.
   - **NO-GO:** If there are blocking ambiguities or dependencies that prevent execution.

5. **Approval:**
   - On a **GO** verdict, ask the user: "Validation passed. Would you like me to move the Story to 'Todo' so we can begin execution?"
   - On a **NO-GO** verdict, report the specific issues to the user and ask them to clarify before proceeding. 

**Rules:**
- Do not let a Story pass validation if its tasks are vague or have unrealistic dependencies.
- Update the Kanban board with the results (e.g., move to "Todo").
