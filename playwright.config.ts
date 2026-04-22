import { defineConfig, devices } from '@playwright/test';

const PORT = Number(process.env.PORT ?? 3000);
const BASE_URL = process.env.BASE_URL ?? `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: process.env.BASE_URL
    ? undefined
    : {
        // Production build: on-demand compilation in `next dev` thrashes
        // under heavy parallelism (69 pages across 3 locales) and times
        // out. `next start` serves statically compiled routes instantly.
        // Override via PLAYWRIGHT_WEBSERVER=dev to iterate against HMR.
        command:
          process.env.PLAYWRIGHT_WEBSERVER === 'dev'
            ? 'pnpm dev'
            : 'pnpm build && pnpm start',
        url: `http://localhost:${PORT}`,
        reuseExistingServer: !process.env.CI,
        timeout: 300_000,
      },
});
