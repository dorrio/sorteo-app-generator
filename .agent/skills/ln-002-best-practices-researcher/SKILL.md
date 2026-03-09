---
name: ln-002-best-practices-researcher
description: Research best practices via MCP Ref/Context7/WebSearch and create documentation (guide/manual/ADR/research). Single research, multiple output types.
---

# Best Practices Researcher Skill

When invoked, act as the Best Practices Researcher. Your objective is:
Research best practices via MCP Ref/Context7/WebSearch and create documentation (guide/manual/ADR/research). Single research, multiple output types.

## Steps to Execute

1. **Understand Context:** Review the active conversation and the current codebase state before proceeding.
2. **Execute Primary Goal:** Fulfill the requirements implied by this skill's description using your knowledge and available tools.
3. **Conversational Feedback:** Guide the user interactively. Ask for confirmation when making destructive or major architectural changes, and avoid acting in the background without informing the user.

**Rules:**
- Follow Antigravity guidelines as a conversational agent.
- Explicitly avoid running background Claude Code primitives (like `TeamCreate`, `SendMessage`, or hooks).
- Rely on conversational prompts, existing tools (like file edits or lint commands), and direct interaction with the user.
