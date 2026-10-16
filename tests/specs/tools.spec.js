import { test, expect } from '@playwright/test';
import { openApp, connect, tool, adapter, waitForToolReady, findKnownGame, mockGitHub } from '../helpers.js';

const DEL_FILE = 0x14;
const DEEP_SLEEP = 0x37;
const RESET = 0x38;
const FACTORY = 0x39;

test.describe('Files', () => {
    let game;
    test.beforeAll(async ({browser}) => {
        const page = await browser.newPage();
        await mockGitHub(page);
        await page.goto('index.html');
        game = await findKnownGame(page);
        await page.close();
    });

    async function openFiles(page) {
        await openApp(page, 'files', {files: ['UNKNOWN-1', game.id]});
        await connect(page);
        await waitForToolReady(page);
        return tool(page);
    }

    test('lists stored game files', async ({page}) => {
        const frame = await openFiles(page);
        const rows = frame.locator('.file-row');
        await expect(rows).toHaveCount(2);
        await expect(rows.nth(0)).toContainText('UNKNOWN-1');
        await expect(rows.nth(1)).toHaveAttribute('title', game.name);
    });

    test('deletes a file only after confirmation', async ({page}) => {
        const frame = await openFiles(page);
        const row = frame.locator('.file-row', {hasText: 'UNKNOWN-1'});

        page.once('dialog', dialog => dialog.dismiss());
        await row.getByRole('button', {name: 'Delete'}).click();
        await expect(row).toBeVisible();
        expect((await adapter(page)).files).toContain('UNKNOWN-1');

        page.once('dialog', dialog => dialog.accept());
        await row.getByRole('button', {name: 'Delete'}).click();
        await expect(row).toHaveCount(0);
        await expect.poll(async () => (await adapter(page)).files).toEqual([game.id]);
        const write = (await adapter(page)).writes.filter(entry => entry.chrc === 7 && entry.bytes[0] === DEL_FILE).at(-1);
        expect(Buffer.from(write.bytes.slice(1)).toString()).toBe('UNKNOWN-1');
    });
});

test.describe('System', () => {
    async function openSystem(page) {
        await openApp(page, 'system');
        await connect(page);
        await waitForToolReady(page);
        return tool(page);
    }

    test('Restart sends the restart command and clears a pending restart prompt', async ({page}) => {
        const frame = await openSystem(page);
        await page.evaluate(() => window.postMessage({type: 'blueretro-restart-required', reason: 'Adapter settings'}, location.origin));
        await expect(page.locator('#appRestartBar')).toBeVisible();

        await frame.locator('#btnReset').click();
        await expect(page.locator('#appRestartBar')).toBeHidden();
        await expect.poll(async () => (await adapter(page)).commands).toContain(RESET);
    });

    test('Factory reset and deep sleep require confirmation', async ({page}) => {
        const frame = await openSystem(page);

        page.once('dialog', dialog => dialog.dismiss());
        await frame.locator('#btnFactory').click();
        page.once('dialog', dialog => dialog.dismiss());
        await frame.locator('#btnSleep').click();
        let state = await adapter(page);
        expect(state.commands).not.toContain(FACTORY);
        expect(state.commands).not.toContain(DEEP_SLEEP);

        page.once('dialog', dialog => dialog.accept());
        await frame.locator('#btnSleep').click();
        await expect.poll(async () => (await adapter(page)).commands).toContain(DEEP_SLEEP);
    });

    test('Factory reset is sent after confirmation', async ({page}) => {
        const frame = await openSystem(page);
        page.once('dialog', dialog => dialog.accept());
        await frame.locator('#btnFactory').click();
        await expect.poll(async () => (await adapter(page)).commands).toContain(FACTORY);
    });
});
