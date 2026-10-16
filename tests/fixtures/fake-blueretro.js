/*
 * Simulated BlueRetro adapter for browser tests.
 *
 * Replaces navigator.bluetooth in the top-level page with a fake device that
 * implements the GATT characteristics used by the web config. Options are read
 * from window.__FAKE_BR_OPTIONS (set by an earlier init script). Tests inspect and
 * drive the adapter through window.__fakeBR.
 */
(() => {
    if (window.top !== window) {
        return;
    }

    const opts = window.__FAKE_BR_OPTIONS || {};
    const uuid = n => '56830f56-5180-fab0-314b-2fa176799a' + n.toString(16).padStart(2, '0');
    const CMD = {
        getFwVer: 0x02, getGameId: 0x04, getCfgSrc: 0x05, getFile: 0x06, getFwName: 0x07,
        setDefaultCfg: 0x10, setGameIdCfg: 0x11, openDir: 0x12, closeDir: 0x13, delFile: 0x14,
        deepSleep: 0x37, reset: 0x38, factory: 0x39, otaEnd: 0x5A, otaStart: 0xA5, otaAbort: 0xDE,
    };
    const enc = new TextEncoder();
    const dec = new TextDecoder();

    function defaultInputCfg() {
        /* 2 mappings: LX Left -> LX Left (player 1), RB Down -> RB Right (player 2, turbo) */
        return [0, 0, 2,
            0, 0, 0, 100, 50, 135, 0, 0,
            18, 17, 1, 100, 50, 135, 2, 0x10];
    }

    const state = {
        name: opts.name || 'BlueRetro_Test',
        id: 'fake-blueretro-1',
        apiVersion: opts.apiVersion ?? 2,
        appVersion: opts.appVersion || 'v25.10 hw1 universal',
        fwName: opts.fwName || 'universal_hw1',
        bdaddr: [0x66, 0x55, 0x44, 0x33, 0x22, 0x11],
        gameId: opts.gameId || '',
        cfgSrc: opts.cfgSrc || 0,
        globalCfg: opts.globalCfg ? [...opts.globalCfg] : [0, 0, 0, 0],
        outputs: Array.from({length: 12}, (_, i) => (opts.outputs && opts.outputs[i]) ? [...opts.outputs[i]] : [0, 0]),
        inputs: Array.from({length: 12}, (_, i) => (opts.inputs && opts.inputs[i]) ? [...opts.inputs[i]] : defaultInputCfg()),
        files: opts.files ? [...opts.files] : [],

        /* Behavior controls */
        connected: false,
        available: true,
        connectDelay: opts.connectDelay ?? 20,
        restartDelay: opts.restartDelay ?? 300,
        failNextConnects: opts.failNextConnects || 0,
        ignoreReset: Boolean(opts.ignoreReset),
        keepVersionAfterOta: Boolean(opts.keepVersionAfterOta),
        chooserCancels: Boolean(opts.chooserCancels),

        /* Recorded activity */
        writes: [],
        commands: [],
        requestDeviceCalls: [],
        connectCalls: 0,
        forgetCalls: 0,
        restarts: 0,
        otaBytes: 0,
        otaChunks: [],

        /* Characteristic cursors */
        lastCmd: null,
        outputIdx: 0,
        inputIdx: 0,
        inputOffset: 0,
        fileCursor: 0,
    };

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    function toBytes(data) {
        if (data instanceof ArrayBuffer) {
            return Array.from(new Uint8Array(data));
        }
        return Array.from(new Uint8Array(data.buffer, data.byteOffset, data.byteLength));
    }

    function toView(bytes) {
        return new DataView(Uint8Array.from(bytes).buffer);
    }

    function networkError(message) {
        return new DOMException(message, 'NetworkError');
    }

    function cmdResponse() {
        switch (state.lastCmd) {
            case CMD.getGameId: return Array.from(enc.encode(state.gameId));
            case CMD.getCfgSrc: return [state.cfgSrc];
            case CMD.getFwName: return Array.from(enc.encode(state.fwName));
            case CMD.getFwVer: return Array.from(enc.encode(state.appVersion));
            case CMD.getFile:
                return state.fileCursor < state.files.length
                    ? Array.from(enc.encode(state.files[state.fileCursor++]))
                    : [];
            default: return [];
        }
    }

    function handleCmd(bytes) {
        const cmd = bytes[0];
        state.lastCmd = cmd;
        state.commands.push(cmd);
        switch (cmd) {
            case CMD.setDefaultCfg: state.cfgSrc = 0; break;
            case CMD.setGameIdCfg: if (state.gameId) { state.cfgSrc = 1; } break;
            case CMD.openDir: state.fileCursor = 0; break;
            case CMD.getFile: break;
            case CMD.delFile: {
                const name = dec.decode(Uint8Array.from(bytes.slice(1)));
                state.files = state.files.filter(file => file !== name);
                break;
            }
            case CMD.otaStart: state.otaBytes = 0; state.otaChunks = []; break;
            case CMD.otaEnd: {
                if (!state.keepVersionAfterOta) {
                    const header = Uint8Array.from(state.otaChunks.flat().slice(0, 256));
                    state.appVersion = dec.decode(header).split('\0')[0].trim();
                }
                setTimeout(() => restart(), 30);
                break;
            }
            case CMD.reset: if (!state.ignoreReset) { setTimeout(() => restart(), 30); } break;
            case CMD.factory:
                state.globalCfg = [0, 0, 0, 0];
                setTimeout(() => restart(), 30);
                break;
            case CMD.deepSleep:
                state.available = false;
                setTimeout(() => dropConnection(), 30);
                break;
        }
    }

    const characteristics = {
        1: {
            read: () => state.apiVersion > 1 ? state.globalCfg.slice(0, 4)
                : state.apiVersion > 0 ? state.globalCfg.slice(0, 3) : state.globalCfg.slice(0, 2),
            write: b => { b.forEach((v, i) => { state.globalCfg[i] = v; }); },
        },
        2: {write: b => { state.outputIdx = b[0] | (b[1] << 8); }},
        3: {
            read: () => state.outputs[state.outputIdx],
            write: b => { state.outputs[state.outputIdx] = b.slice(0, 2); },
        },
        4: {write: b => { state.inputIdx = b[0] | (b[1] << 8); state.inputOffset = b[2] | (b[3] << 8); }},
        5: {
            read: () => state.inputs[state.inputIdx].slice(state.inputOffset, state.inputOffset + 512),
            write: b => {
                const cfg = state.inputOffset === 0 ? [] : state.inputs[state.inputIdx];
                b.forEach((v, i) => { cfg[state.inputOffset + i] = v; });
                state.inputs[state.inputIdx] = cfg;
            },
        },
        6: {read: () => [state.apiVersion]},
        7: {read: () => cmdResponse(), write: b => handleCmd(b)},
        8: {write: b => { state.otaBytes += b.length; state.otaChunks.push(b); }},
        9: {read: () => Array.from(enc.encode(state.appVersion))},
        12: {read: () => state.bdaddr},
    };

    class FakeCharacteristic {
        constructor(index) {
            this.index = index;
            this.uuid = uuid(index);
        }

        async readValue() {
            await delay(1);
            if (!state.connected) {
                throw networkError('GATT Server is disconnected.');
            }
            return toView(characteristics[this.index].read());
        }

        async writeValue(data) {
            await delay(1);
            if (!state.connected) {
                throw networkError('GATT Server is disconnected.');
            }
            const bytes = toBytes(data);
            state.writes.push({chrc: this.index, bytes});
            characteristics[this.index].write(bytes);
        }
    }

    class FakeService {
        constructor() {
            this.uuid = uuid(0);
        }

        async getCharacteristic(id) {
            if (!state.connected) {
                throw networkError('GATT Server is disconnected.');
            }
            const index = parseInt(String(id).slice(-2), 16);
            if (!characteristics[index] || String(id) !== uuid(index)) {
                throw new DOMException('No Characteristics matching UUID found.', 'NotFoundError');
            }
            return new FakeCharacteristic(index);
        }
    }

    class FakeDevice extends EventTarget {
        constructor() {
            super();
            this.id = state.id;
            this.name = state.name;
            const device = this;
            this.gatt = {
                device,
                get connected() {
                    return state.connected;
                },
                async connect() {
                    state.connectCalls++;
                    if (state.connected) {
                        return this;
                    }
                    await delay(state.connectDelay);
                    if (state.failNextConnects > 0) {
                        state.failNextConnects--;
                        throw networkError('Connection attempt failed.');
                    }
                    if (!state.available) {
                        throw networkError('Bluetooth Device is no longer in range.');
                    }
                    state.connected = true;
                    return this;
                },
                disconnect() {
                    if (state.connected) {
                        state.connected = false;
                        device.dispatchEvent(new Event('gattserverdisconnected'));
                    }
                },
                async getPrimaryService() {
                    if (!state.connected) {
                        throw networkError('GATT Server is disconnected.');
                    }
                    return new FakeService();
                },
            };
        }

        async forget() {
            state.forgetCalls++;
            this.gatt.disconnect();
        }
    }

    const device = new FakeDevice();

    function dropConnection() {
        if (state.connected) {
            state.connected = false;
            device.dispatchEvent(new Event('gattserverdisconnected'));
        }
    }

    function restart() {
        state.restarts++;
        state.available = false;
        dropConnection();
        setTimeout(() => {
            state.available = true;
        }, state.restartDelay);
    }

    Object.defineProperty(navigator, 'bluetooth', {
        configurable: true,
        value: {
            async requestDevice(options) {
                state.requestDeviceCalls.push(JSON.parse(JSON.stringify(options)));
                await delay(5);
                if (state.chooserCancels) {
                    throw new DOMException('User cancelled the requestDevice() chooser.', 'NotFoundError');
                }
                return device;
            },
            async getAvailability() {
                return true;
            },
        },
    });

    window.__fakeBR = {
        state,
        device,
        dropConnection,
        restart,
        snapshot: () => JSON.parse(JSON.stringify(state)),
    };
})();
