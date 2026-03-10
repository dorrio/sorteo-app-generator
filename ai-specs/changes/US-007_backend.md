# US-007: Define Structured Logging Strategy (Backend Plan)

## Overview
Adopt `pino` and `pino-pretty` to implement a structured logging strategy for Sorteo Pro. This will replace scattered `console.log` and `console.error` calls with a standardized JSON-format logger that scales safely across Node.js, serverless, and edge environments, ensuring precise observability on Vercel.

## Architecture Context
- **Domain**: Observability / Infrastructure
- **Pattern**: Singleton Utility Wrapper (Logger)
- **Dependencies**: `pino` (runtime), `pino-pretty` (dev only).

## Detailed Implementation Steps

### Step 0: Branch & Setup
- Ensure work is isolated on a feature branch (e.g., `feature/US-007-structured-logging`).
- Install required packages:
  ```bash
  pnpm add pino
  pnpm add -D pino-pretty
  ```

### Step 1: Validation
- *(Skipped)*: No direct user-facing API input to validate for core logging infrastructure.

### Step 2: Infrastructure Service (Logger Utility)
- **File**: `lib/logger.ts`
- **Action**: Create a singleton wrapper around the `pino` instance.
- **Details**:
  - Export a configured `logger` object.
  - Dynamically check `process.env.NODE_ENV`. If `development`, configure the Pino transport to use `pino-pretty` for human-readable console outputs.
  - If `production`, omit the transport configuration to rapidly stream pure NDJSON to `stdout`.

### Step 3 & 4: Controller/Route (Integration)
- **Action**: Begin integrating the logger into key global contexts.
- **Details**:
  - Update `app/global-error.tsx` (and `app/[locale]/error.tsx` if server-side rendered) to log unhandled errors via `logger.error({ err: error }, 'Unhandled application crash')`.
  - Migrate notable backend endpoints (e.g., test routes or crucial API paths) to utilize `logger.info()`.

### Step 5: Tests (Verification Plan)
- **Automated / Unit**:
  - Since this is a logging wrapper, standard unit tests might just mock the console. 
- **Manual Verification (Crucial)**:
  - Run the `dev` server and observe the terminal when interacting with the app; `pino-pretty` must format logs with colors and clear timestamps.
  - Start the app with `NODE_ENV=production` and `pnpm build && pnpm start` to observe that the same interactions emit minified, uncolored JSON logs.

### Step 6: Docs
- **Action**: Ensure architectural decisions are immortalized.
- **Details**:
  - (Already Completed) ADR `002-structured-logging-pino.md` created.
  - (Already Completed) Kanban board mapped to the US-007 specification file.
