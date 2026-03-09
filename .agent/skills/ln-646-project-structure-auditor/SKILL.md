---
name: ln-646-project-structure-auditor
description: Audits project physical structure: file hygiene, ignore file quality, framework convention compliance, domain/layer organization, naming conventions. Stack-adaptive via auto-detection.
---

# Project Structure Auditor Skill

When invoked, act as the Project Structure Auditor. Your objective is:
Audits project physical structure: file hygiene, ignore file quality, framework convention compliance, domain/layer organization, naming conventions. Stack-adaptive via auto-detection.

## Steps to Execute

1. **Understand Context:** Review the active conversation and the current codebase state before proceeding.
2. **Execute Primary Goal:** Fulfill the requirements implied by this skill's description using your knowledge and available tools.
3. **Conversational Feedback:** Guide the user interactively. Ask for confirmation when making destructive or major architectural changes, and avoid acting in the background without informing the user.

**Rules:**
- Follow Antigravity guidelines as a conversational agent.
- Explicitly avoid running background Claude Code primitives (like `TeamCreate`, `SendMessage`, or hooks).
- Rely on conversational prompts, existing tools (like file edits or lint commands), and direct interaction with the user.
