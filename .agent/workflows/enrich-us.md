---
description: Enrich a Jira ticket with technical details and acceptance criteria
---

1. Use Jira MCP to get the ticket details for $ARGUMENTS (ticket ID or description).
2. Analyze the problem as a product expert with technical knowledge.
3. Check if the User Story is detailed (description, fields, endpoints, files, completion steps, tests, security, performance).
4. If it lacks detail, provide an improved version using the project specs in `/ai-specs/specs`.
5. Update the Jira ticket, adding the "enhanced" section after the "original" one.
6. If it was "To refine", move it to "Pending refinement validation".
