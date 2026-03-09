# 002. Structured Logging with Pino

**Date**: 2026-03-09
**Status**: Accepted

## Context

As the application grows, observing and tracking server-side behavior and errors becomes critical. We have adopted Vercel as our hosting infrastructure and recently integrated Vercel Error Tracking (powered by Sentry).

However, beyond error capture, we need a standard, structured logging mechanism for general application behavior (informational logs, warnings, debugging context). Standard `console.log` statements are inconsistent, hard to parse programmatically, and lack severities.

Vercel inherently parses JSON logs emitted to `stdout` from Node.js/Edge environments, automatically lifting properties like `level`, `message`, and custom metadata into its logging dashboard.

## Decision

We will use **Pino** (`pino`) as our standard structured logging library.

1. **Format:** Output will be strict JSON stringified to `stdout` in all non-local environments (Preview, Production). We will configure the logger to format logs so they integrate cleanly with Vercel's parsing expectations (e.g., translating Pino's internal level numbers to text like "info", "error" if needed, though Vercel is generally compatible out of the box).
2. **Local Development:** We will use `pino-pretty` to format development logs in the console to retain human readability.
3. **Log Levels:** We strictly adhere to the following definitions:
   - `trace` / `debug`: Extremely detailed information, used only during active local debugging.
   - `info`: General operational entries about what's going on (e.g., "User signed up", "Background job finished").
   - `warn`: Non-critical anomalies. Things that are unexpected but the system recovered or handled gracefully.
   - `error`: Handled exceptions or operational errors that require attention but don't crash the immediate process (unhandled errors will be caught natively by Sentry).
   - `fatal`: Critical failure causing process exit or severe data corruption.

## Consequences

- **Pros:** Fast, minimal overhead. Logs become easily searchable and filterable in the Vercel dashboard. Enforces a consistent logging pattern across the team.
- **Cons:** Developers must remember to import the custom `logger` instead of using `console.log`.
