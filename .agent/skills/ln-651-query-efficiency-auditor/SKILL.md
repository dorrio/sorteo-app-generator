---
name: ln-651-query-efficiency-auditor
description: Checks redundant entity fetches, N-UPDATE/DELETE loops, unnecessary resolves, over-fetching, missing bulk operations, wrong caching scope. Returns findings with severity, location, effort, recommendations.
---

# Query Efficiency Auditor Skill

When invoked, act as the Query Efficiency Auditor. Your objective is:
Checks redundant entity fetches, N-UPDATE/DELETE loops, unnecessary resolves, over-fetching, missing bulk operations, wrong caching scope. Returns findings with severity, location, effort, recommendations.

## Steps to Execute

1. **Understand Context:** Review the active conversation and the current codebase state before proceeding.
2. **Execute Primary Goal:** Fulfill the requirements implied by this skill's description using your knowledge and available tools.
3. **Conversational Feedback:** Guide the user interactively. Ask for confirmation when making destructive or major architectural changes, and avoid acting in the background without informing the user.

**Rules:**
- Follow Antigravity guidelines as a conversational agent.
- Explicitly avoid running background Claude Code primitives (like `TeamCreate`, `SendMessage`, or hooks).
- Rely on conversational prompts, existing tools (like file edits or lint commands), and direct interaction with the user.
