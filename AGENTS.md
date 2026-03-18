---
description: This document contains all development rules and guidelines for this project, applicable to all AI agents (Claude, Cursor, Codex, Gemini, etc.).
alwaysApply: true
---

## 1. Core Principles

- **Small tasks, one at a time**: Always work in baby steps, one at a time. Never go forward more than one step.
- **Test-Driven Development**: Start with failing tests for any new functionality (TDD), according to the task details.
- **Type Safety**: All code must be fully typed.
- **Clear Naming**: Use clear, descriptive names for all variables and functions.
- **Incremental Changes**: Prefer incremental, focused changes over large, complex modifications.
- **Question Assumptions**: Always question assumptions and inferences.
- **Pattern Detection**: Detect and highlight repeated code patterns.

## 2. Language Standards

- **English Only**: All technical artifacts must always use English, including:
    - Code (variables, functions, classes, comments, error messages, log messages)
    - Documentation (README, guides, API docs)
    - Jira tickets (titles, descriptions, comments)
    - Data schemas and database names
    - Configuration files and scripts
    - Git commit messages
    - Test names and descriptions

## 3. Specific Standards & Coding Practices

- **Code Comments**: Aim for a 15-20% ratio. Explain WHY, not WHAT. DO NOT include Epic/Task IDs, historical notes, or unnecessary code examples in production comments.
- For detailed standards and guidelines specific to different areas of the project, refer to:
  - [Backend Standards](./ai-specs/specs/backend-standards.mdc) - API development, database patterns, testing, security and backend best practices
  - [Frontend Standards](./ai-specs/specs/frontend-standards.mdc) - React components, UI/UX guidelines, and frontend architecture
  - [Documentation Standards](./ai-specs/specs/documentation-standards.mdc) - Technical documentation structure, formatting, and maintenance guidelines, including AI standards like this document

## 4. Specialized Skills

This project leverages Antigravity's **Skills** for expert-level tasks:

- **`backend-architect`**: Invokes DDD and Prisma patterns for backend development.
- **`frontend-architect`**: Applied for React components, Atomic Design, and design system adherence.

## 5. Slash Commands (Workflows)

The following workflows are available via `/` (Slash Commands):

- `/enrich-us`: Technical enhancement of Jira tickets.
- `/plan-backend-ticket`: Generates detailed backend implementation plans.
- `/plan-frontend-ticket`: Generates detailed frontend implementation plans.
- `/develop-backend`: Executes implementation following a plan.
- `/develop-frontend`: Implements UI from Figma designs.

## 6. Tools and Integrations

- **Context7 MCP Server**: ALL AI agents (including Claude, Gemini, Jules, Cursor, etc.) MUST ALWAYS use the `context7` MCP server tools (e.g. `mcp_context7_resolve-library-id` and `mcp_context7_query-docs`) to look up and query up-to-date documentation, best practices, and code examples for any library or framework BEFORE attempting to use internal knowledge or searching the web.
- **Package Manager**: Always use `pnpm` to install dependencies and run scripts.