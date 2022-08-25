// Base on https://www.html5rocks.com/en/tutorials/file/dndfiles//

import { brUuid } from './utils/constants.js';
import { getLatestRelease } from './utils/getLatestRelease.js';
import { getAppVersion } from './utils/getAppVersion.js';
import { getBdAddr } from './utils/getBdAddr.js';
import { setDeepSleep } from './utils/setDeepSleep.js';
import { setReset } from './utils/setReset.js';

var bluetoothDevice;
var bdaddr;
var app_ver;
var latest_ver;
var name;
let brService = null;

function onDisconnected() {
    log('> Bluetooth Device disconnected');
    document.getElementById("divBtConn").style.display = 'block';
    document.getElementById("divInfo").style.display = 'none';
    document.getElementById("divSleep").style.display = 'none';
    document.getElementById("divReset").style.display = 'none';
}

export function setDeepSleepEvent() {
    setDeepSleep(brService);
}

export function setResetEvent() {
    setReset(brService);
}

export function btConn() {
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
        log('getBdAddr ' + service);
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
        document.getElementById("divInfo").innerHTML = 'Connected to: ' + name + ' (' + bdaddr + ') [' + app_ver + ']';
        if (app_ver.indexOf(latest_ver) == -1) {
            document.getElementById("divInfo").innerHTML += '<br><br>Download latest FW ' + latest_ver + ' from <a href=\'https://darthcloud.itch.io/blueretro\'>itch.io</a>';
        }
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