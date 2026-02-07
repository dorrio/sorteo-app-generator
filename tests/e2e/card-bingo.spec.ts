import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test('Random Card Generator loads correctly', async ({ page }) => {
  await page.goto(`${BASE_URL}/es/random-card-generator`);
  await expect(page.locator('h1')).toContainText('Generador de Cartas Aleatorias');
  // Check for glossary term usage via text content
  await expect(page.locator('body')).toContainText('Generador de Cartas');
});

test('Bingo Number Generator loads correctly', async ({ page }) => {
  await page.goto(`${BASE_URL}/es/bingo-number-generator`);
  await expect(page.locator('h1')).toContainText('Generador de Números de Bingo');
  await expect(page.locator('body')).toContainText('Cantador de Bingo');
});
