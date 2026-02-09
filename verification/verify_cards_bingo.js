// @ts-check
const { chromium } = require('playwright');

(async () => {
  /** @type {import('playwright').Browser | null} */
  let browser = null;
  /** @type {import('playwright').Page | null} */
  let page = null;

  try {
    browser = await chromium.launch();
    page = await browser.newPage();
    const baseUrl = 'http://localhost:3000';

    console.log('Navigating to Card Generator...');
    await page.goto(`${baseUrl}/es/random-card-generator`);
    // Wait for the h1 to ensure content is loaded
    await page.waitForSelector('h1');
    await page.screenshot({ path: 'verification/card_gen.png', fullPage: true });
    console.log('Card Generator screenshot taken.');

    console.log('Navigating to Bingo Generator...');
    await page.goto(`${baseUrl}/es/bingo-number-generator`);
    await page.waitForSelector('h1');
    await page.screenshot({ path: 'verification/bingo_gen.png', fullPage: true });
    console.log('Bingo Generator screenshot taken.');
  } catch (error) {
    console.error('An error occurred:', error);
    process.exitCode = 1;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
})();
