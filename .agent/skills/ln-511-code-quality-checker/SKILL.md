---
name: ln-511-code-quality-checker
description: Worker that checks DRY/KISS/YAGNI/architecture compliance with quantitative Code Quality Score. Validates architectural decisions via MCP Ref: (1) Optimality (2) Compliance (3) Performance. Reports issues with SEC-, PERF-, MNT-, ARCH-, BP-, OPT- prefixes.
---

# Code Quality Checker Skill

When invoked, act as the Code Quality Checker. Your objective is:
Worker that checks DRY/KISS/YAGNI/architecture compliance with quantitative Code Quality Score. Validates architectural decisions via MCP Ref: (1) Optimality (2) Compliance (3) Performance. Reports issues with SEC-, PERF-, MNT-, ARCH-, BP-, OPT- prefixes.

## Steps to Execute

1. **Understand Context:** Review the active conversation and the current codebase state before proceeding.
2. **Execute Primary Goal:** Fulfill the requirements implied by this skill's description using your knowledge and available tools.
3. **Conversational Feedback:** Guide the user interactively. Ask for confirmation when making destructive or major architectural changes, and avoid acting in the background without informing the user.

**Rules:**
- Follow Antigravity guidelines as a conversational agent.
- Explicitly avoid running background Claude Code primitives (like `TeamCreate`, `SendMessage`, or hooks).
- Rely on conversational prompts, existing tools (like file edits or lint commands), and direct interaction with the user.
