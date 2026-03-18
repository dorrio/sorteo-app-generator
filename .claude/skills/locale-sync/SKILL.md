---
name: locale-sync
description: "Validate translation completeness and consistency across locale files in /messages/. Use when adding new translation keys, creating new locale files, or checking i18n coverage."
---

# Locale Sync Validator

Validate that all locale JSON files in `messages/` have consistent keys.

## How to Validate

1. Read the routing config at `i18n/routing.ts` to get the list of supported locales
2. Read all JSON files in `messages/` directory
3. Use `en.json` as the reference (source of truth)
4. Compare every other locale file against it

## Checks to Perform

### Missing Keys
For each locale file, report any keys present in `en.json` but missing in that locale.

### Extra Keys
Report any keys present in a locale file but not in `en.json` (likely stale translations).

### Structural Mismatch
Check that nested object structures match. If `en.json` has `{"Footer": {"text": "..."}}`, every locale must have the same nesting.

### Placeholder Consistency
Check that ICU message format placeholders (like `{count}`, `{name}`) in translated strings match those in `en.json`. A translated string should have the same set of placeholders.

### Empty Values
Flag any keys with empty string values `""` that have non-empty values in `en.json`.

## Output Format

Produce a summary table:

| Locale | Missing Keys | Extra Keys | Placeholder Issues | Empty Values |
|--------|-------------|------------|-------------------|--------------|

Then list specific issues grouped by locale with the full key path (e.g., `HomePage.start_button`).

## Fixing Issues

When asked to fix issues:
- For missing keys, copy the English value and add a `TODO:translate` comment as the value prefix
- For extra keys, confirm with the user before removing
- For empty values, copy English value prefixed with `[NEEDS TRANSLATION]`
- Never auto-translate; only mark for translation
