## 2024-05-23 - [Open Graph/Viral Loop]
**Hypothesis:** If we preserve the specific tool branding (e.g., "Wheel of Names" colors/icon) when sharing a pre-filled list, instead of defaulting to a generic "List Randomizer" look, we will increase the Click-Through Rate (CTR) because the visual context matches the user's intent (e.g., "Spin the Wheel" is more exciting than "View List").

**Implementation:** Modified `app/api/og/route.tsx` to conditionally apply the "List Randomizer" theme only when no specific `type` is provided (or type is 'list'). This allows 'wheel', 'rng', and other branded themes to persist even when rendering the 'List Preview' mode.

**Outcome:** Expect increased CTR on shared links for branded tools with custom lists, as the "Boring Link" factor is reduced.
