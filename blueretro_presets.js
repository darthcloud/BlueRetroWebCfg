var brUuid = [
    '56830f56-5180-fab0-314b-2fa176799a00',
    '56830f56-5180-fab0-314b-2fa176799a01',
    '56830f56-5180-fab0-314b-2fa176799a02',
    '56830f56-5180-fab0-314b-2fa176799a03',
    '56830f56-5180-fab0-314b-2fa176799a04',
    '56830f56-5180-fab0-314b-2fa176799a05',
];

const btn = {
    "PAD_LX_LEFT":0,
    "PAD_LX_RIGHT":1,
    "PAD_LY_DOWN":2,
    "PAD_LY_UP":3,
    "PAD_RX_LEFT":4,
    "PAD_RX_RIGHT":5,
    "PAD_RY_DOWN":6,
    "PAD_RY_UP":7,
    "PAD_LD_LEFT":8,
    "PAD_LD_RIGHT":9,
    "PAD_LD_DOWN":10,
    "PAD_LD_UP":11,
    "PAD_RD_LEFT":12,
    "PAD_RD_RIGHT":13,
    "PAD_RD_DOWN":14,
    "PAD_RD_UP":15,
    "PAD_RB_LEFT":16,
    "PAD_RB_RIGHT":17,
    "PAD_RB_DOWN":18,
    "PAD_RB_UP":19,
    "PAD_MM":20,
    "PAD_MS":21,
    "PAD_MT":22,
    "PAD_MQ":23,
    "PAD_LM":24,
    "PAD_LS":25,
    "PAD_LT":26,
    "PAD_LJ":27,
    "PAD_RM":28,
    "PAD_RS":29,
    "PAD_RT":30,
    "PAD_RJ":31,
    "MOUSE_X_LEFT":4,
    "MOUSE_X_RIGHT":5,
    "MOUSE_Y_DOWN":6,
    "MOUSE_Y_UP":7,
    "MOUSE_WX_LEFT":12,
    "MOUSE_WX_RIGHT":13,
    "MOUSE_WY_DOWN":14,
    "MOUSE_WY_UP":15,
    "MOUSE_LEFT":28,
    "MOUSE_MIDDLE":27,
    "MOUSE_RIGHT":24,
    "MOUSE_4":16,
    "MOUSE_5":17,
    "MOUSE_6":18,
    "MOUSE_7":19,
    "MOUSE_8":29,
    "KB_A":0,
    "KB_D":1,
    "KB_S":2,
    "KB_W":3,
    "KB_LEFT":8,
    "KB_RIGHT":9,
    "KB_DOWN":10,
    "KB_UP":11,
    "KB_Q":16,
    "KB_R":17,
    "KB_E":18,
    "KB_F":19,
    "KB_ESC":20,
    "KB_ENTER":21,
    "KB_LWIN":22,
    "KB_HASH":23,
    "KB_Z":25,
    "KB_LCTRL":26,
    "KB_X":29,
    "KB_LSHIFT":30,
    "KB_SPACE":31,
    "KB_B":32,
    "KB_C":33,
    "KB_G":34,
    "KB_H":35,
    "KB_I":36,
    "KB_J":37,
    "KB_K":38,
    "KB_L":39,
    "KB_M":40,
    "KB_N":41,
    "KB_O":42,
    "KB_P":43,
    "KB_T":44,
    "KB_U":45,
    "KB_V":46,
    "KB_Y":47,
    "KB_1":48,
    "KB_2":49,
    "KB_3":50,
    "KB_4":51,
    "KB_5":52,
    "KB_6":53,
    "KB_7":54,
    "KB_8":55,
    "KB_9":56,
    "KB_0":57,
    "KB_BACKSPACE":58,
    "KB_TAB":59,
    "KB_MINUS":60,
    "KB_EQUAL":61,
    "KB_LEFTBRACE":62,
    "KB_RIGHTBRACE":63,
    "KB_BACKSLASH":64,
    "KB_SEMICOLON":65,
    "KB_APOSTROPHE":66,
    "KB_GRAVE":67,
    "KB_COMMA":68,
    "KB_DOT":69,
    "KB_SLASH":70,
    "KB_CAPSLOCK":71,
    "KB_F1":72,
    "KB_F2":73,
    "KB_F3":74,
    "KB_F4":75,
    "KB_F5":76,
    "KB_F6":77,
    "KB_F7":78,
    "KB_F8":79,
    "KB_F9":80,
    "KB_F10":81,
    "KB_F11":82,
    "KB_F12":83,
    "KB_PSCREEN":84,
    "KB_SCROLL":85,
    "KB_PAUSE":86,
    "KB_INSERT":87,
    "KB_HOME":88,
    "KB_PAGEUP":89,
    "KB_DEL":90,
    "KB_END":91,
    "KB_PAGE_DOWN":92,
    "KB_NUMLOCK":93,
    "KB_KP_DIV":94,
    "KB_KP_MULTI":95,
    "KB_KP_MINUS":96,
    "KB_KP_PLUS":97,
    "KB_KP_ENTER":98,
    "KB_KP_1":99,
    "KB_KP_2":100,
    "KB_KP_3":101,
    "KB_KP_4":102,
    "KB_KP_5":103,
    "KB_KP_6":104,
    "KB_KP_7":105,
    "KB_KP_8":106,
    "KB_KP_9":107,
    "KB_KP_0":108,
    "KB_KP_DOT":109,
    "KB_LALT":110,
    "KB_RCTRL":111,
    "KB_RSHIFT":112,
    "KB_RALT":113,
    "KB_RWIN":114,
};

const maxMainInput = 12;
const maxSubInput = 4;
const maxOutput = 12;
const maxMax = 255;
const maxThres = 100;
const maxTurbo = 16;

var presets = new Array();
var bluetoothDevice;
var maxMapping = 255;
var nbMapping = 1;
let brService = null;
var mappingElement = null;
let inputChrc = null;
var pageInit = 0;
var consoles = []

function initInputSelect() {
    //push all console names from JSON files
    for (var i = 0; i < presets.length; i++) {
        consoles.push(presets[i].console)
    }
    //filter out non-unique items
    consoles = consoles.filter(onlyUnique)
    //set placeholder description
    document.getElementById("desc").textContent = "Select a system and then preset";
    var div = document.createElement("outputandconsole");
    var main = document.createElement("select");

    for (var i = 0; i < maxMainInput; i++) {
        var option  = document.createElement("option");
        option.value = i;
        option.text = "Output " + (i + 1);
        main.add(option);
    }
    main.id = "inputSelect";
    div.appendChild(main);

    var main = document.createElement("select");
    //add placeholder option
    var option  = document.createElement("option");
        option.value = -1;
        option.text = "All";
        main.add(option);
    //add console filter options    
    for (var i = 0; i < consoles.length; i++) {
        var option  = document.createElement("option");
        option.value = i;
        option.text = consoles[i];
        main.add(option);
    }
    main.id = "consoleName";
    main.addEventListener("change", chooseConsole);
    div.appendChild(main);
    //add preset drop down menu
    var main = document.createElement("select");
    main.id = "presetsName";
    main.addEventListener("change", selectInput);
    div.appendChild(main);

    var divInputCfg = document.getElementById("divInputCfg");
    divInputCfg.appendChild(div);
    //populate preset list with all options by default
    populateConsolePresets(undefined);
}

function initOutputMapping() {
    /* Save */
    divSave = document.createElement("saveButton");

    var btn = document.createElement("button");
    btn.id = "inputSave";
    btn.innerText = 'Save';
    btn.addEventListener("click", saveInput);
    divSave.appendChild(btn);
    divSave.setAttribute("style", "margin-top:1em;");

    var div = document.createElement("div");
    div.id = "inputSaveText";
    div.setAttribute("style", "display:none;margin-top:1em;");
    var p = document.createElement("p");
    p.setAttribute("style", "font-style:italic;font-size:small;color:green;");
    p.innerText = "Config saved, mapping changes take effect immediately.";

    div.appendChild(p);
    divSave.appendChild(div);

    /* Append first cfg */
    divMappingGrp = document.createElement("save");
    var divInputCfg = document.getElementById("divInputCfg");
    divMappingGrp.appendChild(divSave);
    divInputCfg.appendChild(divMappingGrp);
}

function fetchMap(presets, files, idx) {
    return new Promise(function(resolve, reject) {
        fetch("map/" + files[idx].name)
        .then(rsp => {
            return rsp.json();
        })
        .then(data => {
            presets.push(data);
            if (++idx < files.length) {
                resolve(fetchMap(presets, files, idx));
            }
            else {
                resolve(presets);
            }
        })
        .catch(error => {
            reject(error);
        });
    });
}

function getMapList(url) {
    return new Promise(function(resolve, reject) {
        fetch(url)
        .then(rsp => {
            return rsp.json();
        })
        .then(data => {
            resolve(data);
        })
        .catch(error => {
            reject(error);
        });
    });
}

//standard function to filter out non-unique items from an array
function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function initBlueRetroCfg() {
    getMapList('https://api.github.com/repos/darthcloud/BlueRetroWebCfg/contents/map/')
    .then(files => {
        return fetchMap(presets, files, 0);
    })
    .then(_ => {
        initInputSelect();
        initOutputMapping();
        pageInit = 1;
    })
    .catch(error => {
        log('Argh! ' + error);
    });
}

function writeWriteRecursive(cfg, inputCtrl, ctrl_chrc, data_chrc) {
    return new Promise(function(resolve, reject) {
        log('Set Input Ctrl CHRC... ' + inputCtrl[1]);
        ctrl_chrc.writeValue(inputCtrl)
        .then(_ => {
            log('Writing Input Data CHRC...');
            var tmpViewSize = cfg.byteLength - inputCtrl[1];
            if (tmpViewSize > 512) {
                tmpViewSize = 512;
            }
            var tmpView = new DataView(cfg.buffer, inputCtrl[1], tmpViewSize);
            return data_chrc.writeValue(tmpView);
        })
        .then(_ => {
            log('Input Data Written');
            inputCtrl[1] += Number(512);
            if (inputCtrl[1] < cfg.byteLength) {
                resolve(writeWriteRecursive(cfg, inputCtrl, ctrl_chrc, data_chrc));
            }
            else {
                resolve();
            }
        })
        .catch(error => {
            reject(error);
        });
    });
}

function writeInputCfg(cfgId, cfg) {
    return new Promise(function(resolve, reject) {
        let ctrl_chrc = null;
        let data_chrc = null;
        brService.getCharacteristic(brUuid[4])
        .then(chrc => {
            ctrl_chrc = chrc;
            return brService.getCharacteristic(brUuid[5])
        })
        .then(chrc => {
            var inputCtrl = new Uint16Array(2);
            inputCtrl[0] = Number(cfgId);
            inputCtrl[1] = 0;
            data_chrc = chrc;
            return writeWriteRecursive(cfg, inputCtrl, ctrl_chrc, data_chrc);
        })
        .then(_ => {
            resolve(cfg);
        })
        .catch(error => {
            reject(error);
        });
    });
}

function saveInput() {
    //get consoleName and preset name
    var preset = Number(document.getElementById("presetsName").value);
    var consoleName = Number(document.getElementById("consoleName").value);
    //make sure preset is not placeholder before we do anything
    if (preset != -1) {

        document.getElementById("inputSaveText").style.display = 'none';
        var nbMapping = presets[preset].map.length;
        var cfgSize = nbMapping*8 + 3;
        var cfg = new Uint8Array(cfgSize);
        var cfgId = Number(document.getElementById("inputSelect").value);
        var j = 0;
        cfg[j++] = 0;
        cfg[j++] = 0;
        cfg[j++] = nbMapping;

        log('Input: '+ cfgId + "\n" + 'Preset: ' + preset);
        for (var i = 0; i < nbMapping; i++) {
            cfg[j++] = btn[presets[preset].map[i][0]];
            cfg[j++] = btn[presets[preset].map[i][1]];
            cfg[j++] = presets[preset].map[i][2] + cfgId;
            cfg[j++] = presets[preset].map[i][3];
            cfg[j++] = presets[preset].map[i][4];
            cfg[j++] = presets[preset].map[i][5];
            cfg[j++] = presets[preset].map[i][6];
            cfg[j++] = Number(presets[preset].map[i][7]) | (Number(presets[preset].map[i][8]) << 4);
        }

        return new Promise(function(resolve, reject) {
            writeInputCfg(cfgId, cfg)
            .then(_ => {
                document.getElementById("inputSaveText").style.display = 'block';
                log('Input ' + cfgId + ' Config saved');
                resolve();
            })
            .catch(error => {
                reject(error);
            });
        });
    }
}

function onDisconnected() {
    log('> Bluetooth Device disconnected');
    document.getElementById("divBtConn").style.display = 'block';
    document.getElementById("divInputCfg").style.display = 'none';
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
        log('Init Cfg DOM...');
        brService = service;
        if (!pageInit) {
            initBlueRetroCfg();
        }
        document.getElementById("divBtConn").style.display = 'none';
        document.getElementById("divInputCfg").style.display = 'block';
    })
    .catch(error => {
        log('Argh! ' + error);
    });
}

function selectInput() {
    //only change the description if selected input is not the placeholder
    if (Number(document.getElementById("presetsName").value) == -1) {
        document.getElementById("desc").textContent = "Select a console and preset!";
    }
    else {
        document.getElementById("desc").textContent = presets[Number(this.value)].desc;
    }
}

function clearConsolePresets() {
    //clear the presets list then change the description to "select a console and preset!"
    var presetsList = document.getElementById("presetsName");
    var presetsListLength = presetsList.length;
    for (i = 0; i < presetsListLength; i++) {
        presetsList.remove(0);
    }
    document.getElementById("desc").textContent = "Select a console and preset!";
}

function populateConsolePresets(selectedConsole) {
    //add "select preset first as -1 to prevent trying to save the placeholder"
    var list = document.getElementById("presetsName")
    list.add(new Option("Select preset", -1));
    //add presets to the list that match the selected console type
    if (selectedConsole != undefined) {
        for (i = 0; i < presets.length; i++) {
            if (presets[i].console === selectedConsole) {
                list.add(new Option(presets[i].name, i));
            }
        }
    }
    //no filter selected, show whole preset list
    else {
        for (i = 0; i < presets.length; i++) {
            list.add(new Option(presets[i].name, i));
        }
    }
}

function chooseConsole(e) {
    //when changing consoles we clear the presets list and populate it with presets from the newly selected system
    clearConsolePresets()
    populateConsolePresets(consoles[e.target.value])
}
