---
name: ln-645-open-source-replacer
description: Goal-based open-source replacement auditor: discovers custom modules (>100 LOC), analyzes PURPOSE via code reading, searches OSS alternatives via MCP Research (WebSearch, Context7, Ref), evaluates quality (stars, maintenance, license, CVE, API compatibility), generates migration plan.
---

# Open Source Replacer Skill

When invoked, act as the Open Source Replacer. Your objective is:
Goal-based open-source replacement auditor: discovers custom modules (>100 LOC), analyzes PURPOSE via code reading, searches OSS alternatives via MCP Research (WebSearch, Context7, Ref), evaluates quality (stars, maintenance, license, CVE, API compatibility), generates migration plan.

## Steps to Execute

1. **Understand Context:** Review the active conversation and the current codebase state before proceeding.
2. **Execute Primary Goal:** Fulfill the requirements implied by this skill's description using your knowledge and available tools.
3. **Conversational Feedback:** Guide the user interactively. Ask for confirmation when making destructive or major architectural changes, and avoid acting in the background without informing the user.

**Rules:**
- Follow Antigravity guidelines as a conversational agent.
- Explicitly avoid running background Claude Code primitives (like `TeamCreate`, `SendMessage`, or hooks).
- Rely on conversational prompts, existing tools (like file edits or lint commands), and direct interaction with the user.
