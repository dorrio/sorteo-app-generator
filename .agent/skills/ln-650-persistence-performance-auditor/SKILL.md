---
name: ln-650-persistence-performance-auditor
description: Coordinates 4 specialized audit workers (query efficiency, transaction correctness, runtime performance, resource lifecycle). Researches DB/ORM/async best practices, delegates parallel audits, aggregates results into docs/project/persistence_audit.md.
---

# Persistence Performance Auditor Skill

When invoked, act as the Persistence Performance Auditor. Your objective is:
Coordinates 4 specialized audit workers (query efficiency, transaction correctness, runtime performance, resource lifecycle). Researches DB/ORM/async best practices, delegates parallel audits, aggregates results into docs/project/persistence_audit.md.

## Steps to Execute

1. **Understand Context:** Review the active conversation and the current codebase state before proceeding.
2. **Execute Primary Goal:** Fulfill the requirements implied by this skill's description using your knowledge and available tools.
3. **Conversational Feedback:** Guide the user interactively. Ask for confirmation when making destructive or major architectural changes, and avoid acting in the background without informing the user.

**Rules:**
- Follow Antigravity guidelines as a conversational agent.
- Explicitly avoid running background Claude Code primitives (like `TeamCreate`, `SendMessage`, or hooks).
- Rely on conversational prompts, existing tools (like file edits or lint commands), and direct interaction with the user.
