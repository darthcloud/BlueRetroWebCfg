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
    '56830f56-5180-fab0-314b-2fa176799a0a',
    '56830f56-5180-fab0-314b-2fa176799a0b',
];

const mtu = 244;
const block = 4096;
const pak_size = 32 * 1024;

var bluetoothDevice;
let brService = null;
var reader;
var progress = document.querySelector('.percent');
var start;
var end;
var cancel = 0;
var tmpViewSize = 0;

// Source: https://newbedev.com/saving-binary-data-as-file-using-javascript-from-a-browser
function downloadFile(blob, filename) {
    var url = window.URL.createObjectURL(blob);

    var a = document.createElement("a");
    a.style = "display: none";
    a.href = url;
    a.download = filename;

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);

    // On Edge, revokeObjectURL should be called only after
    // a.click() has completed, atleast on EdgeHTML 15.15048
    setTimeout(function() {
        window.URL.revokeObjectURL(url);
    }, 1000);
}

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

function abortFileTransfer() {
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

function transferProgress(total, loaded) {
    var percentLoaded = Math.round((loaded / total) * 100);
    // Increase the progress bar length.
    if (percentLoaded < 100) {
        progress.style.width = percentLoaded + '%';
        progress.textContent = percentLoaded + '%';
    }
}

function pakRead(evt) {
    // Reset progress indicator on new file selection.
    progress.style.width = '0%';
    progress.textContent = '0%';

    var data = new Uint8Array(pak_size);
    readFile(data)
    .then(value => {
        downloadFile(new Blob([value.buffer], {type: "application/mpk"}),
            'ctrl_pak' + eval(Number(document.getElementById("pakSelect").value) + 1) + '.mpk');
        document.getElementById("divBtConn").style.display = 'none';
        document.getElementById("divFileSelect").style.display = 'block';
        document.getElementById("divFileTransfer").style.display = 'none';
    })
    .catch(error => {
        log('Argh! ' + error);
        document.getElementById("divBtConn").style.display = 'none';
        document.getElementById("divFileSelect").style.display = 'block';
        document.getElementById("divFileTransfer").style.display = 'none';
        cancel = 0;
    });
}

function pakWrite(evt) {
    // Reset progress indicator on new file selection.
    progress.style.width = '0%';
    progress.textContent = '0%';

    reader = new FileReader();
    reader.onerror = errorHandler;
    reader.onabort = function(e) {
        log('File read cancelled');
    };
    reader.onload = function(e) {
        writeFile(reader.result.slice(0, pak_size));
    }

    // Read in the image file as a binary string.
    reader.readAsArrayBuffer(document.getElementById("pakFile").files[0]);
}

// Init function taken from MPKEdit by bryc:
// https://github.com/bryc/mempak/blob/dbd78db6ac55575838c6e107e5ea1e568981edc4/js/state.js#L8
function pakFormat(evt) {
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

function readRecursive(chrc, data, offset) {
    return new Promise(function(resolve, reject) {
        if (cancel == 1) {
            throw 'Cancelled';
        }
        transferProgress(pak_size, offset);
        chrc.readValue()
        .then(value => {
            var tmp = new Uint8Array(value.buffer);
            data.set(tmp, offset);
            offset += value.byteLength;
            if (offset < (pak_size)) {
                resolve(readRecursive(chrc, data, offset));
            }
            else {
                end = performance.now();
                progress.style.width = '100%';
                progress.textContent = '100%';
                log('File download done. Took: '  + (end - start)/1000 + ' sec');
                resolve(data);
            }
        })
        .catch(error => {
            reject(error);
        });
    });
}

function writeRecursive(chrc, data, offset) {
    return new Promise(function(resolve, reject) {
        var curBlock = ~~(offset / block) + 1;
        if (cancel == 1) {
            throw 'Cancelled';
        }
        transferProgress(data.byteLength, offset);
        tmpViewSize = (curBlock * block) - offset;
        if (tmpViewSize > mtu) {
            tmpViewSize = mtu;
        }
        var tmpView = new DataView(data, offset, tmpViewSize);
        chrc.writeValue(tmpView)
        .then(_ => {
            offset += tmpViewSize;
            if (offset < data.byteLength) {
                resolve(writeRecursive(chrc, data, offset));
            }
            else {
                end = performance.now();
                progress.style.width = '100%';
                progress.textContent = '100%';
                log('File upload done. Took: '  + (end - start)/1000 + ' sec');
                resolve();
            }
        })
        .catch(error => {
            reject(error);
        });
    });
}

function readFile(data) {
    return new Promise(function(resolve, reject) {
        var offset = new Uint32Array(1);
        let ctrl_chrc = null;
        document.getElementById('progress_bar').className = 'loading';
        document.getElementById("divBtConn").style.display = 'none';
        document.getElementById("divFileSelect").style.display = 'none';
        document.getElementById("divFileTransfer").style.display = 'block';
        brService.getCharacteristic(brUuid[10])
        .then(chrc => {
            ctrl_chrc = chrc;
            offset[0] = Number(document.getElementById("pakSelect").value) * pak_size;
            return ctrl_chrc.writeValue(offset)
        })
        .then(_ => {
            return brService.getCharacteristic(brUuid[11])
        })
        .then(chrc => {
            start = performance.now();
            return readRecursive(chrc, data, 0);
        })
        .then(_ => {
            offset[0] = 0;
            return ctrl_chrc.writeValue(offset)
        })
        .then(_ => {
            resolve(data);
        })
        .catch(error => {
            reject(error);
        });
    });
}

function writeFile(data) {
    var offset = new Uint32Array(1);
    let ctrl_chrc = null;
    document.getElementById('progress_bar').className = 'loading';
    document.getElementById("divBtConn").style.display = 'none';
    document.getElementById("divFileSelect").style.display = 'none';
    document.getElementById("divFileTransfer").style.display = 'block';
    brService.getCharacteristic(brUuid[10])
    .then(chrc => {
        ctrl_chrc = chrc;
        offset[0] = Number(document.getElementById("pakSelect").value) * pak_size;
        return ctrl_chrc.writeValue(offset)
    })
    .then(_ => {
        return brService.getCharacteristic(brUuid[11])
    })
    .then(chrc => {
        start = performance.now();
        return writeRecursive(chrc, data, 0);
    })
    .then(_ => {
        offset[0] = 0;
        return ctrl_chrc.writeValue(offset)
    })
    .then(_ => {
        document.getElementById("divBtConn").style.display = 'none';
        document.getElementById("divFileSelect").style.display = 'block';
        document.getElementById("divFileTransfer").style.display = 'none';
    })
    .catch(error => {
        log('Argh! ' + error);
        document.getElementById("divBtConn").style.display = 'none';
        document.getElementById("divFileSelect").style.display = 'block';
        document.getElementById("divFileTransfer").style.display = 'none';
        cancel = 0;
    });
}

function onDisconnected() {
    log('> Bluetooth Device disconnected');
    cancel = 0;
    document.getElementById("divBtConn").style.display = 'block';
    document.getElementById("divFileSelect").style.display = 'none';
    document.getElementById("divFileTransfer").style.display = 'none';
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
        document.getElementById("divFileSelect").style.display = 'block';
        document.getElementById("divFileTransfer").style.display = 'none';
    })
    .catch(error => {
        log('Argh! ' + error);
    });
}
