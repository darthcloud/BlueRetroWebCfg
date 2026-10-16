import { test, expect } from '@playwright/test';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { openApp, connect, tool, adapter, waitForToolReady, repoRoot } from '../helpers.js';

const presets = readdirSync(path.join(repoRoot, 'map'))
    .filter(name => name.endsWith('.json'))
    .sort()
    .map(name => JSON.parse(readFileSync(path.join(repoRoot, 'map', name), 'utf8')));

async function openPresets(page) {
    await openApp(page, 'presets');
    await connect(page);
    await waitForToolReady(page);
    const frame = tool(page);
    await expect(frame.locator('#presetsName option')).toHaveCount(presets.length + 1);
    return frame;
}

test('lists every preset and filters by console', async ({page}) => {
    const frame = await openPresets(page);
    const consoles = [...new Set(presets.map(preset => preset.console))];
    await expect(frame.locator('#consoleName option')).toHaveCount(consoles.length + 1);

    const n64 = presets.filter(preset => preset.console === 'N64');
    await frame.locator('#consoleName').selectOption({label: 'N64'});
    await expect(frame.locator('#presetsName option')).toHaveCount(n64.length + 1);
});

test('selecting a preset shows its description', async ({page}) => {
    const frame = await openPresets(page);
    const index = presets.findIndex(preset => preset.name === 'Default Gamepad only');
    await frame.locator('#presetsName').selectOption(String(index));
    await expect(frame.locator('#desc')).toHaveText(presets[index].desc);
});

test('applying without a layout asks for one', async ({page}) => {
    const frame = await openPresets(page);
    await frame.locator('#inputSave').click();
    await expect(frame.locator('#desc')).toHaveText('Choose a button layout before applying the preset.');
    expect((await adapter(page)).writes.filter(write => write.chrc === 5)).toHaveLength(0);
});

test('applying a preset writes its mapping table to the chosen controller', async ({page}) => {
    const frame = await openPresets(page);
    const index = presets.findIndex(preset => preset.name === 'Default Gamepad only');
    await frame.locator('#inputSelect').selectOption({label: 'Controller 2'});
    await frame.locator('#presetsName').selectOption(String(index));
    await frame.locator('#inputSave').click();
    await expect(frame.locator('#inputSaveText')).toBeVisible();

    const btn = await page.evaluate(async () => (await import('./js/utils/constants.js')).btn);
    const preset = presets[index];
    const expected = [0, 0, preset.map.length];
    for (const row of preset.map) {
        expected.push(btn[row[0]], btn[row[1]], row[2] + 1, row[3], row[4], row[5], row[6], row[7] | (row[8] << 4));
    }
    expect((await adapter(page)).inputs[1]).toEqual(expected);
});
