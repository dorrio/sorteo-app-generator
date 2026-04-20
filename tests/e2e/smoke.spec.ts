import { expect, test } from '@playwright/test';

// Spanish (es) is highest traffic and the most consistently translated, so
// every page is smoked in that locale. Adding en/pt variants later is a
// straightforward for-loop over `locales` — intentionally not done here to
// keep the first-pass coverage cost bounded.
type Page = {
  slug: string;
  /** substring expected inside at least one <h1> on the rendered page */
  h1: string;
};

const PAGES: Page[] = [
  { slug: '', h1: 'Sorteo' }, // homepage: initialTitle="Sorteo Pro" from app/[locale]/page.tsx
  { slug: 'wheel-of-names', h1: 'Ruleta de Nombres' },
  { slug: 'random-number-generator', h1: 'Generador de Números' },
  { slug: 'instagram-comment-picker', h1: 'Comentarios de Instagram' },
  { slug: 'list-randomizer', h1: 'Aleatorizar Lista' },
  { slug: 'secret-santa-generator', h1: 'Amigo Invisible' },
  { slug: 'yes-or-no-wheel', h1: 'Ruleta Sí o No' },
  { slug: 'random-letter-generator', h1: 'Generador de Letras' },
  { slug: 'random-country-generator', h1: 'Generador de Países' },
  { slug: 'dice-roller', h1: 'Lanzar Dados' },
  { slug: 'team-generator', h1: 'Generador de Equipos' },
  { slug: 'coin-flip', h1: 'Lanzar Moneda' },
  { slug: 'rock-paper-scissors', h1: 'Piedra Papel Tijeras' },
  { slug: 'random-month-generator', h1: 'Generador de Mes' },
  { slug: 'random-card-generator', h1: 'Generador de Cartas' },
  { slug: 'bingo-number-generator', h1: 'Generador de Números de Bingo' },
  { slug: 'truth-or-dare-generator', h1: 'Verdad o Reto' },
  { slug: 'glossary', h1: 'Glosario de Sorteos' },
  { slug: 'versus', h1: 'Sorteo Pro vs El Mundo' },
  // versus-vs pages wrap MainApp, so the first h1 is whichever tool's hero
  // title they reuse (RngPage.h1 / WheelGeoPage.h1), not the VersusGeo header.
  { slug: 'versus/wheel-of-names-vs-sorteo-pro', h1: 'Ruleta de Nombres' },
  { slug: 'versus/random-org-vs-sorteo-pro', h1: 'Generador de Números' },
  { slug: 'alternativa-appsorteos', h1: 'Alternativa a AppSorteos' },
  { slug: 'alternativa-wheel-of-names', h1: 'Alternativa' },
];

for (const { slug, h1 } of PAGES) {
  const path = slug ? `/es/${slug}` : '/es';

  test(`${path} renders h1 and parseable JSON-LD`, async ({ page }) => {
    await page.goto(path);

    // h1 — at least one element on the page must carry the expected copy.
    // Catches missing i18n keys, wrong namespace wiring, and blank renders.
    await expect(page.locator('h1').first()).toContainText(h1);

    // JSON-LD — every tool page must emit structured data that parses.
    // Guards against regression of safeJsonLdStringify / <JsonLd> and
    // against bundler mishaps that strip the inline <script> on SSR.
    const jsonLdTexts = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();

    expect(jsonLdTexts.length, 'at least one JSON-LD script tag').toBeGreaterThan(0);

    for (const raw of jsonLdTexts) {
      expect(() => JSON.parse(raw), `parseable JSON-LD on ${path}`).not.toThrow();
    }
  });
}
