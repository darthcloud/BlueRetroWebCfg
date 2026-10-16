import { defineConfig, devices } from '@playwright/test';

/* The site is served by Jekyll (docker compose service "webcfg") */
const baseURL = process.env.BASE_URL || 'http://localhost:4000/';

export default defineConfig({
    testDir: './specs',
    globalSetup: './global-setup.js',
    timeout: 60_000,
    expect: {timeout: 15_000},
    fullyParallel: true,
    workers: process.env.CI ? 2 : 4,
    retries: process.env.CI ? 1 : 0,
    reporter: [['list'], ['html', {open: 'never', outputFolder: 'playwright-report'}]],
    use: {
        baseURL: baseURL.endsWith('/') ? baseURL : baseURL + '/',
        serviceWorkers: 'block',
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
    },
    projects: [
        {name: 'chromium', use: {...devices['Desktop Chrome']}},
    ],
});
