import { test, expect } from '@playwright/test';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { repoRoot, mockGitHub } from '../helpers.js';

/* App modules are browser ES modules, so they are imported in a page */
let constants;
let versionCompareResults;

test.beforeAll(async ({browser}) => {
    const page = await browser.newPage();
    await mockGitHub(page);
    await page.goto('index.html');
    ({constants, versionCompareResults} = await page.evaluate(async () => {
        const c = await import('./js/utils/constants.js');
        const {versionCompare} = await import('./js/utils/versionCompare.js');
        const cases = [['1.2.3', '1.2.3'], ['1.10', '1.9'], ['1.2', '1.2.1'], ['2.0', '10.0']];
        return {
            constants: {
                btn: c.btn, btnList: c.btnList, labelName: c.labelName, systemCfg: c.systemCfg,
                turboMask: c.turboMask, scaling: c.scaling, diagScaling: c.diagScaling,
                brUuid: c.brUuid, maxOutput: c.maxOutput,
            },
            versionCompareResults: cases.map(([a, b]) => versionCompare(a, b)),
        };
    }));
    await page.close();
});

const mapDir = path.join(repoRoot, 'map');
const presetFiles = readdirSync(mapDir).filter(name => name.endsWith('.json')).sort();

test.describe('preset files', () => {
    test('there are preset files to test', () => {
        expect(presetFiles.length).toBeGreaterThan(0);
    });

    for (const file of presetFiles) {
        test(file + ' is a valid preset', () => {
            const preset = JSON.parse(readFileSync(path.join(mapDir, file), 'utf8'));
            const turboValues = Object.values(constants.turboMask);

            expect(typeof preset.name).toBe('string');
            expect(preset.name.trim()).not.toBe('');
            expect(typeof preset.desc).toBe('string');
            expect(typeof preset.console).toBe('string');
            expect(Array.isArray(preset.map)).toBe(true);
            expect(preset.map.length).toBeGreaterThan(0);
            expect(preset.map.length).toBeLessThanOrEqual(255);

            preset.map.forEach((row, i) => {
                const where = file + ' mapping ' + i;
                expect(row, where).toHaveLength(9);
                const [src, dest, destId, max, thres, dz, turbo, scaling, diag] = row;
                expect(constants.btn, where + ' source').toHaveProperty([src]);
                expect(constants.btn, where + ' destination').toHaveProperty([dest]);
                /* Player is relative to the controller slot the preset is applied to */
                expect(Number.isInteger(destId) && Math.abs(destId) < constants.maxOutput, where + ' player offset').toBe(true);
                expect(max >= 0 && max <= 255, where + ' strength').toBe(true);
                expect(thres >= 0 && thres <= 100, where + ' threshold').toBe(true);
                expect(dz >= 0 && dz <= 255, where + ' deadzone').toBe(true);
                expect(turboValues, where + ' turbo').toContain(turbo);
                expect(scaling >= 0 && scaling < constants.scaling.length, where + ' scaling').toBe(true);
                expect(diag >= 0 && diag < constants.diagScaling.length, where + ' diagonal').toBe(true);
            });
        });
    }
});

test.describe('constants', () => {
    test('every button row has a name for every label set', () => {
        constants.btnList.forEach((row, i) => {
            expect(row, 'btnList row ' + i).toHaveLength(constants.labelName.length);
        });
    });

    /* Names may alias the same input (e.g. KB_A and PAD_LX_LEFT are both 0) */
    test('button IDs point into the button list', () => {
        for (const [name, id] of Object.entries(constants.btn)) {
            expect(Number.isInteger(id) && id >= 0 && id < constants.btnList.length, name).toBe(true);
        }
    });

    test('turbo settings have unique values', () => {
        const values = Object.values(constants.turboMask);
        expect(new Set(values).size).toBe(values.length);
    });

    test('Bluetooth UUIDs are unique', () => {
        expect(constants.brUuid).toHaveLength(13);
        expect(new Set(constants.brUuid).size).toBe(13);
    });
});

test('versionCompare orders versions numerically', () => {
    expect(versionCompareResults).toEqual([0, 1, -1, -1]);
});
