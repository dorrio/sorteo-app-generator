import { expect, test } from '@playwright/test';

// Core Web Vitals budget — local production build, one locale is enough
// since all pages share the same layout/CSS/JS critical path. The budgets
// use Google's "good" thresholds, which we should comfortably clear on
// localhost; this catches regressions that would push real users over the
// threshold, not performance improvements.
type Budget = {
  /** Largest Contentful Paint — largest above-the-fold element painted. */
  lcp: number;
  /** First Contentful Paint — first text/image painted. */
  fcp: number;
  /** Cumulative Layout Shift — layout shifts through the page's lifecycle. */
  cls: number;
  /** Time to First Byte — server response start. */
  ttfb: number;
};

const BUDGET: Budget = {
  lcp: 2500,
  fcp: 1800,
  cls: 0.1,
  ttfb: 800,
};

const SAMPLE_ROUTES = [
  '/en', // homepage
  '/en/wheel-of-names', // heaviest tool (canvas + framer-motion)
  '/en/glossary', // text-heavy RSC page
  '/en/alternativa-appsorteos', // versus landing
];

type Vitals = {
  lcp: number | null;
  fcp: number | null;
  cls: number;
  ttfb: number | null;
};

for (const route of SAMPLE_ROUTES) {
  test(`${route} clears Core Web Vitals budget`, async ({ page }, testInfo) => {
    // Install observers BEFORE navigation so LCP/CLS entries are captured
    // from the very first frame. Once the page is idle we read window.__vitals.
    await page.addInitScript(() => {
      const w = window as unknown as { __vitals: Vitals };
      w.__vitals = { lcp: null, fcp: null, cls: 0, ttfb: null };

      try {
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            w.__vitals.lcp = entry.startTime;
          }
        }).observe({ type: 'largest-contentful-paint', buffered: true });
      } catch {
        // Firefox / older browsers — LCP unavailable; we run on chromium anyway.
      }

      try {
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries() as PerformanceEntry[]) {
            // Only count shifts the user didn't cause.
            const e = entry as PerformanceEntry & {
              hadRecentInput?: boolean;
              value?: number;
            };
            if (!e.hadRecentInput && typeof e.value === 'number') {
              w.__vitals.cls += e.value;
            }
          }
        }).observe({ type: 'layout-shift', buffered: true });
      } catch {
        // Older browsers don't emit layout-shift entries.
      }
    });

    // Warmup hit: Next route compilation and in-memory caches prime on the
    // first request, which inflates TTFB on an otherwise-good build. We care
    // about the steady-state number, not the cold-start one. Playwright's
    // parallel workers make this worse by hammering the server simultaneously.
    await page.goto(route);

    await page.goto(route);
    // Wait for network to settle AND ~1s afterwards — LCP can fire late
    // if the largest element is a below-the-fold image loading async.
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    const vitals = await page.evaluate<Vitals>(() => {
      const w = window as unknown as { __vitals: Vitals };
      // FCP from paint timing (the browser already populated this).
      const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
      const nav = performance.getEntriesByType('navigation')[0] as
        | PerformanceNavigationTiming
        | undefined;
      return {
        ...w.__vitals,
        fcp: fcpEntry ? fcpEntry.startTime : null,
        ttfb: nav ? nav.responseStart : null,
      };
    });

    await testInfo.attach('vitals.json', {
      contentType: 'application/json',
      body: JSON.stringify(vitals, null, 2),
    });

    expect(vitals.lcp, `LCP on ${route}`).not.toBeNull();
    expect(vitals.lcp!, `LCP on ${route} must be under ${BUDGET.lcp}ms`).toBeLessThan(BUDGET.lcp);
    expect(vitals.fcp, `FCP on ${route}`).not.toBeNull();
    expect(vitals.fcp!, `FCP on ${route} must be under ${BUDGET.fcp}ms`).toBeLessThan(BUDGET.fcp);
    expect(vitals.cls, `CLS on ${route} must be under ${BUDGET.cls}`).toBeLessThan(BUDGET.cls);
    expect(vitals.ttfb, `TTFB on ${route}`).not.toBeNull();
    expect(vitals.ttfb!, `TTFB on ${route} must be under ${BUDGET.ttfb}ms`).toBeLessThan(
      BUDGET.ttfb,
    );
  });
}
