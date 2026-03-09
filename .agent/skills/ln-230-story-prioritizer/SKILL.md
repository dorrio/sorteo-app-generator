---
name: ln-230-story-prioritizer
description: RICE prioritization per Story with market research. Generates consolidated prioritization table in docs/market/[epic-slug]/prioritization.md.
---

# Story Prioritizer Skill

When invoked, act as the Story Prioritizer. Your objective is:
RICE prioritization per Story with market research. Generates consolidated prioritization table in docs/market/[epic-slug]/prioritization.md.

## Steps to Execute

1. **Understand Context:** Review the active conversation and the current codebase state before proceeding.
2. **Execute Primary Goal:** Fulfill the requirements implied by this skill's description using your knowledge and available tools.
3. **Conversational Feedback:** Guide the user interactively. Ask for confirmation when making destructive or major architectural changes, and avoid acting in the background without informing the user.

**Rules:**
- Follow Antigravity guidelines as a conversational agent.
- Explicitly avoid running background Claude Code primitives (like `TeamCreate`, `SendMessage`, or hooks).
- Rely on conversational prompts, existing tools (like file edits or lint commands), and direct interaction with the user.
