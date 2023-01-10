import { brUuid, maxMainInput } from './utils/constants.js';
import { getLatestRelease } from './utils/getLatestRelease.js';
import { getAppVersion } from './utils/getAppVersion.js';
import { getBdAddr } from './utils/getBdAddr.js';
import { savePresetInput } from './utils/savePresetInput.js';
import { getGameId } from './utils/getGameId.js';
import { getGameName } from './utils/getGameName.js';
import { getCfgSrc } from './utils/getCfgSrc.js';
import { setDefaultCfg } from './utils/setDefaultCfg.js';
import { setGameIdCfg } from './utils/setGameIdCfg.js';

var presets = new Array();
var bluetoothDevice;
let brService = null;
var pageInit = 0;
var consoles = []
var bdaddr = '';
var app_ver = '';
var latest_ver = '';
var name = '';
var gameid = '';
var gamename = '';
var current_cfg = 0;

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
    var divSave = document.createElement("saveButton");

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
    var divMappingGrp = document.createElement("save");
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

function saveInput() {
    document.getElementById("inputSaveText").style.display = 'none';
    //get preset index
    var preset_idx = Number(document.getElementById("presetsName").value);
    //make sure preset is not placeholder before we do anything
    if (preset_idx != -1) {
        var preset = presets[preset_idx];
        var cfgId = Number(document.getElementById("inputSelect").value);
        document.getElementById("inputSaveText").style.display = 'none';
        savePresetInput(preset, brService, cfgId)
        .then(_ => {
            document.getElementById("inputSaveText").style.display = 'block';
        });
    }
}

function onDisconnected() {
    log('> Bluetooth Device disconnected');
    document.getElementById("divBtConn").style.display = 'block';
    document.getElementById("divInfo").style.display = 'none';
    document.getElementById("divCfgSel").style.display = 'none';
    document.getElementById("divInputCfg").style.display = 'none';
}

function swGameIdCfg() {
    setGameIdCfg(brService)
    .then(_ => {
        return getCfgSrc(brService);
    })
    .then(value => {
        current_cfg = value;
        initCfgSelection();
    })
}

function swDefaultCfg() {
    setDefaultCfg(brService)
    .then(_ => {
        return getCfgSrc(brService);
    })
    .then(value => {
        current_cfg = value;
        initCfgSelection();
    })
}

function initCfgSelection() {
    let divCfgSel = document.getElementById("divCfgSel");
    let cfgSw = document.createElement("div");
    let cfgBtn = document.createElement("button");

    divCfgSel.innerHTML = '';

    let header = document.createElement("h2");
    header.style.margin = 0;
    header.innerText = 'Config Selection';

    divCfgSel.appendChild(header);

    cfgBtn.id = "cfgSw";

    if (current_cfg == 0) {
        cfgBtn.innerText += 'Switch to GameID';
        cfgBtn.addEventListener("click", swGameIdCfg);
        divCfgSel.innerHTML += 'Current config: Global';
        if (gameid.length) {
            cfgSw.appendChild(cfgBtn);
        }
    }
    else {
        cfgBtn.innerText = 'Switch to Global';
        cfgBtn.addEventListener("click", swDefaultCfg);
        divCfgSel.innerHTML += 'Current config: GameID';
        cfgSw.appendChild(cfgBtn);
    }
    cfgSw.setAttribute("style", "margin-top:1em;");
    divCfgSel.append(cfgSw);
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
        log('Init Cfg DOM...');
        brService = service;
        if (!pageInit) {
            initBlueRetroCfg();
        }
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
        return getGameId(brService);
    })
    .then(value => {
        gameid = value;
        return getGameName(gameid);
    })
    .then(value => {
        gamename = value;
        return getCfgSrc(brService);
    })
    .catch(error => {
        if (error.name == 'NotFoundError'
          || error.name == 'NotSupportedError') {
            return 0;
        }
        throw error;
    })
    .then(value => {
        current_cfg = value;
        document.getElementById("divInfo").innerHTML = 'Connected to: ' + name + ' (' + bdaddr + ') [' + app_ver
            + ']<br> Current Game: ' + gamename + ' (' + gameid + ')';
        try {
            if (app_ver.indexOf(latest_ver) == -1) {
                document.getElementById("divInfo").innerHTML += '<br><br>Download latest FW ' + latest_ver + ' from <a href=\'https://darthcloud.itch.io/blueretro\'>itch.io</a>';
            }
        }
        catch (e) {
            // Just move on
        }
        document.getElementById("divBtConn").style.display = 'none';
        document.getElementById("divInfo").style.display = 'block';
        document.getElementById("divCfgSel").style.display = 'block';
        document.getElementById("divInputCfg").style.display = 'block';
        initCfgSelection();
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
    for (var i = 0; i < presetsListLength; i++) {
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
        for (var i = 0; i < presets.length; i++) {
            if (presets[i].console === selectedConsole) {
                list.add(new Option(presets[i].name, i));
            }
        }
    }
    //no filter selected, show whole preset list
    else {
        for (var i = 0; i < presets.length; i++) {
            list.add(new Option(presets[i].name, i));
        }
    }
}

function chooseConsole(e) {
    //when changing consoles we clear the presets list and populate it with presets from the newly selected system
    clearConsolePresets()
    populateConsolePresets(consoles[e.target.value])
}
