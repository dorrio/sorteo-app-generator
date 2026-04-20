# AGENTS.md — `messages/`

Translation files for `next-intl`.

## Files

- `en.json` — English (default locale, source of truth)
- `es.json` — Spanish
- `pt.json` — Portuguese

## Hard rules

1. **All three files must share the exact same key structure.** When adding, removing, or renaming a key in one file, do it in the other two in the same commit. A missing key throws at render time and breaks SSR/static generation.
2. **`en.json` is the source of truth.** Write/update the English copy first, then translate to `es` and `pt`. If you don't speak a language, translate conservatively and mark with a brief note in the PR — do NOT copy the English string verbatim into `es`/`pt`.
3. **Keep key paths stable.** Renaming a key forces an update of every call site (`useTranslations('Namespace')` + `t('key')`). Prefer adding a new key to renaming.
4. **Namespace discipline.** Keys are grouped by namespace (`HomePage`, `Footer`, `WheelGeo`, `WheelGeoPage`, `Metadata`, `QuickSpecs`, `ShareContent`, `WinnerCeremony`, `GlobalSchema`, …). Add new keys inside the existing namespace that matches the component's scope — don't invent top-level keys for single strings.
5. **Rich text** (`<b>`, `<rng>`, etc.) is rendered via `t.rich(key, { b: (c) => <strong>{c}</strong>, … })`. The JSON string must include the tag markers. Keep tags matched and identical across locales.
6. **Do not lint-format with Prettier** aggressively — keep the 4-space indent already in these files; a huge reformat diff makes reviews unreadable.

## Before committing

- Valid JSON: `node -e "JSON.parse(require('fs').readFileSync('messages/en.json','utf8'))"` for each file.
- Key parity: every key in `en.json` exists in `es.json` and `pt.json` (and vice versa). If tooling is added for this, use it; otherwise verify by eye for the branch you touched.
- Run `pnpm build` — it surfaces missing-key errors that `pnpm dev` doesn't always catch in CSR paths.
