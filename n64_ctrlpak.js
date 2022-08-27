// Base on https://www.html5rocks.com/en/tutorials/file/dndfiles//

import { brUuid, pakSize } from './utils/constants.js';
import { downloadFile } from './utils/downloadFile.js';
import { getLatestRelease } from './utils/getLatestRelease.js';
import { getAppVersion } from './utils/getAppVersion.js';
import { getBdAddr } from './utils/getBdAddr.js';
import { n64WriteFile } from './utils/n64WriteFile.js';
import { n64ReadFile } from './utils/n64ReadFile.js';

var bluetoothDevice;
let brService = null;
var reader;
var progress = document.querySelector('.percent');
var cancel = 0;
var bdaddr;
var app_ver;
var latest_ver;
var name;

export function abortFileTransfer() {
    cancel = 1;
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

function setProgress(percent) {
    progress.style.width = percent + '%';
    progress.textContent = percent + '%';
}

export function pakRead(evt) {
    // Reset progress indicator on new file selection.
    progress.style.width = '0%';
    progress.textContent = '0%';

    readFile()
    .then(value => {
        downloadFile(new Blob([value.buffer], {type: "application/mpk"}),
            'ctrl_pak' + eval(Number(document.getElementById("pakSelect").value) + 1) + '.mpk');
        document.getElementById("divBtConn").style.display = 'none';
        document.getElementById("divInfo").style.display = 'block';
        document.getElementById("divFileSelect").style.display = 'block';
        document.getElementById("divFileTransfer").style.display = 'none';
    })
    .catch(error => {
        log('Argh! ' + error);
        document.getElementById("divBtConn").style.display = 'none';
        document.getElementById("divInfo").style.display = 'block';
        document.getElementById("divFileSelect").style.display = 'block';
        document.getElementById("divFileTransfer").style.display = 'none';
        cancel = 0;
    });
}

export function pakWrite(evt) {
    // Reset progress indicator on new file selection.
    progress.style.width = '0%';
    progress.textContent = '0%';

    reader = new FileReader();
    reader.onerror = errorHandler;
    reader.onabort = function(e) {
        log('File read cancelled');
    };
    reader.onload = function(e) {
        writeFile(reader.result.slice(0, pakSize));
    }

    // Read in the image file as a binary string.
    reader.readAsArrayBuffer(document.getElementById("pakFile").files[0]);
}

// Init function taken from MPKEdit by bryc:
// https://github.com/bryc/mempak/blob/dbd78db6ac55575838c6e107e5ea1e568981edc4/js/state.js#L8
export function pakFormat(evt) {
        function writeAt(ofs) {for(let i = 0; i < 32; i++) data[ofs + i] = block[i];}

        const data = new Uint8Array(32768), block = new Uint8Array(32);

        // generate id block
        block[1]  = 0 | Math.random() * 256 & 0x3F;
        block[5]  = 0 | Math.random() * 256 & 0x7;
        block[6]  = 0 | Math.random() * 256;
        block[7]  = 0 | Math.random() * 256;
        block[8]  = 0 | Math.random() * 256 & 0xF;
        block[9]  = 0 | Math.random() * 256;
        block[10] = 0 | Math.random() * 256;
        block[11] = 0 | Math.random() * 256;
        block[25] = 0x01; // device bit
        block[26] = 0x01; // bank size int (must be exactly '01')

        // calculate pakId checksum
        let sumA = 0, sumB = 0xFFF2;
        for(let i = 0; i < 28; i += 2)
            sumA += (block[i] << 8) + block[i + 1], sumA &= 0xFFFF;
        sumB -= sumA;
        // store checksums
        block[28] = sumA >> 8;
        block[29] = sumA & 0xFF;
        block[30] = sumB >> 8;
        block[31] = sumB & 0xFF;

        // write checksum block to multiple sections in header page
        writeAt(32);
        writeAt(96);
        writeAt(128);
        writeAt(192);

        // init IndexTable and backup (plus checksums)
        for(let i = 5; i < 128; i++) {
            data[256 + (i * 2) + 1] = 3;
            data[512 + (i * 2) + 1] = 3;
        }
        data[257] = 0x71;
        data[513] = 0x71;

        //for(let i = 0; i < 32; i++) data[i] = i; // write label - needs to be verified
        //data[0] = 0x81; // libultra's 81 mark

        writeFile(data.buffer);
}

function readFile() {
    return new Promise(function(resolve, reject) {
        let pak = Number(document.getElementById("pakSelect").value);
        document.getElementById('progress_bar').className = 'loading';
        document.getElementById("divBtConn").style.display = 'none';
        document.getElementById("divInfo").style.display = 'block';
        document.getElementById("divFileSelect").style.display = 'none';
        document.getElementById("divFileTransfer").style.display = 'block';
        n64ReadFile(brService, pak, setProgress, cancel)
        .then(data => {
            resolve(data);
        })
        .catch(error => {
            reject(error);
        });
    });
}

function writeFile(data) {
    let pak = Number(document.getElementById("pakSelect").value);
    document.getElementById('progress_bar').className = 'loading';
    document.getElementById("divBtConn").style.display = 'none';
    document.getElementById("divInfo").style.display = 'block';
    document.getElementById("divFileSelect").style.display = 'none';
    document.getElementById("divFileTransfer").style.display = 'block';
    n64WriteFile(brService, data, pak, setProgress, cancel)
    .then(_ => {
        document.getElementById("divBtConn").style.display = 'none';
        document.getElementById("divInfo").style.display = 'block';
        document.getElementById("divFileSelect").style.display = 'block';
        document.getElementById("divFileTransfer").style.display = 'none';
    })
    .catch(error => {
        log('Argh! ' + error);
        document.getElementById("divBtConn").style.display = 'none';
        document.getElementById("divInfo").style.display = 'block';
        document.getElementById("divFileSelect").style.display = 'block';
        document.getElementById("divFileTransfer").style.display = 'none';
        cancel = 0;
    });
}

function onDisconnected() {
    log('> Bluetooth Device disconnected');
    cancel = 0;
    document.getElementById("divBtConn").style.display = 'block';
    document.getElementById("divInfo").style.display = 'none';
    document.getElementById("divFileSelect").style.display = 'none';
    document.getElementById("divFileTransfer").style.display = 'none';
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
    .then(service => {
        brService = service;
        return getBdAddr(brService);
    })
    .then(value => {
        bdaddr = value;
        return getLatestRelease();
    })
    .then(value => {
        latest_ver = value
        return getAppVersion(brService);
    })
    .then(value => {
        app_ver = value;
        document.getElementById("divInfo").innerHTML = 'Connected to: ' + name + ' (' + bdaddr + ') [' + app_ver + ']';
        if (app_ver.indexOf(latest_ver) == -1) {
            document.getElementById("divInfo").innerHTML += '<br><br>Download latest FW ' + latest_ver + ' from <a href=\'https://darthcloud.itch.io/blueretro\'>itch.io</a>';
        }
        log('Init Cfg DOM...');
        document.getElementById("divBtConn").style.display = 'none';
        document.getElementById("divInfo").style.display = 'block';
        document.getElementById("divFileSelect").style.display = 'block';
        document.getElementById("divFileTransfer").style.display = 'none';
    })
    .catch(error => {
        log('Argh! ' + error);
    });
}
