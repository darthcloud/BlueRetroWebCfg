import { test, expect } from '@playwright/test';
import { openApp, connect, tool, adapter, setAdapter, connectionLog, waitForToolReady, latestRelease } from '../helpers.js';

const status = page => page.locator('#appConnectionText');

test('connecting shows the adapter details', async ({page}) => {
    await openApp(page);
    await connect(page);

    await expect(page.locator('#appFirmwareVersion')).toHaveText('v25.10');
    await expect(page.locator('#appHardwareVersion')).toHaveText('hw1');
    await expect(page.locator('#appPlatform')).toHaveText('universal');
    await expect(page.locator('#appDeviceAddress')).toHaveText('11:22:33:44:55:66');
    await expect(page.locator('#appLatestFirmware')).toContainText(latestRelease);
    await expect(page.locator('#appConnectionPanel')).toHaveClass(/connection-collapsed/);

    const state = await adapter(page);
    expect(state.requestDeviceCalls).toHaveLength(1);
    expect(state.requestDeviceCalls[0].filters).toEqual([{namePrefix: 'BlueRetro'}]);
    expect(state.requestDeviceCalls[0].optionalServices).toEqual(['56830f56-5180-fab0-314b-2fa176799a00']);
    expect(await connectionLog(page)).toContain('Connected to BlueRetro_Test.');
});

test('connection buttons are hidden while connecting', async ({page}) => {
    await openApp(page, '', {connectDelay: 1500});
    await page.locator('#appBtConn').click();
    await expect(status(page)).toHaveText(/Connecting to BlueRetro_Test/);
    await expect(page.locator('#appConnectionButtons')).toBeHidden();
    await expect(status(page)).toHaveText(/^Connected to/);
    await page.locator('#appConnectionCollapsed').click();
    await expect(page.locator('#appBtConn')).toBeVisible();
    await expect(page.locator('#appBtConn')).toHaveText('Change adapter');
});

test('closing the device chooser leaves the app disconnected', async ({page}) => {
    await openApp(page, '', {chooserCancels: true});
    await page.locator('#appBtConn').click();
    await expect(status(page)).toHaveText('No adapter selected.');
    await expect(page.locator('#appBtConn')).toBeVisible();
    expect(await connectionLog(page)).toContain('Device selection or connection did not complete.');
});

test('a failed connection reports the error', async ({page}) => {
    await openApp(page, '', {failNextConnects: 1});
    await page.locator('#appBtConn').click();
    await expect(status(page)).toHaveText(/^Connection failed/);
    expect(await connectionLog(page)).toContain('Connection attempt failed.');
    await page.locator('#appBtConn').click();
    await expect(status(page)).toHaveText(/^Connected to/);
});

test('Disconnect & forget removes the adapter after confirmation', async ({page}) => {
    await openApp(page);
    await connect(page);
    await page.locator('#appConnectionCollapsed').click();

    page.once('dialog', dialog => dialog.dismiss());
    await page.locator('#appBtForget').click();
    expect((await adapter(page)).forgetCalls).toBe(0);
    await expect(status(page)).toHaveText(/^Connected to/);

    page.once('dialog', dialog => dialog.accept());
    await page.locator('#appBtForget').click();
    await expect(status(page)).toHaveText('Disconnected and forgotten by this site.');
    expect((await adapter(page)).forgetCalls).toBe(1);
    await expect(page.locator('#appAdapterDetails')).toBeHidden();
    await expect(page.locator('#appBtForget')).toBeHidden();
    await expect(page.locator('#appBtConn')).toHaveText('Connect to BlueRetro');
});

test('with auto-reconnect off, a dropped connection waits for the user', async ({page}) => {
    await openApp(page, 'controller-setup');
    await connect(page);
    await waitForToolReady(page);

    await page.evaluate(() => window.__fakeBR.dropConnection());
    await expect(status(page)).toHaveText('Disconnected. Auto-reconnect is off.');
    await expect(page.locator('#appBtConn')).toHaveText('Reconnect');
    await expect(tool(page).locator('html')).toHaveClass(/adapter-unavailable/);
    expect(await connectionLog(page)).toContain('Automatic reconnect stopped because it is turned off.');

    await page.locator('#appBtConn').click();
    await expect(status(page)).toHaveText(/^Connected to/);
    await waitForToolReady(page);
    expect((await adapter(page)).requestDeviceCalls).toHaveLength(1);
});

test('with auto-reconnect on, a dropped connection is retried until it succeeds', async ({page}) => {
    await openApp(page);
    await page.locator('label[for="appAutoReconnect"]').click();
    await expect(page.locator('#appAutoReconnect')).toBeChecked();
    await connect(page);

    await setAdapter(page, {failNextConnects: 1});
    await page.evaluate(() => window.__fakeBR.dropConnection());
    await expect(status(page)).toHaveText(/Connection lost. Reconnecting in/);
    await expect(status(page)).toHaveText(/^Connected to/, {timeout: 20_000});

    const log = await connectionLog(page);
    expect(log).toContain('Bluetooth connection closed.');
    expect(log).toContain('Retry 1 failed.');
    expect(log).toContain('Reconnect attempt started');
});

test('auto-reconnect preference survives a reload; the reload restore is gone', async ({page}) => {
    await openApp(page);
    await page.evaluate(() => {
        localStorage.setItem('blueRetroDeviceId', 'old-device');
        localStorage.setItem('blueRetroDeviceName', 'BlueRetro_Old');
    });
    await page.locator('label[for="appAutoReconnect"]').click();
    await page.reload();

    await expect(page.locator('#appAutoReconnect')).toBeChecked();
    await expect(status(page)).toHaveText('Not connected');
    const log = await connectionLog(page);
    expect(log).toContain('Automatic reconnect is on.');
    expect(log).not.toContain('recovering authorized Bluetooth devices');
    expect(await page.evaluate(() => localStorage.getItem('blueRetroDeviceId'))).toBeNull();
    expect(await page.evaluate(() => localStorage.getItem('blueRetroDeviceName'))).toBeNull();
});

test('connection log drawer opens, clears and closes with Escape', async ({page}) => {
    await openApp(page);
    await page.locator('#appLogToggle').click();
    await expect(page.locator('#appLogPanel')).toBeVisible();
    await expect(page.locator('#appConnectionLog')).toContainText('Page loaded.');

    await page.locator('#appLogClear').click();
    await expect(page.locator('#appConnectionLog')).toHaveText(/^\[.*\] Log cleared\.\n$/);

    await page.keyboard.press('Escape');
    await expect(page.locator('#appLogPanel')).toBeHidden();
});

test('tool log messages are forwarded to the main log', async ({page}) => {
    await openApp(page, 'controller-setup');
    await connect(page);
    await waitForToolReady(page);
    await expect.poll(() => connectionLog(page)).toContain('Tool: ');
});
