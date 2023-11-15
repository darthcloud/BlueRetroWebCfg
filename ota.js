// Base on https://www.html5rocks.com/en/tutorials/file/dndfiles//

import { brUuid, cfg_cmd_get_fw_name, cfg_cmd_get_fw_ver } from './utils/constants.js';
import { getLatestRelease } from './utils/getLatestRelease.js';
import { getStringCmd } from './utils/getStringCmd.js';
import { getBdAddr } from './utils/getBdAddr.js';
import { otaWriteFirmware } from './utils/otaWriteFirmware.js';

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
        let new_fw_is_hw2 = (header.indexOf('hw2') != -1);

        log("new_fw_is_hw2: " + new_fw_is_hw2);

        if (cur_fw_is_hw2 == new_fw_is_hw2) {
            writeFirmware(reader.result, 0);
        }
        else {
            log("Hardware and firmware mismatch!");
        }
    }

    let file = document.getElementById("fwFile").value;
    let ext = file.match(/\.[0-9a-z]+$/i);

    if (ext[0] == '.bin') {
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
    otaWriteFirmware(brService, data, setProgress, cancel)
    .catch(error => {
        log('Argh! ' + error);
        document.getElementById("divBtConn").style.display = 'none';
        document.getElementById("divInfo").style.display = 'block';
        document.getElementById("divFwSelect").style.display = 'block';
        document.getElementById("divFwUpdate").style.display = 'none';
    });
}

function onDisconnected() {
    log('> Bluetooth Device disconnected');
    cancel = 0;
    document.getElementById("divBtConn").style.display = 'block';
    document.getElementById("divInfo").style.display = 'none';
    document.getElementById("divFwSelect").style.display = 'none';
    document.getElementById("divFwUpdate").style.display = 'none';
}

export function btConn() {
    log('Requesting Bluetooth Device...');
    navigator.bluetooth.requestDevice(
        {filters: [{namePrefix: 'BlueRetro'}],
        optionalServices: [brUuid[0]]})
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
        return getStringCmd(brService, cfg_cmd_get_fw_ver);
    })
    .then(value => {
        app_ver = value;
        let app_ver_is_18x = (app_ver.indexOf('v1.8') != -1);
        if (app_ver_is_18x) {
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
                document.getElementById("divInfo").innerHTML += '<br><br>Download latest FW ' + latest_ver + ' from <a href=\'https://darthcloud.itch.io/blueretro\'>itch.io</a>';
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
