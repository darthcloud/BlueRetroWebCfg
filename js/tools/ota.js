// Base on https://www.html5rocks.com/en/tutorials/file/dndfiles//

import { brUuid, cfg_cmd_get_fw_name, cfg_cmd_get_fw_ver } from '../utils/constants.js';
import { getLatestRelease } from '../utils/getLatestRelease.js';
import { getStringCmd } from '../utils/getStringCmd.js';
import { getAppVersion } from '../utils/getAppVersion.js';
import { getBdAddr } from '../utils/getBdAddr.js';
import { otaWriteFirmware } from '../utils/otaWriteFirmware.js';
import { getBlueRetroDevice } from '../utils/blueRetroConnection.js';

var bluetoothDevice;
let brService = null;
var reader;
var progress = document.querySelector('.percent');
var cancel = 0;
var bdaddr = '';
var app_ver = '';
var app_name = '';
var latest_ver = '';
var name = '';
let cur_fw_is_hw2 = 0;
let expectedFirmwareHeader = '';
let expectedFirmwareFileName = '';

/* Testing option: set Debug mode after a verified update (remembered per browser) */
const debugModeKey = 'blueRetroOtaDebugMode';
const debugModeToggle = document.getElementById('otaDebugMode');
try {
    debugModeToggle.checked = localStorage.getItem(debugModeKey) === 'true';
}
catch (e) {
    // Storage unavailable; default off
}
debugModeToggle.addEventListener('change', () => {
    try {
        localStorage.setItem(debugModeKey, debugModeToggle.checked ? 'true' : 'false');
    }
    catch (e) {
        // Storage unavailable; setting applies to this visit only
    }
});

function notifyAppShell(type, details = {}) {
    if (window.parent !== window) {
        window.parent.postMessage({type, ...details}, window.location.origin);
    }
}

export function abortFwUpdate() {
    cancel = 1;
}

function setProgress(percent) {
    progress.style.width = percent + '%';
    progress.textContent = percent + '%';
}

function errorHandler(evt) {
    switch(evt.target.error.code) {
        case evt.target.error.NOT_FOUND_ERR:
            log('File Not Found!');
            break;
        case evt.target.error.NOT_READABLE_ERR:
            log('File is not readable');
            break;
        case evt.target.error.ABORT_ERR:
            break; // noop
        default:
            log('An error occurred reading this file.');
    };
}

function updateProgress(total, loaded) {
    var percentLoaded = Math.round((loaded / total) * 100);
    // Increase the progress bar length.
    if (percentLoaded < 100) {
        progress.style.width = percentLoaded + '%';
        progress.textContent = percentLoaded + '%';
    }
}

export function firmwareUpdate(evt) {
    let fileInput = document.getElementById("fwFile");
    if (!fileInput.files.length) {
        window.alert('Choose a .bin firmware file first.');
        return;
    }
    document.getElementById('divFwResult').hidden = true;
    // Reset progress indicator on new file selection.
    progress.style.width = '0%';
    progress.textContent = '0%';

    reader = new FileReader();
    reader.onerror = errorHandler;
    reader.onabort = function(e) {
        log('File read cancelled');
    };
    reader.onload = function(e) {
        var decoder = new TextDecoder("utf-8");
        var header = decoder.decode(reader.result.slice(0, 256));
        expectedFirmwareHeader = header;
        expectedFirmwareFileName = fileInput.files[0].name;
        let new_fw_is_hw2 = (header.indexOf('hw2') != -1);

        log("new_fw_is_hw2: " + new_fw_is_hw2);

        if (cur_fw_is_hw2 == new_fw_is_hw2) {
            writeFirmware(reader.result, 0);
        }
        else {
            log("Hardware and firmware mismatch!");
        }
    }

    let file = fileInput.value;
    let ext = file.match(/\.[0-9a-z]+$/i);

    if (ext && ext[0].toLowerCase() == '.bin') {
        // Read in the image file as a binary string.
        reader.readAsArrayBuffer(document.getElementById("fwFile").files[0]);
    }
    else {
        log("Invalid file format. Make sure to unzip the archive!");
    }
}

function writeFirmware(data) {
    document.getElementById('progress_bar').className = 'loading';
    document.getElementById("divBtConn").style.display = 'none';
    document.getElementById("divInfo").style.display = 'block';
    document.getElementById("divFwSelect").style.display = 'none';
    document.getElementById("divFwUpdate").style.display = 'block';
    notifyAppShell('blueretro-ota-verification-start', {
        header: expectedFirmwareHeader,
        fileName: expectedFirmwareFileName,
        debugMode: debugModeToggle.checked,
    });
    otaWriteFirmware(brService, data, setProgress, cancel)
    .then(() => {
        log('Firmware transferred. Waiting for BlueRetro to restart and verify the installed version...');
        notifyAppShell('blueretro-ota-transfer-complete');
    })
    .catch(error => {
        notifyAppShell('blueretro-ota-transfer-failed');
        showFirmwareResult(false, {
            fileName: expectedFirmwareFileName,
            error: error.message || String(error),
            message: 'The firmware transfer did not complete.',
        });
        log('Argh! ' + error);
        document.getElementById("divBtConn").style.display = 'none';
        document.getElementById("divInfo").style.display = 'block';
        document.getElementById("divFwSelect").style.display = 'block';
        document.getElementById("divFwUpdate").style.display = 'none';
    });
}

function showFirmwareResult(success, details = {}) {
    const result = document.getElementById('divFwResult');
    result.className = 'verification-result ' + (success ? 'verification-success' : 'verification-failure');
    result.replaceChildren();

    const heading = document.createElement('h2');
    heading.textContent = details.title || (success ? 'Firmware update verified' : 'Firmware update not verified');
    result.appendChild(heading);

    const message = document.createElement('p');
    message.textContent = details.message || (success
        ? 'The installed version matches the selected firmware. The adapter will be disconnected and forgotten.'
        : 'The adapter will remain connected so you can inspect it or try the update again.');
    result.appendChild(message);

    const detailsList = document.createElement('dl');
    if (details.fileName) {
        detailsList.innerHTML += '<dt>Uploaded file</dt><dd></dd>';
        detailsList.lastElementChild.textContent = details.fileName;
    }
    if (details.runningVersion) {
        detailsList.innerHTML += '<dt>Running version</dt><dd></dd>';
        detailsList.lastElementChild.textContent = details.runningVersion;
    }
    if (details.error) {
        detailsList.innerHTML += '<dt>Reason</dt><dd></dd>';
        detailsList.lastElementChild.textContent = details.error;
    }
    result.appendChild(detailsList);
    result.hidden = false;
    result.scrollIntoView({behavior: 'smooth', block: 'nearest'});
}

window.addEventListener('message', event => {
    if (event.origin !== window.location.origin || !event.data) {
        return;
    }

    if (event.data.type === 'blueretro-ota-verification-result-success') {
        showFirmwareResult(true, event.data);
    }
    else if (event.data.type === 'blueretro-ota-verification-result-failure') {
        showFirmwareResult(false, event.data);
    }
    else if (event.data.type === 'blueretro-ota-debug-result-success') {
        showFirmwareResult(true, {...event.data, title: 'Firmware verified, Debug mode on'});
    }
    else if (event.data.type === 'blueretro-ota-debug-result-failure') {
        showFirmwareResult(false, {...event.data, title: 'Firmware verified, Debug mode not confirmed'});
    }
});

function onDisconnected() {
    log('> Bluetooth Device disconnected');
    cancel = 0;
    document.getElementById("divBtConn").style.display = 'block';
    document.getElementById("divInfo").style.display = 'none';
    document.getElementById("divFwSelect").style.display = 'none';
    document.getElementById("divFwUpdate").style.display = 'none';
}

export function btConn(previousDevice = null) {
    log(previousDevice ? 'Using the connected BlueRetro adapter...' : 'Requesting Bluetooth Device...');
    return getBlueRetroDevice(previousDevice)
    .then(device => {
        log('Connecting to GATT Server...');
        name = device.name;
        bluetoothDevice = device;
        bluetoothDevice.addEventListener('gattserverdisconnected', onDisconnected);
        return bluetoothDevice.gatt.connect();
    })
    .then(server => {
        log('Getting BlueRetro Service...');
        return server.getPrimaryService(brUuid[0]);
    })
    .catch(error => {
        log(error.name);
        throw 'Couldn\'t connect to BlueRetro';
    })
    .then(service => {
        brService = service;
        return getBdAddr(brService);
    })
    .then(value => {
        bdaddr = value;
        return getLatestRelease();
    })
    .then(value => {
        latest_ver = value;
        return getAppVersion(brService);
    })
    .then(value => {
        app_ver = value;
        let app_ver_is_18x = (app_ver.indexOf('v1.8') != -1);
        let app_ver_bogus = (app_ver.indexOf('v') == -1);
        if (app_ver_is_18x || app_ver_bogus) {
            return '';
        }
        else {
            return getStringCmd(brService, cfg_cmd_get_fw_name);
        }
    })
    .catch(error => {
        if (error.name == 'NotFoundError'
          || error.name == 'NotSupportedError') {
            return '';
        }
        throw error;
    })
    .then(value => {
        app_name = value;
        document.getElementById("divInfo").innerHTML = 'Connected to: ' + name + ' (' + bdaddr + ') [' + app_ver + ']';
        try {
            if (app_ver.indexOf(latest_ver) == -1) {
                document.getElementById("divInfo").innerHTML += '<br><br>Download latest FW ' + latest_ver + ' from <a href=\'https://github.com/darthcloud/BlueRetro/releases\'>GitHub</a>';
            }
        }
        catch (e) {
            // Just move on
        }
        cur_fw_is_hw2 = 0;
        let app_ver_is_hw2 = (app_ver.indexOf('hw2') != -1);
        let app_name_is_hw2 = (app_name.indexOf('hw2') != -1);
        log("app_ver_is_hw2: " + app_ver_is_hw2 + " app_name_is_hw2: " + app_name_is_hw2);
        if (app_ver_is_hw2 || app_name_is_hw2) {
            cur_fw_is_hw2 = 1;
        }
        log('Init Cfg DOM...');
        document.getElementById("divBtConn").style.display = 'none';
        document.getElementById("divInfo").style.display = 'block';
        document.getElementById("divFwSelect").style.display = 'block';
        document.getElementById("divFwUpdate").style.display = 'none';
    })
    .catch(error => {
        log('Argh! ' + error);
    });
}
