import { test, expect } from '@playwright/test';
import { openApp, connect, tool, waitForToolReady } from '../helpers.js';

/* Nothing should scroll sideways at phone width */
async function expectNoHorizontalOverflow(page) {
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, 'main page horizontal overflow').toBeLessThanOrEqual(0);
    const frame = page.frame({url: /embedded=1/});
    if (frame && await page.locator('#toolFrame').isVisible()) {
        const toolOverflow = await frame.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        expect(toolOverflow, 'tool horizontal overflow').toBeLessThanOrEqual(0);
    }
}

test.use({viewport: {width: 390, height: 844}, isMobile: true, hasTouch: true});

for (const route of ['', 'presets', 'controller-setup', 'firmware', 'system', 'files']) {
    test('#' + (route || 'home') + ' fits a phone screen', async ({page}) => {
        await openApp(page, route);
        if (route) {
            await expect(tool(page).locator('body')).not.toBeEmpty();
        }
        await expectNoHorizontalOverflow(page);
    });
}

test('connected Controller Setup fits a phone screen on every tab', async ({page}) => {
    await openApp(page, 'controller-setup');
    await connect(page);
    await waitForToolReady(page);
    const frame = tool(page);
    for (const name of ['Profile', 'Adapter', 'Console ports', 'Button mapping']) {
        await frame.getByRole('tab', {name}).click();
        await expectNoHorizontalOverflow(page);
    }
    await frame.locator('#advancedMappingToggle').click();
    await expectNoHorizontalOverflow(page);
});

test('restart bar fits a phone screen', async ({page}) => {
    await openApp(page);
    await page.evaluate(() => window.postMessage({type: 'blueretro-restart-required', reason: 'Adapter settings'}, location.origin));
    await expect(page.locator('#appRestartBar')).toBeVisible();
    const box = await page.locator('#appRestartBar').boundingBox();
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(390);
    await expectNoHorizontalOverflow(page);
});
