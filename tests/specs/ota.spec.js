import { test, expect } from '@playwright/test';
import { openApp, connect, tool, adapter, connectionLog, waitForToolReady } from '../helpers.js';

const OTA_START = 0xA5;
const OTA_END = 0x5A;
const RESET = 0x38;

/* A fake firmware image: version string in the 256-byte header, then filler */
function firmware(version, size = 3000) {
    const data = Buffer.alloc(size);
    data.write(version, 0, 'utf8');
    for (let i = 256; i < size; i++) {
        data[i] = i % 251;
    }
    return {name: 'blueretro_' + version.split(' ')[0] + '.bin', mimeType: 'application/octet-stream', buffer: data};
}

async function openFirmware(page, adapterOptions = {}) {
    await openApp(page, 'firmware', adapterOptions);
    await connect(page);
    await waitForToolReady(page);
    return tool(page);
}

async function install(frame, file) {
    await frame.locator('#fwFile').setInputFiles(file);
    await frame.locator('#btnFwUpdate').click();
}

test('a verified update disconnects and forgets the adapter', async ({page}) => {
    const frame = await openFirmware(page);
    const file = firmware('v99.0 hw1 universal');
    await install(frame, file);

    await expect(frame.locator('#divFwResult h2')).toHaveText('Firmware update verified', {timeout: 30_000});
    await expect(frame.locator('#divFwResult')).toContainText('v99.0 hw1 universal');
    await expect(page.locator('#appConnectionText')).toHaveText('Firmware v99.0 hw1 universal verified. Adapter disconnected and forgotten.', {timeout: 15_000});

    const state = await adapter(page);
    expect(state.otaBytes).toBe(file.buffer.length);
    expect(state.otaChunks.every(chunk => chunk.length <= 244)).toBe(true);
    expect(state.commands).toContain(OTA_START);
    expect(state.commands).toContain(OTA_END);
    expect(state.forgetCalls).toBe(1);
    expect(state.globalCfg[3]).toBe(0);
    const log = await connectionLog(page);
    expect(log).toContain('Firmware verification reconnect armed.');
    expect(log).toContain('Firmware transfer completed; waiting for adapter restart.');
});

test('a version mismatch after restart keeps the connection open', async ({page}) => {
    const frame = await openFirmware(page, {keepVersionAfterOta: true});
    await install(frame, firmware('v99.0 hw1 universal'));

    await expect(frame.locator('#divFwResult h2')).toHaveText('Firmware update not verified', {timeout: 30_000});
    await expect(page.locator('#appConnectionText')).toHaveText(/^Firmware verification failed. Running version: v25.10 hw1 universal/);
    const state = await adapter(page);
    expect(state.forgetCalls).toBe(0);
    expect(state.connected).toBe(true);
});

test('firmware for the wrong hardware is not sent', async ({page}) => {
    const frame = await openFirmware(page);
    await install(frame, firmware('v99.0 hw2 universal'));
    await expect.poll(() => connectionLog(page)).toContain('Hardware and firmware mismatch!');
    expect((await adapter(page)).commands).not.toContain(OTA_START);
});

test('only .bin files are accepted', async ({page}) => {
    const frame = await openFirmware(page);
    const file = firmware('v99.0 hw1 universal');
    await install(frame, {...file, name: 'firmware.zip'});
    await expect.poll(() => connectionLog(page)).toContain('Invalid file format.');
    expect((await adapter(page)).commands).not.toContain(OTA_START);
});

test.describe('Debug mode after updating', () => {
    test('the toggle is remembered', async ({page}) => {
        const frame = await openFirmware(page);
        await frame.locator('label[for="otaDebugMode"]').click();
        await page.reload();
        await expect(tool(page).locator('#otaDebugMode')).toBeChecked();
    });

    test('sets Debug mode, restarts and confirms, keeping the adapter connected', async ({page}) => {
        const frame = await openFirmware(page, {globalCfg: [6, 1, 0, 1]});
        await frame.locator('#otaDebugMode').check();
        await install(frame, firmware('v99.0 hw1 universal'));

        await expect(frame.locator('#divFwResult h2')).toHaveText('Firmware verified, Debug mode on', {timeout: 40_000});
        await expect(page.locator('#appConnectionText')).toHaveText('Firmware v99.0 hw1 universal running with Debug mode on. Adapter kept connected for testing.');

        const state = await adapter(page);
        expect(state.globalCfg).toEqual([6, 1, 0, 0xDB]);
        expect(state.commands).toContain(RESET);
        expect(state.restarts).toBe(2);
        expect(state.forgetCalls).toBe(0);
        expect(state.connected).toBe(true);
        const log = await connectionLog(page);
        expect(log).toContain('Memory card bank set to Debug mode (0xDB).');
        expect(log).toContain('Global config after restart: 6, 1, 0, 219.');
    });

    test('older config API versions are reported, not changed', async ({page}) => {
        const frame = await openFirmware(page, {apiVersion: 1});
        await frame.locator('#otaDebugMode').check();
        await install(frame, firmware('v99.0 hw1 universal'));

        await expect(frame.locator('#divFwResult h2')).toHaveText('Firmware verified, Debug mode not confirmed', {timeout: 30_000});
        await expect(frame.locator('#divFwResult')).toContainText('Debug mode needs config API version 2 or later');
        const state = await adapter(page);
        expect(state.restarts).toBe(1);
        expect(state.connected).toBe(true);
    });

    test('an adapter that ignores the restart is reported', async ({page}) => {
        test.slow();
        const frame = await openFirmware(page, {ignoreReset: true});
        await frame.locator('#otaDebugMode').check();
        await install(frame, firmware('v99.0 hw1 universal'));

        await expect(frame.locator('#divFwResult')).toContainText('the adapter did not restart', {timeout: 45_000});
        expect((await adapter(page)).globalCfg[3]).toBe(0xDB);
    });
});
