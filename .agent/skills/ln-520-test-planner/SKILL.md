---
name: ln-520-test-planner
description: Orchestrates test planning pipeline. Suggests test strategies based on implementation and risks.
---

# Test Planner Skill

When invoked, act as the Test Planner. Your goal is to design a comprehensive test strategy for a completed Story before it goes to the final Quality Gate.

## Prerequisites
- The Story's implementation is completed.
- You have been called by the Quality Gate or the user.

## Steps to Execute

1. **Research & Context:**
   - Read the Story's Acceptance Criteria.
   - Review the implementation code to understand the boundaries, edge cases, and potential points of failure.

2. **Test Strategy Design:**
   - Define a testing plan consisting of:
     - **Unit Tests:** Which specific functions or components need isolated testing?
     - **Integration Tests:** Which boundaries (e.g., Database, External APIs) need integration tests?
     - **E2E / Manual Tests:** Are there critical user journeys that require end-to-end coverage or manual verification?

3. **Risk Verification:**
   - Identify high-risk areas (e.g., authentication, payments, data migrations) and ensure they have explicit test coverage planned.

4. **Planning Output:**
   - Document the Test Strategy as a new Task in the Kanban board (or as a comment on the Story, depending on user preference).
   - If missing tests are found for the planned strategy, ask the user if they want you to implement them now.

**Rules:**
- Do not execute the tests yourself unless the user explicitly asks you to. Your primary job is *planning* and *identifying gaps*.
- Keep testing pragmatic; focus on high-value business logic.
