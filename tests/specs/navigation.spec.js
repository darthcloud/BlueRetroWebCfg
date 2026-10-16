import { test, expect } from '@playwright/test';
import { openApp, tool } from '../helpers.js';

const routes = [
    {route: 'presets', page: 'presets.html', text: 'Apply a ready-made button layout'},
    {route: 'controller-setup', page: 'advance.html', text: 'Adjust console behavior'},
    {route: 'firmware', page: 'ota.html', text: 'Select firmware'},
    {route: 'system', page: 'system.html', text: 'Restart, power down, or restore'},
    {route: 'n64-saves', page: 'n64_ctrlpak.html', text: 'virtual N64 Controller Pak'},
    {route: 'dreamcast-saves', page: 'dc_vmu.html', text: 'virtual Dreamcast VMU'},
    {route: 'files', page: 'files.html', text: 'game-specific configuration files'},
    {route: 'debug', page: 'debug.html', text: 'Download a trace file'},
];

test('home page lists the tools and marks Home as current', async ({page}) => {
    await openApp(page);
    await expect(page.locator('#homeContent')).toBeVisible();
    await expect(page.locator('#toolFrame')).toBeHidden();
    await expect(page.locator('.task-card')).toHaveCount(8);
    await expect(page.locator('.site-nav a[aria-current="page"]')).toHaveText('Home');
});

for (const {route, page: file, text} of routes) {
    test('#' + route + ' loads ' + file + ' inside the app', async ({page}) => {
        await openApp(page, route);
        await expect(page.locator('#homeContent')).toBeHidden();
        await expect(tool(page).locator('body')).toContainText(text);
        expect(page.frame({url: new RegExp(file.replace('.', '\\.') + '\\?embedded=1')})).not.toBeNull();
        await expect(tool(page).locator('.site-nav')).toBeHidden();
    });

    test('direct URL ' + file + ' redirects to #' + route, async ({page}) => {
        await page.goto(file);
        await expect(page).toHaveURL(new RegExp('index\\.html#' + route + '$'));
        await expect(tool(page).locator('body')).toContainText(text);
    });
}

test('top navigation marks the current section', async ({page}) => {
    await openApp(page);
    await page.locator('.site-nav a', {hasText: 'Controller setup'}).click();
    await expect(page).toHaveURL(/#controller-setup$/);
    await expect(page.locator('.site-nav a[aria-current="page"]')).toHaveText('Controller setup');
    await page.locator('.site-nav a', {hasText: 'Firmware update'}).click();
    await expect(page.locator('.site-nav a[aria-current="page"]')).toHaveText('Firmware update');
});

test('browser Back and Forward move between sections', async ({page}) => {
    await openApp(page);
    await page.locator('.site-nav a', {hasText: 'Presets'}).click();
    await expect(tool(page).locator('body')).toContainText('Apply a ready-made button layout');
    await page.locator('.site-nav a', {hasText: 'Controller setup'}).click();
    await expect(tool(page).locator('body')).toContainText('Adjust console behavior');

    await page.goBack();
    await expect(page).toHaveURL(/#presets$/);
    await expect(tool(page).locator('body')).toContainText('Apply a ready-made button layout');

    await page.goBack();
    await expect(page.locator('#homeContent')).toBeVisible();

    await page.goForward();
    await expect(page).toHaveURL(/#presets$/);
    await expect(page.locator('#toolFrame')).toBeVisible();
});

test('Home link returns from a tool to the home page', async ({page}) => {
    await openApp(page, 'firmware');
    await page.locator('.site-nav a', {hasText: 'Home'}).click();
    await expect(page.locator('#homeContent')).toBeVisible();
    await expect(page.locator('#toolFrame')).toBeHidden();
});

test('tool page sources are not published under /pages/', async ({request}) => {
    expect((await request.get('pages/advance.html')).status()).toBe(404);
    expect((await request.get('advance.html')).status()).toBe(200);
});

test('unknown routes fall back to the home page', async ({page}) => {
    await openApp(page, 'not-a-tool');
    await expect(page.locator('#homeContent')).toBeVisible();
});
