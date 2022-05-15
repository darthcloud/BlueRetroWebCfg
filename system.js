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
    '56830f56-5180-fab0-314b-2fa176799a0c',
];

const mtu = 244;
const sys_deep_sleep = 0x37;
const sys_reset = 0x38;

var bluetoothDevice;
var bdaddr;
var app_ver;
var name;
let brService = null;

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
            app_ver = enc.decode(value);
            log('App version: ' + app_ver);
            resolve();
        })
        .catch(error => {
            resolve();
        });
    });
}

function getBdAddr() {
    return new Promise(function(resolve, reject) {
        log('Get BD_ADDR CHRC...');
        brService.getCharacteristic(brUuid[12])
        .then(chrc => {
            log('Reading BD_ADDR...');
            return chrc.readValue();
        })
        .then(value => {
            bdaddr = value.getUint8(5).toString(16).padStart(2, '0') + ':'
                    + value.getUint8(4).toString(16).padStart(2, '0') + ':'
                    + value.getUint8(3).toString(16).padStart(2, '0') + ':'
                    + value.getUint8(2).toString(16).padStart(2, '0') + ':'
                    + value.getUint8(1).toString(16).padStart(2, '0') + ':'
                    + value.getUint8(0).toString(16).padStart(2, '0');
            log('BD_ADDR: ' + bdaddr);
            resolve();
        })
        .catch(error => {
            resolve();
        });
    });
}

function setDeepSleep(evt) {
    var cmd = new Uint8Array(1);
    let ctrl_chrc = null;
    brService.getCharacteristic(brUuid[7])
    .then(chrc => {
        ctrl_chrc = chrc;
        cmd[0] = sys_deep_sleep;
        return ctrl_chrc.writeValue(cmd)
    })
    .catch(error => {
        log('Argh! ' + error);
        return ctrl_chrc.writeValue(cmd)
    });
}

function setReset(evt) {
    var cmd = new Uint8Array(1);
    let ctrl_chrc = null;
    brService.getCharacteristic(brUuid[7])
    .then(chrc => {
        ctrl_chrc = chrc;
        cmd[0] = sys_reset;
        return ctrl_chrc.writeValue(cmd)
    })
    .catch(error => {
        log('Argh! ' + error);
        return ctrl_chrc.writeValue(cmd)
    });
}

function onDisconnected() {
    log('> Bluetooth Device disconnected');
    cancel = 0;
    document.getElementById("divBtConn").style.display = 'block';
    document.getElementById("divInfo").style.display = 'none';
    document.getElementById("divSleep").style.display = 'none';
    document.getElementById("divReset").style.display = 'none';
}

function btConn() {
    log('Requesting Bluetooth Device...');
    navigator.bluetooth.requestDevice(
        {filters: [{namePrefix: 'BlueRetro'}],
        optionalServices: [brUuid[0]]})
    .then(device => {
        log('Connecting to GATT Server...');
        log('Device name: ' + device.name);
        log('Device id: ' + device.id);
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
        return getBdAddr();
    })
    .then(_ => {
        return getAppVersion();
    })
    .then(_ => {
        document.getElementById("divInfo").innerHTML = 'Connected to: ' + name + ' (' + bdaddr + ') [' + app_ver + ']';
        log('Init Cfg DOM...');
        document.getElementById("divBtConn").style.display = 'none';
        document.getElementById("divInfo").style.display = 'block';
        document.getElementById("divSleep").style.display = 'block';
        document.getElementById("divReset").style.display = 'block';
    })
    .catch(error => {
        log('Argh! ' + error);
    });
}
