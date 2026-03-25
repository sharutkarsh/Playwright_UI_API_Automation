// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 90000,
  retries: 1,
  workers: 1,
  reporter: [
    ['html', { outputFolder: 'reports/html', open: 'never' }],
    ['junit', { outputFile: 'reports/junit/results.xml' }],
    ['allure-playwright', { resultsDir: 'reports/allure-results' }],
  ],
  use: {
    baseURL: 'https://demoqa.com',
    headless: true,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },
  projects: [
    // API tests — run once on chromium only, no browser needed
    {
      name: 'api',
      testMatch: '**/api.spec.js',
      use: { ...devices['Desktop Chrome'] },
    },
    // UI tests — run on all 4 browsers
    {
      name: 'chromium',
      testMatch: '**/ui.spec.js',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      testMatch: '**/ui.spec.js',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      testMatch: '**/ui.spec.js',
      use: { ...devices['Desktop WebKit'] },
    },
    {
      name: 'edge',
      testMatch: '**/ui.spec.js',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
