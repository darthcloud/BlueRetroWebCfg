import { brUuid, cfg_cmd_sys_reset } from './utils/constants.js';
import { getBdAddr } from './utils/getBdAddr.js';
import { getLatestRelease } from './utils/getLatestRelease.js';

const frame = document.getElementById('toolFrame');
const home = document.getElementById('homeContent');
const connectionPanel = document.getElementById('appConnectionPanel');
const connectionControls = document.getElementById('appConnectionControls');
const collapsedConnection = document.getElementById('appConnectionCollapsed');
const connectionButtons = document.getElementById('appConnectionButtons');
const connectButton = document.getElementById('appBtConn');
const forgetButton = document.getElementById('appBtForget');
const autoReconnectToggle = document.getElementById('appAutoReconnect');
const connectionText = document.getElementById('appConnectionText');
const adapterDetails = document.getElementById('appAdapterDetails');
const adapterIdentity = document.getElementById('appAdapterIdentity');
const firmwareVersionText = document.getElementById('appFirmwareVersion');
const hardwareVersionText = document.getElementById('appHardwareVersion');
const platformText = document.getElementById('appPlatform');
const deviceAddressText = document.getElementById('appDeviceAddress');
const latestFirmwareText = document.getElementById('appLatestFirmware');
const logToggle = document.getElementById('appLogToggle');
const logPanel = document.getElementById('appLogPanel');
const logClose = document.getElementById('appLogClose');
const logClear = document.getElementById('appLogClear');
const connectionLogOutput = document.getElementById('appConnectionLog');
const restartBar = document.getElementById('appRestartBar');
const restartText = document.getElementById('appRestartText');
const restartNowButton = document.getElementById('appRestartNow');
const restartLaterButton = document.getElementById('appRestartLater');
const autoReconnectKey = 'blueRetroAutoReconnect';
const observedDevices = new WeakSet();
const maxReconnectAttempts = 10;
const debugModeBank = 0xDB;
const debugRestartTimeout = 15000;

let bluetoothDevice = null;
let gattServer = null;
let reconnectAttempts = 0;
let reconnectTimer = null;
let forgetInProgress = false;
let otaVerification = null;
/* Set while the adapter restarts after Debug mode was written (OTA testing) */
let debugModeConfirmation = null;
let debugRestartTimer = null;
/* Saved changes that only apply after the adapter restarts */
const pendingRestartReasons = new Set();
let restartReconnect = false;
let restartTimer = null;

function describeError(error) {
    if (!error) {
        return '';
    }
    return (error.name ? error.name + ': ' : '') + (error.message || String(error));
}

function connectionLog(message, error = null) {
    const time = new Date().toLocaleTimeString();
    const detail = error ? ' — ' + describeError(error) : '';
    connectionLogOutput.textContent += '[' + time + '] ' + message + detail + '\n';
    connectionLogOutput.scrollTop = connectionLogOutput.scrollHeight;
}

function showConnectionActions() {
    connectionButtons.hidden = false;
    connectButton.hidden = false;
    forgetButton.hidden = !bluetoothDevice;
}

function hideConnectionActions() {
    connectionButtons.hidden = true;
    connectButton.hidden = true;
    forgetButton.hidden = true;
}

const savedAutoReconnect = localStorage.getItem(autoReconnectKey)
    ?? sessionStorage.getItem(autoReconnectKey);
autoReconnectToggle.checked = savedAutoReconnect === 'true';
if (savedAutoReconnect !== null) {
    localStorage.setItem(autoReconnectKey, savedAutoReconnect);
    sessionStorage.removeItem(autoReconnectKey);
}
/* Saved by the removed page-reload restore; no longer used */
localStorage.removeItem('blueRetroDeviceId');
localStorage.removeItem('blueRetroDeviceName');
connectionLog('Page loaded. Automatic reconnect is ' + (autoReconnectToggle.checked ? 'on.' : 'off.'));

window.blueRetroConnection = {
    getDevice: () => bluetoothDevice,
};

function setConnectionCollapsed(collapsed) {
    const canCollapse = connectionPanel.dataset.state === 'connected';
    const shouldCollapse = collapsed && canCollapse;
    connectionControls.hidden = shouldCollapse;
    collapsedConnection.disabled = !canCollapse;
    collapsedConnection.setAttribute('aria-expanded', shouldCollapse ? 'false' : 'true');
    connectionPanel.classList.toggle('connection-collapsed', shouldCollapse);
}

function setConnectionState(message, state) {
    const wasConnected = connectionPanel.dataset.state === 'connected';
    connectionPanel.dataset.state = state;
    connectionText.textContent = message;
    connectionText.dataset.state = state;

    if (state === 'disconnected') {
        adapterDetails.hidden = true;
        adapterIdentity.hidden = true;
    }

    if (state !== 'connected') {
        setConnectionCollapsed(false);
    }

    if (state === 'connected' && !wasConnected) {
        connectionPanel.classList.remove('connection-success');
        void connectionPanel.offsetWidth;
        connectionPanel.classList.add('connection-success');
    }
}

function notifyTool(type = 'blueretro-connected', details = {}) {
    if (frame.contentWindow) {
        frame.contentWindow.postMessage({type, ...details}, window.location.origin);
    }
}

function observeDevice(device) {
    if (!observedDevices.has(device)) {
        device.addEventListener('gattserverdisconnected', handleDisconnection);
        observedDevices.add(device);
    }
}

function parseFirmwareIdentity(version) {
    const parts = version.split(/\s+/).filter(Boolean);
    const hardwareIndex = parts.findIndex(part => /^hw\d+$/i.test(part));

    if (hardwareIndex === -1) {
        return {
            firmware: version || 'Unknown',
            hardware: 'Unknown',
            platform: 'Unknown',
        };
    }

    return {
        firmware: parts.slice(0, hardwareIndex).join(' ') || 'Unknown',
        hardware: parts[hardwareIndex],
        platform: parts[hardwareIndex + 1] || 'Unknown',
    };
}

async function loadAdapterDetails(device) {
    const service = await gattServer.getPrimaryService(brUuid[0]);
    const versionPromise = service.getCharacteristic(brUuid[9])
        .then(characteristic => characteristic.readValue())
        .then(value => normalizeVersion(new TextDecoder('utf-8').decode(value)));
    const [addressResult, versionResult] = await Promise.allSettled([
        getBdAddr(service),
        versionPromise,
    ]);

    const version = versionResult.status === 'fulfilled' ? versionResult.value : '';
    const identity = parseFirmwareIdentity(version);
    firmwareVersionText.textContent = identity.firmware;
    hardwareVersionText.textContent = identity.hardware;
    platformText.textContent = identity.platform;
    deviceAddressText.textContent = addressResult.status === 'fulfilled' ? addressResult.value : '';
    adapterIdentity.hidden = false;
    adapterDetails.hidden = false;

    latestFirmwareText.hidden = true;
    getLatestRelease().then(latestVersion => {
        if (latestVersion && version.indexOf(latestVersion) === -1) {
            latestFirmwareText.replaceChildren();
            latestFirmwareText.append('Latest upstream release: ' + latestVersion + ' ');
            const link = document.createElement('a');
            link.href = 'https://github.com/darthcloud/BlueRetro/releases';
            link.target = '_blank';
            link.rel = 'noopener';
            link.textContent = 'View on GitHub';
            latestFirmwareText.appendChild(link);
            latestFirmwareText.hidden = false;
        }
    });
}

async function connectDevice(device, reconnecting = false) {
    clearTimeout(reconnectTimer);
    connectButton.disabled = true;
    hideConnectionActions();
    connectionLog((reconnecting ? 'Reconnect' : 'Connect') + ' attempt started for ' + (device.name || 'BlueRetro') + '.');
    setConnectionState(
        (reconnecting ? 'Reconnecting to ' : 'Connecting to ') + device.name + '...',
        'working'
    );

    try {
        observeDevice(device);
        gattServer = device.gatt.connected ? device.gatt : await device.gatt.connect();
        bluetoothDevice = device;
        reconnectAttempts = 0;
        await loadAdapterDetails(device);
        connectButton.textContent = 'Change adapter';
        showConnectionActions();
        setConnectionState('Connected to ' + device.name, 'connected');
        connectionLog('Connected to ' + (device.name || 'BlueRetro') + '.');
        setConnectionCollapsed(true);
        if (restartReconnect) {
            restartReconnect = false;
            hideRestartBar();
            connectionLog('Adapter restarted; saved changes are now applied.');
        }
        if (debugModeConfirmation) {
            await confirmDebugMode();
        }
        else if (otaVerification) {
            await verifyFirmwareUpdate();
        }
        else {
            notifyTool();
        }
    }
    catch (error) {
        connectionLog('Connection attempt failed.', error);
        throw error;
    }
    finally {
        connectButton.disabled = false;
    }
}

function scheduleReconnect() {
    clearTimeout(reconnectTimer);
    hideConnectionActions();
    const firmwareVerificationReconnect = Boolean(otaVerification || debugModeConfirmation || restartReconnect);
    if (!bluetoothDevice
      || forgetInProgress
      || (!autoReconnectToggle.checked && !firmwareVerificationReconnect)) {
        if (bluetoothDevice && !forgetInProgress) {
            connectButton.textContent = 'Reconnect';
            setConnectionState('Disconnected. Auto-reconnect is off.', 'disconnected');
            showConnectionActions();
            connectionLog('Automatic reconnect stopped because it is turned off.');
        }
        return;
    }

    if (reconnectAttempts >= maxReconnectAttempts) {
        connectButton.textContent = 'Reconnect';
        setConnectionState(
            restartReconnect
                ? 'Could not reconnect after the restart. Use Reconnect when the adapter is ready.'
                : firmwareVerificationReconnect
                ? 'Could not reconnect to verify the firmware. Use Reconnect when the adapter is ready.'
                : 'Could not reconnect automatically. Try again when the adapter is available.',
            'disconnected'
        );
        showConnectionActions();
        connectionLog('Automatic reconnect stopped after ' + reconnectAttempts + ' attempts.');
        return;
    }

    const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 8000);
    const seconds = Math.round(delay / 1000);
    setConnectionState(
        restartReconnect
            ? 'Adapter restarting. Reconnecting in ' + seconds + 's...'
            : debugModeConfirmation
            ? 'Adapter restarting with Debug mode. Reconnecting in ' + seconds + 's to confirm...'
            : firmwareVerificationReconnect
                ? 'Firmware restart detected. Reconnecting in ' + seconds + 's to verify the update...'
                : 'Connection lost. Reconnecting in ' + seconds + 's...',
        'working'
    );
    connectButton.textContent = 'Reconnect now';
    connectionLog('Retry ' + (reconnectAttempts + 1) + ' scheduled in ' + seconds + ' second' + (seconds === 1 ? '.' : 's.'));

    reconnectTimer = setTimeout(async () => {
        reconnectAttempts++;
        try {
            await connectDevice(bluetoothDevice, true);
        }
        catch (error) {
            connectionLog('Retry ' + reconnectAttempts + ' failed.', error);
            scheduleReconnect();
        }
    }, delay);
}

function handleDisconnection() {
    clearTimeout(debugRestartTimer);
    clearTimeout(restartTimer);
    gattServer = null;
    connectionLog('Bluetooth connection closed.');
    notifyTool('blueretro-disconnected');
    scheduleReconnect();
}

async function connectBlueRetro() {
    clearTimeout(reconnectTimer);
    hideConnectionActions();

    if (bluetoothDevice && !bluetoothDevice.gatt.connected) {
        try {
            await connectDevice(bluetoothDevice, true);
        }
        catch (error) {
            setConnectionState('Reconnect failed: ' + error.message, 'disconnected');
            showConnectionActions();
            connectionLog('Manual reconnect failed.', error);
        }
        return;
    }

    const currentDevice = bluetoothDevice;
    let switchingDevices = false;
    connectButton.disabled = true;
    connectionLog('Opening the browser device chooser.');
    setConnectionState('Choose your BlueRetro adapter in the browser prompt...', 'working');

    try {
        const selectedDevice = await navigator.bluetooth.requestDevice({
            filters: [{namePrefix: 'BlueRetro'}],
            optionalServices: [brUuid[0]],
        });

        if (currentDevice
          && currentDevice !== selectedDevice
          && currentDevice.gatt.connected) {
            switchingDevices = true;
            forgetInProgress = true;
            currentDevice.gatt.disconnect();
        }

        bluetoothDevice = selectedDevice;
        connectionLog('Selected ' + (selectedDevice.name || 'BlueRetro') + '.');
        await connectDevice(selectedDevice);
    }
    catch (error) {
        if (currentDevice && currentDevice.gatt.connected) {
            bluetoothDevice = currentDevice;
            setConnectionState('Connected to ' + currentDevice.name, 'connected');
        }
        else if (error.name === 'NotFoundError') {
            setConnectionState('No adapter selected.', 'disconnected');
        }
        else {
            setConnectionState('Connection failed: ' + error.message, 'disconnected');
        }
        showConnectionActions();
        connectionLog('Device selection or connection did not complete.', error);
    }
    finally {
        if (switchingDevices) {
            forgetInProgress = false;
        }
        connectButton.disabled = false;
    }
}

async function disconnectAndForget(options = {}) {
    const confirmFirst = options.confirmFirst !== false;
    if (!bluetoothDevice
      || (confirmFirst && !window.confirm('Disconnect and remove this BlueRetro adapter from the browser?'))) {
        return;
    }

    clearTimeout(reconnectTimer);
    clearTimeout(debugRestartTimer);
    debugModeConfirmation = null;
    restartReconnect = false;
    hideRestartBar();
    forgetInProgress = true;
    const device = bluetoothDevice;

    try {
        if (device.gatt.connected) {
            device.gatt.disconnect();
        }
        const canForgetPermission = typeof device.forget === 'function';
        if (canForgetPermission) {
            await device.forget();
        }
        localStorage.removeItem(autoReconnectKey);
        autoReconnectToggle.checked = false;
        bluetoothDevice = null;
        gattServer = null;
        adapterDetails.hidden = true;
        adapterIdentity.hidden = true;
        reconnectAttempts = 0;
        forgetButton.hidden = true;
        connectButton.textContent = 'Connect to BlueRetro';
        setConnectionState(
            canForgetPermission
                ? (options.successMessage || 'Disconnected and forgotten by this site.')
                : 'Disconnected. Remove the adapter in browser site settings to revoke permission completely.',
            'disconnected'
        );
        showConnectionActions();
        connectionLog('Adapter disconnected and browser permission removal completed.');
        notifyTool('blueretro-forgotten');
    }
    catch (error) {
        setConnectionState('Disconnected, but the browser could not forget the adapter: ' + error.message, 'disconnected');
        showConnectionActions();
        connectionLog('Could not fully forget the adapter.', error);
    }
    finally {
        forgetInProgress = false;
    }
}

function normalizeVersion(value) {
    return value.replace(/\0/g, '').trim();
}

async function verifyFirmwareUpdate() {
    const verification = otaVerification;
    setConnectionState('Reconnected. Verifying the installed firmware...', 'working');

    try {
        const service = await gattServer.getPrimaryService(brUuid[0]);
        const characteristic = await service.getCharacteristic(brUuid[9]);
        const value = await characteristic.readValue();
        const runningVersion = normalizeVersion(new TextDecoder('utf-8').decode(value));
        const verified = Boolean(runningVersion)
            && verification.header.indexOf(runningVersion) !== -1;

        otaVerification = null;
        notifyTool('blueretro-ota-verification-result-' + (verified ? 'success' : 'failure'), {
            runningVersion,
            fileName: verification.fileName,
            ...(verified && verification.debugMode
                ? {message: 'The installed version matches the selected firmware. Setting Debug mode and restarting the adapter...'}
                : {}),
        });

        if (verified && verification.debugMode) {
            connectionLog('Firmware ' + runningVersion + ' verified; debug testing is on.');
            await enableDebugMode(runningVersion);
            return;
        }

        if (!verified) {
            setConnectionState(
                'Firmware verification failed. Running version: ' + (runningVersion || 'unknown') + '. Connection kept open.',
                'warning'
            );
            notifyTool();
            return;
        }

        autoReconnectToggle.checked = false;
        localStorage.removeItem(autoReconnectKey);
        setConnectionState('Firmware ' + runningVersion + ' verified. Disconnecting and forgetting the adapter...', 'connected');
        await new Promise(resolve => setTimeout(resolve, 1200));
        await disconnectAndForget({
            confirmFirst: false,
            successMessage: 'Firmware ' + runningVersion + ' verified. Adapter disconnected and forgotten.',
        });
    }
    catch (error) {
        otaVerification = null;
        notifyTool('blueretro-ota-verification-result-failure', {
            fileName: verification.fileName,
            error: error.message,
        });
        setConnectionState('Could not verify the firmware: ' + error.message + '. Connection kept open.', 'warning');
        notifyTool();
    }
}

async function readGlobalConfig(service) {
    const apiVersion = (await (await service.getCharacteristic(brUuid[6])).readValue()).getUint8(0);
    const value = await (await service.getCharacteristic(brUuid[1])).readValue();
    return {apiVersion, config: new Uint8Array(value.buffer, value.byteOffset, Math.min(4, value.byteLength)).slice()};
}

function reportDebugMode(success, message, runningVersion) {
    debugModeConfirmation = null;
    clearTimeout(debugRestartTimer);
    connectionLog(message);
    setConnectionState(message, success ? 'connected' : 'warning');
    notifyTool('blueretro-ota-debug-result-' + (success ? 'success' : 'failure'), {
        runningVersion,
        message,
    });
    notifyTool();
}

/* OTA testing: set memory card bank to Debug mode, then restart and reconnect to confirm */
async function enableDebugMode(runningVersion) {
    try {
        setConnectionState('Firmware ' + runningVersion + ' verified. Setting Debug mode...', 'working');
        const service = await gattServer.getPrimaryService(brUuid[0]);
        const {apiVersion, config} = await readGlobalConfig(service);
        connectionLog('Global config read (API version ' + apiVersion + '): ' + Array.from(config).join(', ') + '.');
        if (apiVersion < 2) {
            reportDebugMode(false, 'Debug mode needs config API version 2 or later; this firmware reports ' + apiVersion + '. Connection kept open.', runningVersion);
            return;
        }

        if (config[3] !== debugModeBank) {
            config[3] = debugModeBank;
            await (await service.getCharacteristic(brUuid[1])).writeValue(config);
            connectionLog('Memory card bank set to Debug mode (0xDB).');
        }
        else {
            connectionLog('Memory card bank was already set to Debug mode (0xDB).');
        }

        debugModeConfirmation = {runningVersion};
        reconnectAttempts = 0;
        setConnectionState('Debug mode saved. Restarting the adapter...', 'working');
        connectionLog('Sending adapter restart command.');
        debugRestartTimer = setTimeout(() => {
            if (debugModeConfirmation && bluetoothDevice && bluetoothDevice.gatt.connected) {
                reportDebugMode(false, 'Debug mode was saved, but the adapter did not restart. Power cycle it to apply. Connection kept open.', runningVersion);
            }
        }, debugRestartTimeout);
        try {
            await (await service.getCharacteristic(brUuid[7])).writeValue(new Uint8Array([cfg_cmd_sys_reset]));
        }
        catch (error) {
            /* The adapter may drop the link before acknowledging the restart */
            connectionLog('Restart command not acknowledged; waiting for the adapter to restart.', error);
        }
    }
    catch (error) {
        reportDebugMode(false, 'Could not set Debug mode: ' + error.message + '. Connection kept open.', runningVersion);
    }
}

async function confirmDebugMode() {
    const {runningVersion} = debugModeConfirmation;
    setConnectionState('Reconnected. Confirming Debug mode...', 'working');
    try {
        const service = await gattServer.getPrimaryService(brUuid[0]);
        const {config} = await readGlobalConfig(service);
        connectionLog('Global config after restart: ' + Array.from(config).join(', ') + '.');
        if (config[3] === debugModeBank) {
            reportDebugMode(true, 'Firmware ' + runningVersion + ' running with Debug mode on. Adapter kept connected for testing.', runningVersion);
        }
        else {
            reportDebugMode(false, 'Debug mode was not kept after the restart (memory card bank is ' + config[3] + '). Connection kept open.', runningVersion);
        }
    }
    catch (error) {
        reportDebugMode(false, 'Could not confirm Debug mode: ' + error.message + '. Connection kept open.', runningVersion);
    }
}

function showRestartBar(reason) {
    if (reason) {
        pendingRestartReasons.add(reason);
    }
    restartText.textContent = 'Restart the adapter to apply your '
        + (pendingRestartReasons.size ? Array.from(pendingRestartReasons).join(' and ') + ' ' : '')
        + 'changes.';
    restartNowButton.disabled = false;
    restartNowButton.textContent = 'Restart adapter';
    restartBar.hidden = false;
}

function hideRestartBar() {
    clearTimeout(restartTimer);
    pendingRestartReasons.clear();
    restartBar.hidden = true;
}

async function restartAdapter() {
    if (!gattServer || !bluetoothDevice || !bluetoothDevice.gatt.connected) {
        restartText.textContent = 'Connect to the adapter first, then restart it.';
        return;
    }

    restartNowButton.disabled = true;
    restartNowButton.textContent = 'Restarting…';
    restartReconnect = true;
    reconnectAttempts = 0;
    connectionLog('Restarting the adapter to apply saved changes.');
    restartTimer = setTimeout(() => {
        if (restartReconnect && bluetoothDevice && bluetoothDevice.gatt.connected) {
            restartReconnect = false;
            connectionLog('Adapter did not restart after the restart command.');
            showRestartBar();
            restartText.textContent = 'The adapter did not restart. Try again, or turn it off and on.';
        }
    }, debugRestartTimeout);

    try {
        const service = await gattServer.getPrimaryService(brUuid[0]);
        await (await service.getCharacteristic(brUuid[7])).writeValue(new Uint8Array([cfg_cmd_sys_reset]));
    }
    catch (error) {
        /* The adapter may drop the link before acknowledging the restart */
        connectionLog('Restart command not acknowledged; waiting for the adapter to restart.', error);
    }
}

function showHome() {
    home.hidden = false;
    frame.hidden = true;
}

function showTool(path) {
    home.hidden = true;
    frame.hidden = false;
    const toolUrl = new URL(path + '?embedded=1', window.location.href);
    if (frame.contentWindow.location.href !== toolUrl.href) {
        frame.contentWindow.location.replace(toolUrl.href);
    }
}

function markCurrentNav(route) {
    document.querySelectorAll('.site-nav a').forEach(link => {
        const current = route ? link.dataset.tool === route : link.hasAttribute('data-home');
        if (current) {
            link.setAttribute('aria-current', 'page');
        }
        else {
            link.removeAttribute('aria-current');
        }
    });
}

function routeFromHash() {
    const route = window.location.hash.slice(1);
    markCurrentNav(route);
    if (!route) {
        showHome();
        return;
    }

    const link = document.querySelector('[data-tool="' + route + '"]');
    if (link) {
        showTool(link.getAttribute('href'));
    }
    else {
        showHome();
    }
}

document.addEventListener('click', event => {
    const homeLink = event.target.closest('a[data-home]');
    if (homeLink) {
        event.preventDefault();
        if (window.location.hash) {
            history.pushState(null, '', window.location.pathname);
        }
        showHome();
        return;
    }

    const link = event.target.closest('a[data-tool]');
    if (!link) {
        return;
    }

    event.preventDefault();
    const route = link.dataset.tool;
    if (window.location.hash === '#' + route) {
        routeFromHash();
    }
    else {
        window.location.hash = route;
    }
});

connectButton.addEventListener('click', connectBlueRetro);
restartNowButton.addEventListener('click', restartAdapter);
restartLaterButton.addEventListener('click', () => {
    restartBar.hidden = true;
    connectionLog('Restart postponed; changes apply the next time the adapter restarts.');
});
forgetButton.addEventListener('click', () => disconnectAndForget());
logToggle.addEventListener('click', () => {
    logPanel.hidden = false;
    logToggle.setAttribute('aria-expanded', 'true');
    logClose.focus();
});
logClose.addEventListener('click', () => {
    logPanel.hidden = true;
    logToggle.setAttribute('aria-expanded', 'false');
    logToggle.focus();
});
logClear.addEventListener('click', () => {
    connectionLogOutput.textContent = '';
    connectionLog('Log cleared.');
});
document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !logPanel.hidden) {
        logClose.click();
    }
});
collapsedConnection.addEventListener('click', () => {
    setConnectionCollapsed(!connectionPanel.classList.contains('connection-collapsed'));
});
autoReconnectToggle.addEventListener('change', async () => {
    localStorage.setItem(autoReconnectKey, autoReconnectToggle.checked ? 'true' : 'false');
    connectionLog('Automatic reconnect turned ' + (autoReconnectToggle.checked ? 'on.' : 'off.'));
    if (!autoReconnectToggle.checked) {
        clearTimeout(reconnectTimer);
        if (bluetoothDevice && !bluetoothDevice.gatt.connected) {
            connectButton.textContent = 'Reconnect';
            setConnectionState('Disconnected. Auto-reconnect is off.', 'disconnected');
            showConnectionActions();
        }
    }
    else if (bluetoothDevice && !bluetoothDevice.gatt.connected) {
        try {
            await connectDevice(bluetoothDevice, true);
        }
        catch (error) {
            reconnectAttempts = 1;
            scheduleReconnect();
        }
    }
});
window.addEventListener('hashchange', routeFromHash);
window.addEventListener('message', event => {
    if (event.origin !== window.location.origin || !event.data) {
        return;
    }

    if (event.data.type === 'blueretro-tool-height') {
        frame.style.height = Math.max(600, event.data.height) + 'px';
    }
    else if (event.data.type === 'blueretro-log') {
        connectionLog('Tool: ' + event.data.message);
    }
    else if (event.data.type === 'blueretro-restart-required') {
        connectionLog('Saved ' + (event.data.reason || 'settings') + '; a restart is needed to apply them.');
        showRestartBar(event.data.reason);
    }
    else if (event.data.type === 'blueretro-restart-sent') {
        connectionLog('Adapter restart started from a tool.');
        hideRestartBar();
    }
    else if (event.data.type === 'blueretro-ota-verification-start') {
        otaVerification = {
            header: event.data.header,
            fileName: event.data.fileName,
            debugMode: Boolean(event.data.debugMode),
        };
        reconnectAttempts = 0;
        connectionLog('Firmware verification reconnect armed.'
            + (otaVerification.debugMode ? ' Debug mode will be set after verification.' : ''));
        setConnectionState('Firmware transfer in progress. A one-time verification reconnect is armed.', 'connected');
    }
    else if (event.data.type === 'blueretro-ota-transfer-failed') {
        otaVerification = null;
        connectionLog('Firmware transfer reported a failure.');
        setConnectionState('Firmware transfer failed. Connection kept open.', 'warning');
    }
    else if (event.data.type === 'blueretro-ota-transfer-complete' && otaVerification) {
        connectionLog('Firmware transfer completed; waiting for adapter restart.');
        setConnectionState('Firmware transferred. Waiting for BlueRetro to restart automatically...', 'working');
    }
});

if (!navigator.bluetooth) {
    connectButton.disabled = true;
    setConnectionState('Web Bluetooth is unavailable. Use Chrome or Edge on a Bluetooth-capable computer.', 'disconnected');
}

routeFromHash();
