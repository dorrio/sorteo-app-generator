import { expect, test } from '@playwright/test';

// /api/og is an edge-runtime route that returns a PNG (via next/og's
// ImageResponse). It powers every OG/Twitter preview card and the
// verify-page certificate share. When it breaks — invalid color regex,
// missing font bundle, ImageResponse import drift — users see broken
// social previews, but no page fails. These smokes make it fail loud.
type Variant = {
  name: string;
  query: string;
};

const VARIANTS: Variant[] = [
  { name: 'default (no params)', query: '' },
  { name: 'wheel type', query: 'type=wheel' },
  { name: 'list type with list param', query: 'type=list&list=Alice%2CBob%2CCharlie' },
  { name: 'rng type', query: 'type=rng' },
  { name: 'instagram type', query: 'type=instagram' },
  {
    name: 'full combo (name + title + date + color)',
    query:
      'type=wheel&name=Alice&title=Christmas%20Draw&date=2026-12-25T00%3A00%3A00.000Z&color=%23FF5533',
  },
  {
    name: 'malformed color falls through to default',
    query: 'type=wheel&color=javascript%3Aalert(1)',
  },
  {
    name: 'overlong title and name (must truncate, not error)',
    query: `name=${'A'.repeat(200)}&title=${'B'.repeat(200)}`,
  },
];

for (const { name, query } of VARIANTS) {
  test(`OG image: ${name}`, async ({ request }) => {
    const res = await request.get(`/api/og${query ? `?${query}` : ''}`);
    expect(res.status(), `status on ${query}`).toBe(200);

    const contentType = res.headers()['content-type'] ?? '';
    expect(contentType, `content-type on ${query}`).toMatch(/^image\/png/);

    const body = await res.body();
    // next/og ImageResponse with typical 1200x630 @ PNG is tens of KB.
    // Anything under 1KB is an error page or a truncated response.
    expect(body.byteLength, `body size on ${query}`).toBeGreaterThan(1000);
  });
}
