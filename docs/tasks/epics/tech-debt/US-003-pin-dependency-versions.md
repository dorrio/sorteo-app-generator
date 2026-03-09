# [US-003] Pin dependency versions (no more "latest")

**Epic:** tech-debt
**Type:** Maintenance
**Priority:** Medium
**Status:** Todo
**Estimate:** XS (< 1h)

---

## Problem

Several dependencies use `"latest"` as their version constraint:
- `framer-motion`, `immer`, `zustand`, `@emotion/is-prop-valid`, `use-sync-external-store`, `@vercel/analytics`

This means `pnpm install` in a new environment can silently pull breaking changes.

Additionally, `next@^16.0.7` and `eslint-config-next@^15.5.12` are on mismatched major versions.

**Audit findings:** DEPS-001, DEPS-002.

---

## Acceptance Criteria

- All `"latest"` version tags replaced with the exact current semver resolved on this machine.
- `eslint-config-next` version matches the minor version of `next`.
- `pnpm install` produces no warnings about peer dependency mismatches.
- The build still compiles successfully after pinning.

---

## Technical Approach

1. Run `pnpm list --depth=0` to get the currently resolved versions of the `"latest"` packages.
2. Update `package.json` to pin each to its resolved semver (e.g. `"framer-motion": "11.18.2"`).
3. Update `eslint-config-next` to match the Next.js major version.
4. Run `pnpm install` and verify `pnpm build` passes.

---

## Affected Components

- `package.json`
