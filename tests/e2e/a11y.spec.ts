import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

// Axe scans are ~2-3s per page, so we sample a representative slice rather
// than all 69 routes in smoke.spec.ts. One homepage, one tool page, one
// content-heavy landing, one versus page — across 3 locales = 12 scans.
//
// Violations at "critical" or "serious" severity fail the test. "moderate"
// and "minor" are logged (via test.info attachments) but don't block —
// many fall on 3rd-party iframes (GA/GTM) we don't own.
type Locale = 'en' | 'es' | 'pt';
const LOCALES: Locale[] = ['en', 'es', 'pt'];
const SAMPLE_SLUGS = [
  '', // homepage
  'wheel-of-names', // tool page
  'glossary', // content-heavy
  'alternativa-appsorteos', // versus / marketing
];

for (const locale of LOCALES) {
  for (const slug of SAMPLE_SLUGS) {
    const path = slug ? `/${locale}/${slug}` : `/${locale}`;

    test(`${path} has no serious or critical a11y violations`, async ({ page }, testInfo) => {
      await page.goto(path, { waitUntil: 'domcontentloaded' });
      // Wait for first heading so the page has hydrated enough for axe to read it.
      await expect(page.getByRole('heading').first()).toBeVisible();

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        // 3rd-party pixels/widgets are out of our control.
        .exclude('iframe[src*="googletagmanager"], iframe[src*="google-analytics"]')
        .analyze();

      const blocking = results.violations.filter(
        (v) => v.impact === 'critical' || v.impact === 'serious',
      );
      const advisory = results.violations.filter(
        (v) => v.impact !== 'critical' && v.impact !== 'serious',
      );

      if (advisory.length > 0) {
        await testInfo.attach('advisory-violations.json', {
          contentType: 'application/json',
          body: JSON.stringify(advisory, null, 2),
        });
      }

      expect(
        blocking,
        `blocking a11y violations on ${path}:\n${blocking
          .map((v) => `- [${v.impact}] ${v.id}: ${v.help}`)
          .join('\n')}`,
      ).toEqual([]);
    });
  }
}
