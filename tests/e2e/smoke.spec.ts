import { expect, test } from '@playwright/test';

// Covers every tool/landing page across all 3 locales. The h1 substring
// is locale-specific so a /en/* page rendering Spanish copy (the i18n
// regression we shipped in early 2026) fails loudly instead of passing
// on a permissive "h1 not empty" check.
type Locale = 'en' | 'es' | 'pt';

type Page = {
  slug: string;
  /** substring expected inside the first <h1> on the rendered page */
  h1: Record<Locale, string>;
};

const LOCALES: Locale[] = ['en', 'es', 'pt'];

const PAGES: Page[] = [
  // homepage: initialTitle="Sorteo Pro" is locale-independent brand copy.
  { slug: '', h1: { en: 'Sorteo', es: 'Sorteo', pt: 'Sorteo' } },
  {
    slug: 'wheel-of-names',
    h1: { en: 'Wheel of Names', es: 'Ruleta de Nombres', pt: 'Roleta de Nomes' },
  },
  {
    slug: 'random-number-generator',
    h1: { en: 'Random Number Generator', es: 'Generador de Números', pt: 'Gerador de Números' },
  },
  {
    slug: 'instagram-comment-picker',
    h1: {
      en: 'Instagram Comment Picker',
      es: 'Comentarios de Instagram',
      pt: 'Comentários do Instagram',
    },
  },
  {
    slug: 'list-randomizer',
    h1: { en: 'List Randomizer', es: 'Aleatorizar Lista', pt: 'Aleatorizar Lista' },
  },
  {
    slug: 'secret-santa-generator',
    h1: { en: 'Secret Santa', es: 'Amigo Invisible', pt: 'Amigo Secreto' },
  },
  {
    slug: 'yes-or-no-wheel',
    h1: { en: 'Yes or No Wheel', es: 'Ruleta Sí o No', pt: 'Roleta Sim ou Não' },
  },
  {
    slug: 'random-letter-generator',
    h1: { en: 'Random Letter Generator', es: 'Generador de Letras', pt: 'Gerador de Letras' },
  },
  {
    slug: 'random-country-generator',
    h1: { en: 'Random Country Generator', es: 'Generador de Países', pt: 'Gerador de Países' },
  },
  {
    slug: 'dice-roller',
    h1: { en: 'Dice Roller', es: 'Lanzar Dados', pt: 'Rolar Dados' },
  },
  {
    slug: 'team-generator',
    h1: { en: 'Team Generator', es: 'Generador de Equipos', pt: 'Gerador de Equipes' },
  },
  {
    slug: 'coin-flip',
    h1: { en: 'Flip a Coin', es: 'Lanzar Moneda', pt: 'Jogar Moeda' },
  },
  {
    slug: 'rock-paper-scissors',
    h1: { en: 'Rock Paper Scissors', es: 'Piedra Papel Tijeras', pt: 'Pedra Papel Tesoura' },
  },
  {
    slug: 'random-month-generator',
    h1: { en: 'Random Month', es: 'Generador de Mes', pt: 'Gerador de Mês' },
  },
  {
    slug: 'random-card-generator',
    h1: { en: 'Random Card', es: 'Generador de Cartas', pt: 'Gerador de Cartas' },
  },
  {
    slug: 'bingo-number-generator',
    h1: {
      en: 'Bingo Number',
      es: 'Generador de Números de Bingo',
      pt: 'Gerador de Números de Bingo',
    },
  },
  {
    slug: 'truth-or-dare-generator',
    h1: { en: 'Truth or Dare', es: 'Verdad o Reto', pt: 'Verdade ou Desafio' },
  },
  {
    slug: 'glossary',
    h1: { en: 'Giveaway Glossary', es: 'Glosario de Sorteos', pt: 'Glossário de Sorteios' },
  },
  {
    slug: 'versus',
    h1: {
      en: 'Sorteo Pro vs The World',
      es: 'Sorteo Pro vs El Mundo',
      pt: 'Sorteio Pro vs O Mundo',
    },
  },
  // versus-vs pages wrap MainApp, so the first h1 is whichever tool's hero
  // title they reuse (RngPage.h1 / WheelPage.h1), not the VersusGeo header.
  {
    slug: 'versus/wheel-of-names-vs-sorteo-pro',
    h1: { en: 'Wheel of Names', es: 'Ruleta de Nombres', pt: 'Roleta de Nomes' },
  },
  {
    slug: 'versus/random-org-vs-sorteo-pro',
    h1: { en: 'Random Number Generator', es: 'Generador de Números', pt: 'Gerador de Números' },
  },
  {
    slug: 'alternativa-appsorteos',
    h1: {
      en: 'Ultimate AppSorteos',
      es: 'Alternativa a AppSorteos',
      pt: 'Alternativa ao AppSorteos',
    },
  },
  {
    slug: 'alternativa-wheel-of-names',
    h1: {
      en: 'Ultimate Wheel of Names',
      es: 'Alternativa Definitiva',
      pt: 'Alternativa Definitiva',
    },
  },
];

for (const locale of LOCALES) {
  for (const { slug, h1 } of PAGES) {
    const path = slug ? `/${locale}/${slug}` : `/${locale}`;

    test(`${path} renders h1 and parseable JSON-LD`, async ({ page }) => {
      await page.goto(path);

      // h1 — first h1 on the page must carry the locale-specific copy.
      // Catches missing i18n keys, wrong namespace wiring, and pages that
      // silently fall back to the default locale.
      await expect(page.locator('h1').first()).toContainText(h1[locale]);

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
}
