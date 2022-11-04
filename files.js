// Base on https://www.html5rocks.com/en/tutorials/file/dndfiles//

import { brUuid, cfg_cmd_get_file, cfg_cmd_open_dir, cfg_cmd_close_dir, cfg_cmd_del_file } from './utils/constants.js';
import { getLatestRelease } from './utils/getLatestRelease.js';
import { getAppVersion } from './utils/getAppVersion.js';
import { getBdAddr } from './utils/getBdAddr.js';

var bluetoothDevice;
var bdaddr = '';
var app_ver = '';
var latest_ver = '';
var name = '';
let brService = null;
let fileList = [];

function readFileRecursive(chrc) {
    return new Promise(function (resolve, reject) {
      chrc.readValue()
        .then((value) => {
          if (value.byteLength > 0) {
            let enc = new TextDecoder("utf-8");
            let filename = enc.decode(value);
            fileList.push(filename);
            resolve(readFileRecursive(chrc));
          }
          else {
            resolve();
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

function getFiles() {
    return new Promise((resolve, reject) => {
        var cmd = new Uint8Array(1);
        var cmd_chrc;
        brService.getCharacteristic(brUuid[7])
        .then((chrc) => {
            cmd_chrc = chrc;
            cmd[0] = cfg_cmd_open_dir;
            return cmd_chrc.writeValue(cmd);
        })
        .then((_) => {
            cmd[0] = cfg_cmd_get_file;
            return cmd_chrc.writeValue(cmd);
        })
        .then((_) => {
            return readFileRecursive(cmd_chrc);
        })
        .then((_) => {
            cmd[0] = cfg_cmd_close_dir;
            return cmd_chrc.writeValue(cmd);
        })
        .then((_) => {
            resolve();
        })
        .catch((error) => {
            reject(error);
        });
    });
}

function deleteFile() {
    this.parentNode.remove();
}

function initFile() {
    var divFile = document.getElementById("divFile");

    divFile.innerHTML = '';

    let header = document.createElement("h2");
    header.style.margin = 0;
    header.innerText = 'Files list';

    divFile.appendChild(header);

    for (let i = 0; i < fileList.length; i++) {
        let div = document.createElement("div");
        let button = document.createElement("button");
        button.id = i;
        button.innerText = 'Delete'
        button.addEventListener('click', deleteFile)
        div.append(button);
        div.append(' ' + fileList[i]);
        divFile.append(div);
    }
}

function onDisconnected() {
    log('> Bluetooth Device disconnected');
    document.getElementById("divBtConn").style.display = 'block';
    document.getElementById("divInfo").style.display = 'none';
    document.getElementById("divFile").style.display = 'none';
}

export function setDeepSleepEvent() {
    setDeepSleep(brService);
}

export function setResetEvent() {
    setReset(brService);
}

export function setFactoryResetEvent() {
    setFactoryReset(brService);
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
    .catch(error => {
        if (error.name == 'NotFoundError'
          || error.name == 'NotSupportedError') {
            return '';
        }
        throw error;
    })
    .then(value => {
        app_ver = value;
        return getFiles();
    })
    .then(_ => {
        initFile();
        document.getElementById("divInfo").innerHTML = 'Connected to: ' + name + ' (' + bdaddr + ') [' + app_ver + ']';
        if (app_ver.indexOf(latest_ver) == -1) {
            document.getElementById("divInfo").innerHTML += '<br><br>Download latest FW ' + latest_ver + ' from <a href=\'https://darthcloud.itch.io/blueretro\'>itch.io</a>';
        }
        log('Init Cfg DOM...');
        document.getElementById("divBtConn").style.display = 'none';
        document.getElementById("divInfo").style.display = 'block';
        document.getElementById("divFile").style.display = 'block';
    })
    .catch(error => {
        log('Argh! ' + error);
    });
}
