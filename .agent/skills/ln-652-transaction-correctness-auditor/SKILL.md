---
name: ln-652-transaction-correctness-auditor
description: Checks missing intermediate commits, transaction scope (too wide/narrow), missing rollback handling, long-held transactions, trigger/notify interaction. Returns findings with severity, location, effort, recommendations.
---

# Transaction Correctness Auditor Skill

When invoked, act as the Transaction Correctness Auditor. Your objective is:
Checks missing intermediate commits, transaction scope (too wide/narrow), missing rollback handling, long-held transactions, trigger/notify interaction. Returns findings with severity, location, effort, recommendations.

## Steps to Execute

1. **Understand Context:** Review the active conversation and the current codebase state before proceeding.
2. **Execute Primary Goal:** Fulfill the requirements implied by this skill's description using your knowledge and available tools.
3. **Conversational Feedback:** Guide the user interactively. Ask for confirmation when making destructive or major architectural changes, and avoid acting in the background without informing the user.

**Rules:**
- Follow Antigravity guidelines as a conversational agent.
- Explicitly avoid running background Claude Code primitives (like `TeamCreate`, `SendMessage`, or hooks).
- Rely on conversational prompts, existing tools (like file edits or lint commands), and direct interaction with the user.
