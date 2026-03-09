# US-006: Add error tracking (Sentry / Vercel)

## 📖 Story Outline
**Epic**: tech-debt
**Status**: Todo
**Priority**: 🟡 Medium
**Size**: S

**REAL GOAL**: Integrate Vercel Error Tracking into the application across all environments (dev, preview, prod) and configure email alerts for caught/uncaught exceptions to ensure visibility into runtime issues.

---

## 🎯 Acceptance Criteria

- [ ] Ensure Next.js automatically captures frontend unhandled exceptions.
- [ ] Ensure backend/serverless unhandled exceptions are captured.
- [ ] The tracking should be enabled correctly for all environments (development, preview, production).
- [ ] A test procedure exists to trigger an error specifically for checking the email alert workflow to the user's email.
- [ ] Manual test: Intentionally trigger a test error and receive an email notification indicating a caught error in Vercel.

---

## 🛠️ Implementation Tasks (IDEAL Plan)

- **[ ] Task 1: Initialize Vercel Error Tracking Integration**
  - **Description**: Add the required Vercel SDK/integration (e.g., configuring `@sentry/nextjs` or `@vercel/functions` tracing if Vercel native) and configure the client/server files (`sentry.client.config.ts`, `sentry.server.config.ts` if using Sentry by Vercel's pattern). Ensure the configuration accounts for all environments.
  - **Verify**: `inspect` the generated config files or Vercel dashboard integrations page.

- **[ ] Task 2: Update App Layout & Error Boundaries**
  - **Description**: Integrate the error capture logic directly into the global Error Boundary components. Make sure we report captured but handled exceptions to the tracking tool explicitly if needed.
  - **Verify**: `test` that the global Error Boundary invokes the tracking reporter when catching an error.

- **[ ] Task 3: Implement Test Endpoint & Validate Alerts**
  - **Description**: Create a secure or temporary endpoint/component button that deliberately causes a runtime exception to manually test the end-to-end flow. Confirm that email alerts (configured from Vercel dashboard) are fired properly.
  - **Verify**: `inspect` email inbox for Vercel/Sentry error alert.

---

## 💬 Technical Notes
- Vercel recently promoted deeply integrated Error Tracking. We might just need to enable Sentry via Vercel Integrations or install the specific telemetry packages.
- Need to verify if the Next.js `instrumentation.ts` file needs configuration.
