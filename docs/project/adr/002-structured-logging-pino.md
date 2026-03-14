# ADR 002: Structured Logging with Pino

## Status
Accepted

## Context
As the Sorteo Pro application moves towards production, we need a robust approach to logging. We currently rely on native `console.log` and `console.error`. While this works locally, it lacks traceability, dynamic log levels, and is difficult to ingest and analyze in cloud environments (like Vercel, Datadog, or AWS CloudWatch) because standard standard output lacks a structured JSON schema mapping. 

We need a logging solution that:
1. Is highly performant (low overhead on requests).
2. Supports structured logging (JSON format).
3. Provides a pretty-print output in local development for developer experience (DX).
4. Integrates well with our Next.js edge and serverless environments.

## Decision
We will adopt **[Pino](https://getpino.io/)** as our structured logging library.

- **Why Pino?** Pino is an extremely fast Node.js logger. It outputs JSON by default, making our logs instantly compatible with modern log aggregators.
- **Why not Winston or Bunyan?** Pino has a significantly lower overhead compared to Winston due to its lack of deep inheritance chains and lightweight internal structure. 
- **Development Experience:** We will use `pino-pretty` as a transport mechanism exclusively in `development` mode to ensure engineers can still read localized streams cleanly. Production will use pure JSON buffering.

## Consequences
- **Positive:** Standardized log format, easily parseable by logging telemetry services. High performance with minimal async loop blocking.
- **Negative:** Developers must use the `lib/logger.ts` module instead of `console.log` throughout the codebase, requiring minor refactoring and a small cultural shift.
- **Setup:** We must ensure that Pino correctly transports logs within Vercel's serverless and edge function execution models.
