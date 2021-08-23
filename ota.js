// Base on https://www.html5rocks.com/en/tutorials/file/dndfiles//

var brUuid = [
    '56830f56-5180-fab0-314b-2fa176799a00',
    '56830f56-5180-fab0-314b-2fa176799a01',
    '56830f56-5180-fab0-314b-2fa176799a02',
    '56830f56-5180-fab0-314b-2fa176799a03',
    '56830f56-5180-fab0-314b-2fa176799a04',
    '56830f56-5180-fab0-314b-2fa176799a05',
    '56830f56-5180-fab0-314b-2fa176799a06',
    '56830f56-5180-fab0-314b-2fa176799a07',
    '56830f56-5180-fab0-314b-2fa176799a08',
    '56830f56-5180-fab0-314b-2fa176799a09',
];

const mtu = 244;
const ota_start = 0xA5;
const ota_abort = 0xDE;
const ota_end = 0x5A;

var bluetoothDevice;
let brService = null;
var reader;
var progress = document.querySelector('.percent');
var start;
var end;
var cancel = 0;

function getAppVersion() {
    return new Promise(function(resolve, reject) {
        log('Get Api version CHRC...');
        brService.getCharacteristic(brUuid[9])
        .then(chrc => {
            log('Reading App version...');
            return chrc.readValue();
        })
        .then(value => {
            var enc = new TextDecoder("utf-8");
            log('App version: ' + enc.decode(value));
            resolve();
        })
        .catch(error => {
            resolve();
        });
    });
}

function abortFwUpdate() {
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

function updateProgress(total, loaded) {
    var percentLoaded = Math.round((loaded / total) * 100);
    // Increase the progress bar length.
    if (percentLoaded < 100) {
        progress.style.width = percentLoaded + '%';
        progress.textContent = percentLoaded + '%';
    }
}

function firmwareUpdate(evt) {
    // Reset progress indicator on new file selection.
    progress.style.width = '0%';
    progress.textContent = '0%';

    reader = new FileReader();
    reader.onerror = errorHandler;
    reader.onabort = function(e) {
        log('File read cancelled');
    };
    reader.onload = function(e) {
        writeFirmware(reader.result, 0);
    }

    // Read in the image file as a binary string.
    reader.readAsArrayBuffer(document.getElementById("fwFile").files[0]);
}

function writeFwRecursive(chrc, data, offset) {
    return new Promise(function(resolve, reject) {
        if (cancel == 1) {
            throw 'Cancelled';
        }
        updateProgress(data.byteLength, offset);
        var tmpViewSize = data.byteLength - offset;
        if (tmpViewSize > mtu) {
            tmpViewSize = mtu;
        }
        var tmpView = new DataView(data, offset, tmpViewSize);
        chrc.writeValue(tmpView)
        .then(_ => {
            offset += Number(mtu);
            if (offset < data.byteLength) {
                resolve(writeFwRecursive(chrc, data, offset));
            }
            else {
                end = performance.now();
                progress.style.width = '100%';
                progress.textContent = '100%';
                log('FW upload done. Took: '  + (end - start)/1000 + ' sec');
                resolve();
            }
        })
        .catch(error => {
            reject(error);
        });
    });
}

function writeFirmware(data) {
    var cmd = new Uint8Array(1);
    let ctrl_chrc = null;
    document.getElementById('progress_bar').className = 'loading';
    document.getElementById("divBtConn").style.display = 'none';
    document.getElementById("divFwSelect").style.display = 'none';
    document.getElementById("divFwUpdate").style.display = 'block';
    brService.getCharacteristic(brUuid[7])
    .then(chrc => {
        ctrl_chrc = chrc;
        cmd[0] = ota_start;
        return ctrl_chrc.writeValue(cmd)
    })
    .then(_ => {
        return brService.getCharacteristic(brUuid[8])
    })
    .then(chrc => {
        start = performance.now();
        return writeFwRecursive(chrc, data, 0);
    })
    .then(_ => {
        cmd[0] = ota_end;
        return ctrl_chrc.writeValue(cmd)
    })
    .catch(error => {
        log('Argh! ' + error);
        document.getElementById("divBtConn").style.display = 'none';
        document.getElementById("divFwSelect").style.display = 'block';
        document.getElementById("divFwUpdate").style.display = 'none';
        cancel = 0;
        cmd[0] = ota_abort;
        return ctrl_chrc.writeValue(cmd)
    });
}

function onDisconnected() {
    log('> Bluetooth Device disconnected');
    cancel = 0;
    document.getElementById("divBtConn").style.display = 'block';
    document.getElementById("divFwSelect").style.display = 'none';
    document.getElementById("divFwUpdate").style.display = 'none';
}

function btConn() {
    log('Requesting Bluetooth Device...');
    navigator.bluetooth.requestDevice(
        {filters: [{name: 'BlueRetro'}],
        optionalServices: [brUuid[0]]})
    .then(device => {
        log('Connecting to GATT Server...');
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
        return getAppVersion();
    })
    .then(_ => {
        log('Init Cfg DOM...');
        document.getElementById("divBtConn").style.display = 'none';
        document.getElementById("divFwSelect").style.display = 'block';
        document.getElementById("divFwUpdate").style.display = 'none';
    })
    .catch(error => {
        log('Argh! ' + error);
    });
}
