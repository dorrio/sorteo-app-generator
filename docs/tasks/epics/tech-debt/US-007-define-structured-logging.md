# US-007: Define structured logging strategy

**Epic**: tech-debt
**Status**: Done
**Priority**: 🟢 Low
**Size**: S

**REAL GOAL**: Define a structured logging strategy and implement it using `pino` to format output specifically as JSON `stdout`, making it deeply compatible with Vercel's logging ingestion. 

---

## 🎯 Acceptance Criteria

- [ ] A central logger utility exists using `pino`.
- [ ] Logs in production are formatted as structured JSON to `stdout`.
- [ ] Logs in development are easily readable (pretty-printed if possible, though JSON is acceptable if Vercel `vercel dev` handles it).
- [ ] Next.js API Routes and Server Actions can import and use the logger natively.
- [ ] An Architectural Decision Record (ADR) or Technical Note exists defining this standard (why Pino, what log levels to use, etc).

---

## 🛠️ Implementation Tasks (IDEAL Plan)

- **[ ] Task 1: Document Logging Strategy (ADR)**
  - **Description**: Add a short ADR (e.g., `docs/project/adr/00x-structured-logging-pino.md` or similar) noting that `pino` is the standard for structured logging and explaining the convention for log levels (info, warn, error, fatal).
  - **Verify**: `inspect` the generated markdown file.

- **[ ] Task 2: Install and Configure Pino Logger**
  - **Description**: Install `pino` (and `pino-pretty` for development, if permitted). Create a central `lib/logger.ts` utility that exports a configured Pino instance.
  - **Verify**: `test` that the file compiles and exports the expected shape without type errors.

- **[ ] Task 3: Instrument an API Route / Action**
  - **Description**: Add a sample log statement using `logger.info()` or `logger.warn()` in a frequently hit area or API route to test the ingestion format.
  - **Verify**: `command` (run the local server and trigger the route, verifying standard output contains the JSON Pino log).
