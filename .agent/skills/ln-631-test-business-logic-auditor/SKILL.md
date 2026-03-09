---
name: ln-631-test-business-logic-auditor
description: Detects tests that validate framework/library behavior (Prisma, Express, bcrypt, JWT, axios, React hooks) instead of OUR code. Returns findings with REMOVE decisions.
---

# Test Business Logic Auditor Skill

When invoked, act as the Test Business Logic Auditor. Your objective is:
Detects tests that validate framework/library behavior (Prisma, Express, bcrypt, JWT, axios, React hooks) instead of OUR code. Returns findings with REMOVE decisions.

## Steps to Execute

1. **Understand Context:** Review the active conversation and the current codebase state before proceeding.
2. **Execute Primary Goal:** Fulfill the requirements implied by this skill's description using your knowledge and available tools.
3. **Conversational Feedback:** Guide the user interactively. Ask for confirmation when making destructive or major architectural changes, and avoid acting in the background without informing the user.

**Rules:**
- Follow Antigravity guidelines as a conversational agent.
- Explicitly avoid running background Claude Code primitives (like `TeamCreate`, `SendMessage`, or hooks).
- Rely on conversational prompts, existing tools (like file edits or lint commands), and direct interaction with the user.
