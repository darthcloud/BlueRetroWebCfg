import { expect } from '@playwright/test';
import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
export const repoRoot = path.resolve(here, '..');
export const fakeAdapterScript = path.join(here, 'fixtures', 'fake-blueretro.js');
export const latestRelease = 'v99.9';

/* Answer GitHub API calls locally so tests never depend on the network */
export async function mockGitHub(page) {
    await page.route('https://api.github.com/repos/darthcloud/BlueRetro/releases/latest', route =>
        route.fulfill({json: {tag_name: latestRelease}}));
    await page.route('https://api.github.com/repos/rainthefrog/BlueRetroWebCfg/contents/map/', route =>
        route.fulfill({json: readdirSync(path.join(repoRoot, 'map'))
            .filter(name => name.endsWith('.json'))
            .sort()
            .map(name => ({name, type: 'file'}))}));
    await page.route(/googletagmanager|google-analytics/, route => route.abort());
}

/* Load the app with a simulated adapter; options are documented in fixtures/fake-blueretro.js */
export async function openApp(page, route = '', adapterOptions = {}) {
    await mockGitHub(page);
    await page.addInitScript(options => {
        window.__FAKE_BR_OPTIONS = options;
    }, adapterOptions);
    await page.addInitScript({path: fakeAdapterScript});
    await page.goto('index.html' + (route ? '#' + route : ''));
    await expect(page.locator('#appConnectionText')).toBeVisible();
}

export function tool(page) {
    return page.frameLocator('#toolFrame');
}

export async function connect(page) {
    await page.locator('#appBtConn').click();
    await expect(page.locator('#appConnectionText')).toHaveText(/^Connected to BlueRetro_Test/);
}

/* Wait until the embedded tool has finished loading data from the adapter */
export async function waitForToolReady(page) {
    await expect(tool(page).locator('html')).not.toHaveClass(/adapter-unavailable/);
    await expect(tool(page).locator('#toolLoadingState')).toBeHidden();
}

export function adapter(page) {
    return page.evaluate(() => window.__fakeBR.snapshot());
}

export function setAdapter(page, values) {
    return page.evaluate(values => Object.assign(window.__fakeBR.state, values), values);
}

export function writesTo(snapshot, chrc) {
    return snapshot.writes.filter(write => write.chrc === chrc).map(write => write.bytes);
}

export function connectionLog(page) {
    return page.locator('#appConnectionLog').textContent();
}

/* Look up a real entry in the bundled game ID database */
export async function findKnownGame(page) {
    await page.addScriptTag({url: 'assets/lib/sql.js/sql-wasm.js'});
    return page.evaluate(async () => {
        const SQL = await window.initSqlJs({locateFile: file => 'assets/lib/sql.js/' + file});
        const data = await (await fetch('assets/data/gameid.db')).arrayBuffer();
        const db = new SQL.Database(new Uint8Array(data));
        const rows = db.exec('SELECT id, name FROM games LIMIT 200')[0].values;
        const [id, name] = rows.find(([id, name]) => /^[0-9A-Za-z_-]+$/.test(id) && name);
        return {id, name};
    });
}
