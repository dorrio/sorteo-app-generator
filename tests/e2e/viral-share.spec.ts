import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test.describe('Viral Share Optimization', () => {

  test('Desktop: Share Button opens dropdown with all options', async ({ page }) => {
    // 1. Mock Environment (Desktop: Share API exists but Pointer is Fine)
    await page.addInitScript(() => {
      // Mock navigator.share
      Object.defineProperty(navigator, 'share', {
        value: async () => {},
        writable: true,
      });
      // Mock matchMedia for Desktop (fine pointer)
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: (query) => ({
          matches: false, // NOT coarse pointer
          media: query,
          onchange: null,
          addListener: () => {},
          removeListener: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => {},
        }),
      });
    });

    // 2. Navigate
    await page.goto(`${BASE_URL}/es/random-card-generator`);

    // 3. Locate Share Button in Header
    // Note: If translations fail or change, this selector might break.
    // The button usually has an icon. We can use a more robust selector if needed.
    // But title="Compartir..." or aria-label="Compartir..." is standard for our component.
    const shareButton = page.locator('header button[title="Share..."], header button[aria-label="Share..."], header button[title="Compartir..."], header button[aria-label="Compartir..."]').first();
    await expect(shareButton).toBeVisible();

    // 4. Click to open Dropdown
    await shareButton.click();

    // 5. Verify Dropdown Content
    const dropdown = page.locator('[role="menu"]');
    await expect(dropdown).toBeVisible();

    // Existing options
    await expect(dropdown.getByText(/Copy Link|Copiar enlace/i)).toBeVisible();
    await expect(dropdown.getByText(/Twitter/i)).toBeVisible();
    await expect(dropdown.getByText(/Facebook/i)).toBeVisible();
    await expect(dropdown.getByText(/WhatsApp/i)).toBeVisible();
    await expect(dropdown.getByText(/Instagram/i)).toBeVisible();

    // NEW options
    await expect(dropdown.getByText(/Telegram/i)).toBeVisible();
    await expect(dropdown.getByText(/LinkedIn/i)).toBeVisible();
  });

  test('Mobile: Share Button triggers native share', async ({ page }) => {
    // 1. Mock Environment (Mobile: Share API exists AND Pointer is Coarse)
    await page.addInitScript(() => {
      (window as any)._shareCalled = false;
      (window as any)._shareData = null;

      Object.defineProperty(navigator, 'share', {
        value: async (data) => {
          (window as any)._shareData = data;
          (window as any)._shareCalled = true;
        },
        writable: true,
      });

      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: (query) => ({
          matches: query === '(pointer: coarse)', // Mobile
          media: query,
          onchange: null,
          addListener: () => {},
          removeListener: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => {},
        }),
      });
    });

    // 2. Navigate
    await page.goto(`${BASE_URL}/es/random-card-generator`);

    // 3. Locate Share Button and wait for it to be ready for native share
    const shareButton = page.locator('header button[title="Share..."], header button[aria-label="Share..."], header button[title="Compartir..."], header button[aria-label="Compartir..."]').first();
    await expect(shareButton).toBeVisible();

    // Wait for the button to indicate it's ready for native share (after hydration)
    await expect(shareButton).toHaveAttribute('data-share-native', 'true');

    // 4. Click
    await shareButton.click();

    // Debug: Check if Dropdown opened (which implies Native Share Failed/Not Active)
    const dropdown = page.locator('[role="menu"]');
    if (await dropdown.isVisible()) {
        console.log('DEBUG: Dropdown opened instead of Native Share');
    }

    // 5. Verify Native Share Called
    // We need to wait a bit or just assert
    await page.waitForTimeout(500); // Give React effect time to run if needed, though click is sync
    const wasCalled = await page.evaluate(() => (window as any)._shareCalled);
    expect(wasCalled).toBe(true);

    const shareData: any = await page.evaluate(() => (window as any)._shareData);
    expect(shareData.url).toContain('random-card-generator');
  });

  test('Copy Link copies only URL', async ({ page }) => {
    // 1. Mock Clipboard & Force Dropdown
    await page.addInitScript(() => {
      (window as any)._clipboardText = '';

      // Mock Clipboard API
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: async (text) => {
            (window as any)._clipboardText = text;
          }
        },
        writable: true,
      });

      // Mock Share API to undefined (force dropdown)
      Object.defineProperty(navigator, 'share', { value: undefined, writable: true });
    });

    // 2. Navigate
    await page.goto(`${BASE_URL}/es/random-card-generator`);

    // 3. Open Dropdown
    const shareButton = page.locator('header button[title="Share..."], header button[aria-label="Share..."], header button[title="Compartir..."], header button[aria-label="Compartir..."]').first();
    await shareButton.click();

    // 4. Click Copy Link
    const copyButton = page.locator('[role="menuitem"]').filter({ hasText: /Copy Link|Copiar enlace/i });
    await copyButton.click();

    // 5. Verify Content
    const text = await page.evaluate(() => (window as any)._clipboardText);

    // Should be a URL
    expect(text).toMatch(/^https?:\/\//);
    // Should NOT contain descriptive text (e.g. "Check this out")
    expect(text).not.toContain('Generador'); // Title part
    expect(text).not.toContain('Check out');
  });

});
