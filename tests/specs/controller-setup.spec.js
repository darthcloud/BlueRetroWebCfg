import { test, expect } from '@playwright/test';
import { openApp, connect, tool, adapter, writesTo, connectionLog, waitForToolReady, findKnownGame, mockGitHub } from '../helpers.js';

const RESET = 0x38;
const SET_GAMEID_CFG = 0x11;

async function openSetup(page, adapterOptions = {}) {
    await openApp(page, 'controller-setup', adapterOptions);
    await connect(page);
    await waitForToolReady(page);
    return tool(page);
}

async function openTab(frame, name) {
    await frame.getByRole('tab', {name}).click();
    await expect(frame.getByRole('tab', {name})).toHaveAttribute('aria-selected', 'true');
}

test('options are visible but disabled before connecting', async ({page}) => {
    await openApp(page, 'controller-setup');
    const frame = tool(page);
    await expect(frame.locator('html')).toHaveClass(/adapter-unavailable/);
    await expect(frame.locator('.tool-unavailable')).toContainText('Adapter connection required.');
    await expect(frame.locator('#divCfgSel')).toHaveAttribute('aria-disabled', 'true');
});

test('tabs switch between the four sections', async ({page}) => {
    const frame = await openSetup(page);
    const panels = {Profile: '#divCfgSel', Adapter: '#divGlobalCfg', 'Console ports': '#divOutputCfg', 'Button mapping': '#divInputCfg'};
    for (const [name, selected] of Object.entries(panels)) {
        await openTab(frame, name);
        for (const [, panel] of Object.entries(panels)) {
            if (panel === selected) {
                await expect(frame.locator(panel)).toBeVisible();
            }
            else {
                await expect(frame.locator(panel)).toBeHidden();
            }
        }
    }
});

test.describe('Adapter tab', () => {
    test('shows the saved adapter settings with plain names', async ({page}) => {
        const frame = await openSetup(page, {globalCfg: [6, 1, 1, 2]});
        await openTab(frame, 'Adapter');
        await expect(frame.locator('#systemCfg')).toHaveValue('6');
        await expect(frame.locator('#systemCfg option:checked')).toHaveText('SNES / Super Famicom');
        await expect(frame.locator('#multitapCfg option:checked')).toHaveText('On port 1');
        await expect(frame.locator('#inquiryMode option:checked')).toHaveText('Only when started manually');
        await expect(frame.locator('#banksel option:checked')).toHaveText('Bank 3');
        await expect(frame.locator('#systemCfg option').first()).toHaveText('Auto-detect');
    });

    test('older firmware hides settings it does not support', async ({page}) => {
        const frame = await openSetup(page, {apiVersion: 0});
        await openTab(frame, 'Adapter');
        await expect(frame.locator('#systemCfg')).toBeVisible();
        await expect(frame.locator('#inquiryMode')).toHaveCount(0);
        await expect(frame.locator('#banksel')).toHaveCount(0);
    });

    test('saving writes the settings and offers a restart', async ({page}) => {
        const frame = await openSetup(page);
        await openTab(frame, 'Adapter');
        await frame.locator('#systemCfg').selectOption({label: 'Nintendo 64'});
        await frame.locator('#banksel').selectOption({label: 'Debug mode'});
        await frame.locator('#globalSave').click();

        await expect(frame.locator('#globalSaveText')).toBeVisible();
        expect(writesTo(await adapter(page), 1).at(-1)).toEqual([15, 0, 0, 0xDB]);
        await expect(page.locator('#appRestartBar')).toBeVisible();
        await expect(page.locator('#appRestartText')).toHaveText('Restart the adapter to apply your Adapter settings changes.');
    });
});

test.describe('restart bar', () => {
    test('Restart adapter restarts, reconnects and reloads the tool', async ({page}) => {
        const frame = await openSetup(page);
        await openTab(frame, 'Adapter');
        await frame.locator('#systemCfg').selectOption({label: 'GameCube'});
        await frame.locator('#globalSave').click();

        await page.locator('#appRestartNow').click();
        await expect(page.locator('#appConnectionText')).toHaveText(/Adapter restarting. Reconnecting in/);
        await expect(page.locator('#appConnectionText')).toHaveText(/^Connected to/, {timeout: 20_000});
        await expect(page.locator('#appRestartBar')).toBeHidden();

        const state = await adapter(page);
        expect(state.commands).toContain(RESET);
        expect(state.restarts).toBe(1);
        expect(await connectionLog(page)).toContain('Adapter restarted; saved changes are now applied.');

        await waitForToolReady(page);
        await expect(frame.locator('#systemCfg option:checked')).toHaveText('GameCube');
        await expect(frame.locator('#globalSaveText')).toBeHidden();
    });

    test('restart reconnects even when auto-reconnect is off', async ({page}) => {
        await openSetup(page);
        await expect(page.locator('#appAutoReconnect')).not.toBeChecked();
        await page.evaluate(() => window.postMessage({type: 'blueretro-restart-required', reason: 'Adapter settings'}, location.origin));
        await page.locator('#appRestartNow').click();
        await expect(page.locator('#appConnectionText')).toHaveText(/^Connected to/, {timeout: 20_000});
        await expect(page.locator('#appRestartBar')).toBeHidden();
    });

    test('Later hides the bar and the next save lists every pending change', async ({page}) => {
        const frame = await openSetup(page);
        await openTab(frame, 'Adapter');
        await frame.locator('#globalSave').click();
        await page.locator('#appRestartLater').click();
        await expect(page.locator('#appRestartBar')).toBeHidden();

        await openTab(frame, 'Console ports');
        await frame.locator('#outputSave').click();
        await expect(page.locator('#appRestartText')).toHaveText('Restart the adapter to apply your Adapter settings and Console ports changes.');
    });

    test('reports when the adapter does not restart', async ({page}) => {
        test.slow();
        await openSetup(page, {ignoreReset: true});
        await page.evaluate(() => window.postMessage({type: 'blueretro-restart-required', reason: 'Adapter settings'}, location.origin));
        await page.locator('#appRestartNow').click();
        await expect(page.locator('#appRestartNow')).toBeDisabled();
        await expect(page.locator('#appRestartText')).toHaveText('The adapter did not restart. Try again, or turn it off and on.', {timeout: 25_000});
        await expect(page.locator('#appRestartNow')).toBeEnabled();
        await expect(page.locator('#appConnectionText')).toHaveText(/^Connected to/);
    });

    test('Disconnect & forget clears the bar', async ({page}) => {
        await openSetup(page);
        await page.evaluate(() => window.postMessage({type: 'blueretro-restart-required', reason: 'Console ports'}, location.origin));
        await expect(page.locator('#appRestartBar')).toBeVisible();
        await page.locator('#appConnectionCollapsed').click();
        page.once('dialog', dialog => dialog.accept());
        await page.locator('#appBtForget').click();
        await expect(page.locator('#appRestartBar')).toBeHidden();
    });
});

test.describe('Console ports tab', () => {
    test('loads and saves each player port', async ({page}) => {
        const outputs = [];
        outputs[1] = [1, 2];
        const frame = await openSetup(page, {outputs});
        await openTab(frame, 'Console ports');

        await expect(frame.locator('#outputMode option:checked')).toHaveText('Controller');
        await frame.locator('#outputSelect').selectOption({label: 'Player 2'});
        await expect(frame.locator('#outputMode option:checked')).toHaveText('Controller (alternate)');
        await expect(frame.locator('#outputAcc option:checked')).toHaveText('Rumble');

        await frame.locator('#outputMode').selectOption({label: 'Keyboard'});
        await frame.locator('#outputAcc').selectOption({label: 'Memory card + rumble'});
        await frame.locator('#outputSave').click();
        await expect(frame.locator('#outputSaveText')).toBeVisible();

        const state = await adapter(page);
        expect(writesTo(state, 2).at(-1)).toEqual([1, 0]);
        expect(writesTo(state, 3).at(-1)).toEqual([2, 3]);
        expect(state.outputs[1]).toEqual([2, 3]);
        await expect(frame.locator('#outputSaveMouse')).toBeHidden();
        await expect(page.locator('#appRestartText')).toContainText('Console ports');
    });

    test('mouse mode points to the Default Mouse preset', async ({page}) => {
        const frame = await openSetup(page);
        await openTab(frame, 'Console ports');
        await frame.locator('#outputMode').selectOption({label: 'Mouse'});
        await frame.locator('#outputSave').click();
        await expect(frame.locator('#outputSaveMouse')).toBeVisible();
        await expect(frame.locator('#outputSaveMouse a')).toHaveAttribute('href', 'index.html#presets');
    });
});

test.describe('Button mapping tab', () => {
    test('loads the saved mappings with readable names', async ({page}) => {
        const frame = await openSetup(page);
        await openTab(frame, 'Button mapping');
        const rows = frame.locator('#divMapping .mapping-row');
        await expect(rows).toHaveCount(2);

        await expect(rows.nth(0).locator('label').first()).toHaveText('When I press');
        await expect(rows.nth(0).locator('.src option:checked')).toHaveText('Left stick left (key A)');
        await expect(rows.nth(1).locator('.src option:checked')).toHaveText('Bottom face button (key E, mouse 6)');
        await expect(rows.nth(1).locator('.dest option:checked')).toHaveText('Right face button (key R, mouse 5)');
        await expect(rows.nth(1).locator('.destId option:checked')).toHaveText('Player 2');
        await expect(rows.nth(1).locator('.turbo option:checked')).toHaveText('1/2 frames');
        await expect(rows.nth(1).locator('.scaling')).toHaveValue('0');
        await expect(rows.nth(1).locator('.diag')).toHaveValue('1');
    });

    test('fine-tuning options are hidden until requested', async ({page}) => {
        const frame = await openSetup(page);
        await openTab(frame, 'Button mapping');
        const turbo = frame.locator('#divMapping .mapping-row').first().locator('.turbo');
        await expect(turbo).toBeHidden();
        await frame.locator('#advancedMappingToggle').click();
        await expect(turbo).toBeVisible();
        await expect(frame.locator('#advancedMappingToggle')).toHaveText('Hide fine-tuning');
    });

    test('adding a row and saving writes the full mapping table', async ({page}) => {
        const frame = await openSetup(page);
        await openTab(frame, 'Button mapping');
        await frame.getByRole('button', {name: '+ Add another button'}).click();

        const row = frame.locator('#divMapping .mapping-row').nth(2);
        await expect(row.locator('label').first()).toHaveText('When I press');
        await row.locator('.src').selectOption('19');
        await row.locator('.dest').selectOption('16');
        await row.locator('.destId').selectOption({label: 'Player 3'});
        await frame.locator('#inputSave').click();
        await expect(frame.locator('#inputSaveText')).toBeVisible();

        const state = await adapter(page);
        expect(state.inputs[0]).toEqual([0, 0, 3,
            0, 0, 0, 100, 50, 135, 0, 0,
            18, 17, 1, 100, 50, 135, 2, 0x10,
            19, 16, 2, 100, 50, 135, 0, 0]);
        await expect(page.locator('#appRestartBar')).toBeHidden();
    });

    test('removing a row and saving shrinks the table', async ({page}) => {
        const frame = await openSetup(page);
        await openTab(frame, 'Button mapping');
        await frame.getByRole('button', {name: '+ Add another button'}).click();
        await expect(frame.locator('#divMapping .mapping-row')).toHaveCount(3);
        await frame.locator('#divMapping .remove-mapping').last().click();
        await expect(frame.locator('#divMapping .mapping-row')).toHaveCount(2);
        await frame.locator('#inputSave').click();
        await expect(frame.locator('#inputSaveText')).toBeVisible();
        expect((await adapter(page)).inputs[0][2]).toBe(2);
    });

    test('switching controller loads that controller\'s mappings', async ({page}) => {
        const inputs = [];
        inputs[3] = [0, 0, 1, 8, 9, 0, 100, 50, 135, 0, 0];
        const frame = await openSetup(page, {inputs});
        await openTab(frame, 'Button mapping');
        await frame.locator('#inputSelect').selectOption({label: 'Controller 4'});
        const rows = frame.locator('#divMapping .mapping-row');
        await expect(rows).toHaveCount(1);
        await expect(rows.first().locator('.src option:checked')).toHaveText('D-pad left (left arrow)');
    });

    test('large mapping tables are read and written in 512-byte chunks', async ({page}) => {
        const count = 100;
        const table = [0, 0, count];
        for (let i = 0; i < count; i++) {
            table.push(i % 32, (i + 1) % 32, i % 4, 100, 50, 135, 0, 0);
        }
        const frame = await openSetup(page, {inputs: [table]});
        await openTab(frame, 'Button mapping');
        await expect(frame.locator('#divMapping .mapping-row')).toHaveCount(count);
        await frame.locator('#inputSave').click();
        await expect(frame.locator('#inputSaveText')).toBeVisible();

        const state = await adapter(page);
        expect(state.inputs[0]).toEqual(table);
        const offsets = writesTo(state, 4).slice(-2).map(bytes => bytes[2] | (bytes[3] << 8));
        expect(offsets).toEqual([0, 512]);
    });

    test('console button names follow the selected console', async ({page}) => {
        const frame = await openSetup(page, {globalCfg: [6, 0, 0, 0]});
        await openTab(frame, 'Button mapping');
        await expect(frame.locator('#dstLabel option:checked')).toHaveText('SNES');
        await expect(frame.locator('#divMapping .mapping-row').first().locator('.dest option[value="8"]')).toHaveText('D-pad left');
        await expect(frame.locator('#divMapping .mapping-row').first().locator('.dest option[value="0"]')).toHaveText('Left stick left (key A)');
        await expect(frame.locator('#srcLabel option:checked')).toHaveText('Default');
    });

    test('choosing controller names relabels the inputs without changing them', async ({page}) => {
        const frame = await openSetup(page);
        await openTab(frame, 'Button mapping');
        await frame.locator('#srcLabel').selectOption({label: 'Xbox One S / X|S'});
        const second = frame.locator('#divMapping .mapping-row').nth(1);
        await expect(second.locator('.src')).toHaveValue('18');
        await expect(second.locator('.src option:checked')).toHaveText('A');
    });
});

test.describe('Profile tab', () => {
    test('explains when no game is detected', async ({page}) => {
        const frame = await openSetup(page);
        await expect(frame.locator('#divCfgSel')).toContainText('Currently editing: Settings for all games');
        await expect(frame.locator('#divCfgSel')).toContainText('Separate settings are available when the adapter detects the game that is running.');
        await expect(frame.locator('#cfgSw')).toHaveCount(0);
    });

    let game;
    test.beforeAll(async ({browser}) => {
        const page = await browser.newPage();
        await mockGitHub(page);
        await page.goto('index.html');
        game = await findKnownGame(page);
        await page.close();
    });

    test('switches to settings for the running game', async ({page}) => {
        const frame = await openSetup(page, {gameId: game.id});

        await expect(frame.locator('#cfgSw')).toHaveText('Use separate settings for ' + game.name);
        await frame.locator('#cfgSw').click();
        await expect(frame.locator('#divCfgSel')).toContainText('Settings for ' + game.name + ' only');
        await expect(frame.locator('#cfgSw')).toHaveText('Go back to settings for all games');
        expect((await adapter(page)).commands).toContain(SET_GAMEID_CFG);

        await frame.locator('#cfgSw').click();
        await expect(frame.locator('#divCfgSel')).toContainText('Currently editing: Settings for all games');
    });
});
