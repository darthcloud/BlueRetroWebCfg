import { brUuid, labelName, btnList, systemCfg,
    multitapCfg, inquiryMode, devCfg, accCfg, turboMask,
    scaling, diagScaling, maxMainInput, maxOutput,
    maxMax, maxThres }
    from '../utils/constants.js';
import { saveGlobalCfg } from '../utils/saveGlobalCfg.js'
import { saveOutputCfg } from '../utils/saveOutputCfg.js'
import { getLatestRelease } from '../utils/getLatestRelease.js';
import { getAppVersion } from '../utils/getAppVersion.js';
import { getBdAddr } from '../utils/getBdAddr.js';
import { getApiVersion } from '../utils/getApiVersion.js';
import { getGameId } from '../utils/getGameId.js';
import { getGameName } from '../utils/getGameName.js';
import { getCfgSrc } from '../utils/getCfgSrc.js';
import { setDefaultCfg } from '../utils/setDefaultCfg.js';
import { setGameIdCfg } from '../utils/setGameIdCfg.js';
import { getBlueRetroDevice } from '../utils/blueRetroConnection.js';

var apiVersion = 0;
var bluetoothDevice;
var maxMapping = 255;
var nbMapping = 1;
let brService = null;
var mappingElement = null;
var srcLabel = 0;
var destLabel = 0;
var bdaddr = '';
var app_ver = '';
var latest_ver = '';
var name = '';
var gameid = '';
var gamename = '';
var current_cfg = 0;

/* Friendly display names; option values sent to the adapter are unchanged */
const systemNames = {
    'Auto': 'Auto-detect',
    'Parallel_1P_PP': 'Parallel 1P (push-pull)',
    'Parallel_2P_PP': 'Parallel 2P (push-pull)',
    'NES': 'NES / Famicom',
    'PCE': 'PC Engine / TurboGrafx-16',
    'MD-Genesis': 'Mega Drive / Genesis',
    'SNES': 'SNES / Super Famicom',
    'CD32': 'Amiga CD32',
    'Jaguar': 'Atari Jaguar',
    'PSX': 'PlayStation',
    'Saturn': 'Sega Saturn',
    'JVS': 'JVS (arcade)',
    'N64': 'Nintendo 64',
    'DC': 'Dreamcast',
    'PS2': 'PlayStation 2',
    'GC': 'GameCube',
    'Wii-Ext': 'Wii extension',
    'VB': 'Virtual Boy',
    'Parallel_1P_OD': 'Parallel 1P (open-drain)',
    'Parallel_2P_OD': 'Parallel 2P (open-drain)',
};
const multitapNames = { 'Slot 1': 'On port 1', 'Slot 2': 'On port 2', 'Dual': 'On both ports', 'Alt': 'Alternate' };
const inquiryNames = { 'Auto': 'Automatically', 'Manual': 'Only when started manually' };
const devNames = { 'GamePad': 'Controller', 'GamePadAlt': 'Controller (alternate)' };
const accNames = { 'Memory': 'Memory card', 'Both': 'Memory card + rumble' };
const turboNames = { 'Disable': 'Off' };
/* Console button names to show by default for the selected system */
const systemLabels = {
    'NES': 'NES', 'PCE': 'PCE', 'MD-Genesis': 'MD / Genesis', 'SNES': 'SNES',
    'CD-i': 'CD-i', '3DO': '3DO', 'Jaguar': 'Jaguar', 'PSX': 'PSX / PS2',
    'Saturn': 'Saturn', 'PC-FX': 'PC-FX', 'JVS': 'JVS', 'N64': 'N64',
    'DC': 'Dreamcast', 'PS2': 'PSX / PS2', 'GC': 'GameCube', 'VB': 'VB',
};

/* Plain names for the Default button list (gamepad first, keyboard/mouse after) */
const defaultBtnNames = [
    'Left stick left (key A)', 'Left stick right (key D)', 'Left stick down (key S)', 'Left stick up (key W)',
    'Right stick left (mouse left)', 'Right stick right (mouse right)', 'Right stick down (mouse down)', 'Right stick up (mouse up)',
    'D-pad left (left arrow)', 'D-pad right (right arrow)', 'D-pad down (down arrow)', 'D-pad up (up arrow)',
    'Right D-pad left (wheel left)', 'Right D-pad right (wheel right)', 'Right D-pad down (wheel down)', 'Right D-pad up (wheel up)',
    'Left face button (key Q, mouse 4)', 'Right face button (key R, mouse 5)', 'Bottom face button (key E, mouse 6)', 'Top face button (key F, mouse 7)',
    'Start (Esc)', 'Select (Enter)', 'Home (left Win)', 'Share / capture (#)',
    'Left trigger (right click)', 'Left bumper (key Z)', 'Left trigger full press (left Ctrl)', 'Left stick click (middle click)',
    'Right trigger (left click)', 'Right bumper (key X, mouse 8)', 'Right trigger full press (left Shift)', 'Right stick click (Space)',
];
const shortcutNames = {
    'CB SYS RESET': 'Shortcut: restart adapter',
    'CB BT PAIR': 'Shortcut: Bluetooth pairing',
    'CB SYS PWOFF': 'Shortcut: power off',
    'CB FACT RST': 'Shortcut: factory reset',
    'CB DEEP SLP': 'Shortcut: deep sleep',
    'CB WIRED RST': 'Shortcut: reset console connection',
};

function defaultBtnName(i) {
    var name = btnList[i][0];
    if (defaultBtnNames[i]) {
        return defaultBtnNames[i];
    }
    if (name.startsWith('KB: ')) {
        return 'Key ' + name.substring(4);
    }
    if (name.startsWith('COMBO BASE ')) {
        return 'Combo base ' + name.substring(11);
    }
    return friendly(shortcutNames, name);
}

function btnName(i, label) {
    return (label != 0 && btnList[i][label]) || defaultBtnName(i);
}

function friendly(names, value) {
    return names[value] || value;
}

function addFieldHelp(parent, text) {
    var p = document.createElement("p");
    p.className = "field-help";
    p.innerText = text;
    parent.appendChild(p);
}

/* Ask the main page to offer its Restart adapter button */
function requestRestart(reason) {
    if (window.parent !== window) {
        window.parent.postMessage({type: 'blueretro-restart-required', reason}, window.location.origin);
    }
}

function addSaveStatus(parent, id, html, type) {
    var div = document.createElement("div");
    div.id = id;
    div.setAttribute("style", "display:none;");
    var p = document.createElement("p");
    p.className = "save-status " + type;
    p.innerHTML = html;
    div.appendChild(p);
    parent.appendChild(div);
}

function initGlobalCfg() {
    var divGlobalCfg = document.getElementById("divGlobalCfg");

    divGlobalCfg.innerHTML = '';

    let header = document.createElement("h2");
    header.style.margin = 0;
    header.innerText = 'Adapter settings';

    divGlobalCfg.appendChild(header);

    divGlobalCfg.innerHTML += '<p class="section-help">Settings for the whole adapter. Auto-detect works for most consoles.</p>'

    var div = document.createElement("div");

    /* System */
    var label = document.createElement("label");
    label.innerText = 'Console: ';
    label.setAttribute("for", "systemCfg");

    var sel = document.createElement("select");
    for (var i = 0; i < systemCfg.length; i++) {
        var option  = document.createElement("option");
        option.value = i;
        option.text = friendly(systemNames, systemCfg[i]);
        sel.add(option);
    }
    sel.id = "systemCfg";
    div.appendChild(label);
    div.appendChild(sel);
    addFieldHelp(div, 'Only change this if your console is not detected correctly.');

    divGlobalCfg.appendChild(div);

    div = document.createElement("div");

    /* Multitap */
    label = document.createElement("label");
    label.innerText = 'Multitap: ';
    label.setAttribute("for", "multitapCfg");

    sel = document.createElement("select");
    for (var i = 0; i < multitapCfg.length; i++) {
        var option  = document.createElement("option");
        option.value = i;
        option.text = friendly(multitapNames, multitapCfg[i]);
        sel.add(option);
    }
    sel.id = "multitapCfg";
    div.appendChild(label);
    div.appendChild(sel);
    addFieldHelp(div, 'Adds more players on consoles that support a multitap.');

    divGlobalCfg.appendChild(div);

    if (apiVersion > 0) {
        div = document.createElement("div");

        /* Inquiry mode */
        label = document.createElement("label");
        label.innerText = 'Search for new controllers: ';
        label.setAttribute("for", "inquiryMode");

        sel = document.createElement("select");
        for (var i = 0; i < inquiryMode.length; i++) {
            var option  = document.createElement("option");
            option.value = i;
            option.text = friendly(inquiryNames, inquiryMode[i]);
            sel.add(option);
        }
        sel.id = "inquiryMode";
        div.appendChild(label);
        div.appendChild(sel);

        divGlobalCfg.appendChild(div);
    }

    if (apiVersion > 1) {
        div = document.createElement("div");

        /* Banksel */
        label = document.createElement("label");
        label.innerText = 'Memory card bank: ';
        label.setAttribute("for", "banksel");

        sel = document.createElement("select");
        for (var i = 0; i < 4; i++) {
            var option  = document.createElement("option");
            option.value = i;
            option.text = 'Bank ' + eval(i + 1);
            sel.add(option);
        }
        var option  = document.createElement("option");
        option.value = 0xDB;
        option.text = 'Debug mode';
        sel.add(option);
        sel.id = "banksel";
        div.appendChild(label);
        div.appendChild(sel);

        divGlobalCfg.appendChild(div);
    }

    div = document.createElement("div");

    var btn = document.createElement("button");
    btn.id = "globalSave";
    btn.innerText = 'Save';
    btn.addEventListener("click", saveGlobal);
    div.appendChild(btn);
    div.setAttribute("style", "margin-top:1em;");

    divGlobalCfg.appendChild(div);

    addSaveStatus(divGlobalCfg, "globalSaveText", "Saved. Restart the adapter to apply these settings.", "needs-restart");
}

function initOutputSelect() {
    var divOutputCfg = document.getElementById("divOutputCfg");

    divOutputCfg.innerHTML = '';

    let header = document.createElement("h2");
    header.style.margin = 0;
    header.innerText = 'Console ports and accessories';

    divOutputCfg.appendChild(header);

    divOutputCfg.innerHTML += '<p class="section-help">Choose what the console sees plugged in for each player.</p>'

    var div = document.createElement("div");

    /* Output select */
    var label = document.createElement("label");
    label.innerText = 'Player: ';
    label.setAttribute("for", "outputSelect");

    var main = document.createElement("select");
    for (var i = 0; i < maxOutput; i++) {
        var option  = document.createElement("option");
        option.value = i;
        option.text = "Player " + (i + 1);
        main.add(option);
    }
    main.id = "outputSelect";
    main.addEventListener("change", selectOutput);
    div.appendChild(label);
    div.appendChild(main);

    divOutputCfg.appendChild(div);
}

function initOutputMode() {
    var div = document.createElement("div");
    div.setAttribute("style", "margin-top:1em;");

    /* Output mode */
    var span = document.createElement("span");
    span.setAttribute("style", "display:inline-block;");
    var label = document.createElement("label");
    label.innerText = 'Acts as';
    label.setAttribute("for", "outputMode");
    label.setAttribute("style", "display:block;");

    var main = document.createElement("select");
    for (var i = 0; i < devCfg.length; i++) {
        var option  = document.createElement("option");
        option.value = i;
        option.text = friendly(devNames, devCfg[i]);
        main.add(option);
    }
    main.id = "outputMode";
    span.appendChild(label);
    span.appendChild(main);
    div.appendChild(span);

    /* Output acessories */
    span = document.createElement("span");
    span.setAttribute("style", "display:inline-block;");
    label = document.createElement("label");
    label.innerText = 'Accessory';
    label.setAttribute("for", "outputAcc");
    label.setAttribute("style", "display:block;");

    main = document.createElement("select");
    for (var i = 0; i < accCfg.length; i++) {
        var option  = document.createElement("option");
        option.value = i;
        option.text = friendly(accNames, accCfg[i]);
        main.add(option);
    }
    main.id = "outputAcc";
    span.appendChild(label);
    span.appendChild(main);
    div.appendChild(span);

    var divOutputCfg = document.getElementById("divOutputCfg");
    divOutputCfg.appendChild(div);

    div = document.createElement("div");

    var btn = document.createElement("button");
    btn.id = "outputSave";
    btn.innerText = 'Save';
    btn.addEventListener("click", saveOutput);
    div.appendChild(btn);
    div.setAttribute("style", "margin-top:1em;");

    divOutputCfg.appendChild(div);

    addSaveStatus(divOutputCfg, "outputSaveText", "Saved. Restart the adapter to apply a new <em>Acts as</em> setting.", "needs-restart");
    addSaveStatus(divOutputCfg, "outputSaveMouse", "Mouse mode also needs the <a href=\"index.html#presets\" target=\"_top\">Default Mouse preset</a>.", "needs-action");
}

function initInputSelect() {
    var divInputCfg = document.getElementById("divInputCfg");

    divInputCfg.innerHTML = '';
    divInputCfg.classList.remove("show-mapping-advanced");

    let header = document.createElement("h2");
    header.style.margin = 0;
    header.innerText = 'Controller button mapping';

    divInputCfg.appendChild(header);

    divInputCfg.innerHTML += '<p class="section-help">Choose what the console receives when you press each button. For common layouts, <a href="index.html#presets" target="_top">Presets</a> are quicker.</p>'
        + '<div class="mapping-key">Each row reads: <strong>when I press</strong> this button, <strong>the console gets</strong> that button, <strong>for</strong> this player.</div>';

    var div = document.createElement("div");
    div.setAttribute("style", "margin-bottom:1em;");

    /* Input select */
    var label = document.createElement("label");
    label.innerText = 'Edit buttons for: ';
    label.setAttribute("for", "inputSelect");

    var main = document.createElement("select");
    for (var i = 0; i < maxMainInput; i++) {
        var option  = document.createElement("option");
        option.value = i;
        option.text = "Controller " + (i + 1);
        main.add(option);
    }
    main.id = "inputSelect";
    main.addEventListener("change", selectInput);
    div.appendChild(label);
    div.appendChild(main);
    addFieldHelp(div, 'Controller 1 is the first controller connected to the adapter.');

    divInputCfg.appendChild(div);
}

function initLabelSelect() {
    var div = document.createElement("div");

    var label = document.createElement("label");
    label.innerText = 'Show button names for my controller: ';
    label.setAttribute("for", "srcLabel");

    var main = document.createElement("select");
    for (var i = 0; i < labelName.length; i++) {
        var option  = document.createElement("option");
        option.value = i;
        option.text = labelName[i];
        main.add(option);
    }
    main.id = "srcLabel";
    main.addEventListener("change", changeSrcLabel);
    div.appendChild(label);
    div.appendChild(main);

    var divInputCfg = document.getElementById("divInputCfg");
    divInputCfg.appendChild(div);

    var div = document.createElement("div");
    div.setAttribute("style", "margin-bottom:1em;");

    label = document.createElement("label");
    label.innerText = 'Show button names for the console: ';
    label.setAttribute("for", "dstLabel");

    main = document.createElement("select");
    for (var i = 0; i < labelName.length; i++) {
        var option  = document.createElement("option");
        option.value = i;
        option.text = labelName[i];
        main.add(option);
    }
    main.id = "dstLabel";
    main.addEventListener("change", changeDstLabel);
    div.appendChild(label);
    div.appendChild(main);

    divInputCfg.appendChild(div);

    divInputCfg.insertAdjacentHTML("beforeend", '<button type="button" id="advancedMappingToggle" class="secondary-action" aria-pressed="false">Show fine-tuning (turbo, sensitivity, deadzone)</button>');
    document.getElementById("advancedMappingToggle").addEventListener("click", function() {
        var showAdvanced = divInputCfg.classList.toggle("show-mapping-advanced");
        this.setAttribute("aria-pressed", showAdvanced);
        this.innerText = showAdvanced ? "Hide fine-tuning" : "Show fine-tuning (turbo, sensitivity, deadzone)";
    });
}

function initFirstOutputMapping() {
    mappingElement = document.createElement("div");
    mappingElement.setAttribute("class", "mapping-row");

    /* Src */
    var span = document.createElement("span");
    span.setAttribute("style", "max-width:10%;display:inline-block;");
    span.title = "The button or stick direction you press on your Bluetooth controller.";
    var label = document.createElement("label");
    label.innerText = 'When I press';
    label.setAttribute("style", "display:block;");

    var src = document.createElement("select");
    for (var i = 0; i < btnList.length; i++) {
        var option  = document.createElement("option");
        option.value = i;
        option.text = btnName(i, srcLabel);
        src.add(option);
    }
    src.setAttribute("class", "src");
    span.appendChild(label);
    span.appendChild(src);
    mappingElement.appendChild(span);

    /* Dest */
    span = document.createElement("span");
    span.setAttribute("style", "max-width:10%;display:inline-block;");
    span.title = "The button or stick direction the console receives.";
    label = document.createElement("label");
    label.innerText = 'Console gets';
    label.setAttribute("style", "display:block;");

    var dest = document.createElement("select");
    for (var i = 0; i < btnList.length; i++) {
        var option  = document.createElement("option");
        option.value = i;
        option.text = btnName(i, destLabel);
        dest.add(option);
    }
    dest.setAttribute("class", "dest");
    span.appendChild(label);
    span.appendChild(dest);
    mappingElement.appendChild(span);

    /* Dest ID */
    span = document.createElement("span");
    span.setAttribute("style", "max-width:10%;display:inline-block;");
    span.title = "The player that receives this button.";
    label = document.createElement("label");
    label.innerText = 'For';
    label.setAttribute("style", "display:block;");

    var destId = document.createElement("select");
    for (var i = 0; i < maxOutput; i++) {
        var option  = document.createElement("option");
        option.value = i;
        option.text = "Player " + (i + 1);
        destId.add(option);
    }
    destId.setAttribute("class", "destId");
    span.appendChild(label);
    span.appendChild(destId);
    mappingElement.appendChild(span);

    /* Max */
    span = document.createElement("span");
    span.setAttribute("class", "mapping-advanced");
    span.setAttribute("style", "max-width:10%;display:inline-block;");
    span.title = "If source & destination is an axis then this is the scaling factor base on the destination maximum. If source is a button & destination is an axis then this is the value base on destination maximum that the axis will be set.";
    label = document.createElement("label");
    label.innerText = 'Strength';
    label.setAttribute("style", "display:block;");

    var max = document.createElement("select");
    for (var i = 0; i <= maxMax; i += 5) {
        var option  = document.createElement("option");
        option.value = i;
        option.text = i + "%";
        max.add(option);
    }
    max.setAttribute("class", "max");
    max.value = 100;
    span.appendChild(label);
    span.appendChild(max);
    mappingElement.appendChild(span);

    /* Threshold */
    span = document.createElement("span");
    span.setAttribute("class", "mapping-advanced");
    span.setAttribute("style", "max-width:10%;display:inline-block;");
    span.title = "If source is an axis and destination is a button, this is the threshold requires on the source axis before the button is pressed.";
    label = document.createElement("label");
    label.innerText = 'Press point';
    label.setAttribute("style", "display:block;");

    var thres = document.createElement("select");
    for (var i = 0; i <= maxThres; i += 5) {
        var option  = document.createElement("option");
        option.value = i;
        option.text = i + "%";
        thres.add(option);
    }
    thres.setAttribute("class", "thres");
    thres.value = 50;
    span.appendChild(label);
    span.appendChild(thres);
    mappingElement.appendChild(span);

    /* Deadone */
    span = document.createElement("span");
    span.setAttribute("class", "mapping-advanced");
    span.setAttribute("style", "max-width:10%;display:inline-block;");
    span.title = "This is the axis dead zone around reset value.";
    label = document.createElement("label");
    label.innerText = 'Deadzone';
    label.setAttribute("style", "display:block;");

    var dz = document.createElement("select");
    for (var i = 0; i <= maxMax; i += 5) {
        var option  = document.createElement("option");
        option.value = i;
        option.text = i/10000 + "%";
        dz.add(option);
    }
    dz.setAttribute("class", "dz");
    dz.value = 135;
    span.appendChild(label);
    span.appendChild(dz);
    mappingElement.appendChild(span);

    /* Turbo */
    span = document.createElement("span");
    span.setAttribute("class", "mapping-advanced");
    span.setAttribute("style", "max-width:10%;display:inline-block;");
    span.title = "Turbo function base on the system frame rate.";
    label = document.createElement("label");
    label.innerText = 'Turbo';
    label.setAttribute("style", "display:block;");

    var turbo = document.createElement("select");
    for (var key in turboMask) {
        var option  = document.createElement("option");
        option.value = turboMask[key];
        option.text = friendly(turboNames, key);
        turbo.add(option);
    }
    turbo.setAttribute("class", "turbo");
    span.appendChild(label);
    span.appendChild(turbo);
    mappingElement.appendChild(span);

    /* Scaling */
    span = document.createElement("span");
    span.setAttribute("class", "mapping-advanced");
    span.setAttribute("style", "max-width:10%;display:inline-block;");
    span.title = "Various response curve for scaling. (Only Passthrough and Linear, others TBD)";
    label = document.createElement("label");
    label.innerText = 'Response curve';
    label.setAttribute("style", "display:block;");

    var sca = document.createElement("select");
    for (var i = 0; i < scaling.length; i++) {
        var option  = document.createElement("option");
        option.value = i;
        option.text = scaling[i];
        sca.add(option);
    }
    sca.setAttribute("class", "scaling");
    span.appendChild(label);
    span.appendChild(sca);
    mappingElement.appendChild(span);

    /* Scaling diag */
    span = document.createElement("span");
    span.setAttribute("class", "mapping-advanced");
    span.setAttribute("style", "max-width:10%;display:inline-block;");
    span.title = "Diagonal scaling options between joystick type. (TBD Not implemented yet)";
    label = document.createElement("label");
    label.innerText = 'Diagonal';
    label.setAttribute("style", "display:block;");

    var diag = document.createElement("select");
    diag.setAttribute("style", "max-width:100%;");
    for (var i = 0; i < diagScaling.length; i++) {
        var option  = document.createElement("option");
        option.value = i;
        option.text = diagScaling[i];
        diag.add(option);
    }
    diag.setAttribute("class", "diag");
    span.appendChild(label);
    span.appendChild(diag);
    mappingElement.appendChild(span);

    /* Add button */
    var addButton = document.createElement("button");
    addButton.innerText = '+ Add another button';
    addButton.className = 'secondary-action add-mapping';
    addButton.addEventListener("click", addInput);

    /* Save */
    var divSave = document.createElement("div");

    var btn = document.createElement("button");
    btn.id = "inputSave";
    btn.innerText = 'Save';
    btn.addEventListener("click", saveInput);
    divSave.appendChild(btn);

    addSaveStatus(divSave, "inputSaveText", "Saved. Button changes apply right away.", "applied");

    /* Append first cfg */
    var divMappingGrp = document.createElement("div");
    var divMapping = document.createElement("div");
    divMapping.appendChild(mappingElement);
    divMapping.id = "divMapping";
    var divInputCfg = document.getElementById("divInputCfg");
    divMappingGrp.appendChild(divMapping);
    divMappingGrp.appendChild(addButton);
    divMappingGrp.appendChild(divSave);
    divInputCfg.appendChild(divMappingGrp);
}

function initOutputMapping() {
    /* Template for added rows: same labelled layout as the first row */
    mappingElement = document.querySelector("#divMapping .mapping-row").cloneNode(true);
}

export function initBlueRetroCfg() {
    /* Name selects are rebuilt showing Default */
    srcLabel = 0;
    destLabel = 0;
    initGlobalCfg();
    initOutputSelect();
    initOutputMode();
    initInputSelect();
    initLabelSelect();
    initFirstOutputMapping();
    initOutputMapping();
    initCfgSelection();
    nbMapping = 1;
}

function loadGlobalCfg() {
    return new Promise(function(resolve, reject) {
        log('Get Global Config CHRC...');
        brService.getCharacteristic(brUuid[1])
        .then(chrc => {
            log('Reading Global Config...');
            return chrc.readValue();
        })
        .then(value => {
            log('Global Config size: ' + value.byteLength);
            document.getElementById("systemCfg").value = value.getUint8(0);
            showSystemLabels(systemCfg[value.getUint8(0)]);
            document.getElementById("multitapCfg").value = value.getUint8(1);
            if (apiVersion > 0) {
                document.getElementById("inquiryMode").value = value.getUint8(2);
            }
            if (apiVersion > 1) {
                document.getElementById("banksel").value = value.getUint8(3);
            }
            resolve();
        })
        .catch(error => {
            reject(error);
        });
    });
}

function loadOutputCfg(cfgId) {
    return new Promise(function(resolve, reject) {
        log('Get Output ' + cfgId + ' CTRL CHRC...');
        brService.getCharacteristic(brUuid[2])
        .then(chrc => {
            log('Set Output ' + cfgId + ' on CTRL chrc...');
            var outputCtrl = new Uint16Array(1);
            outputCtrl[0] = Number(cfgId);
            return chrc.writeValue(outputCtrl);
        })
        .then(_ => {
            log('Get Output ' + cfgId + ' DATA CHRC...');
            return brService.getCharacteristic(brUuid[3]);
        })
        .then(chrc => {
            log('Reading Output ' + cfgId + ' Config...');
            return chrc.readValue();
        })
        .then(value => {
            log('Output ' + cfgId + ' Config size: ' + value.byteLength);
            document.getElementById("outputMode").value = value.getUint8(0);
            document.getElementById("outputAcc").value = value.getUint8(1);
            resolve();
        })
        .catch(error => {
            reject(error);
        });
    });
}

function writeReadRecursive(cfg, inputCtrl, ctrl_chrc, data_chrc) {
    return new Promise(function(resolve, reject) {
        log('Set Input Ctrl CHRC... ' + inputCtrl[1]);
        ctrl_chrc.writeValue(inputCtrl)
        .then(_ => {
            log('Reading Input Data CHRC...');
            return data_chrc.readValue();
        })
        .then(value => {
            log('Got Input Data ' + value.byteLength);
            var tmp = new Uint8Array(value.buffer);
            cfg.set(tmp, inputCtrl[1]);
            log('Got Input Data ' + cfg[2] + ' ' + value.getUint8(2));
            if (value.byteLength == 512) {
                inputCtrl[1] += Number(512);
                resolve(writeReadRecursive(cfg, inputCtrl, ctrl_chrc, data_chrc));
            }
            else {
                resolve(cfg);
            }
        })
        .catch(error => {
            reject(error);
        });
    });
}

function readInputCfg(cfgId, cfg) {
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
            return writeReadRecursive(cfg, inputCtrl, ctrl_chrc, data_chrc);
        })
        .then(value => {
            log('Input ' + cfgId + ' Config size: ' + cfg.byteLength);
            resolve(cfg);
        })
        .catch(error => {
            reject(error);
        });
    });
}

function loadInputCfg(cfgId) {
    return new Promise(function(resolve, reject) {
        var cfg = new Uint8Array(2051);
        log('Get Input ' + cfgId + ' Config CHRC...');
        readInputCfg(cfgId, cfg)
        .then(value => {
            log('Input ' + cfgId + ' Config size: ' + value.byteLength);
            //document.getElementById("mainInput").value = value[0];
            //document.getElementById("subInput").value = value[1];

            var div = document.getElementById("divMapping");
            if (value[2] < nbMapping) {
                var range = nbMapping - value[2];
                for (var i = 0; i < range; i++) {
                    div.removeChild(div.lastChild);
                }
            }
            else if (value[2] > nbMapping) {
                var range = value[2] - nbMapping;
                for (var i = 0; i < range; i++) {
                    addInput();
                }
            }
            nbMapping = value[2];
            var src = document.getElementsByClassName("src");
            var dest = document.getElementsByClassName("dest");
            var destId = document.getElementsByClassName("destId");
            var max = document.getElementsByClassName("max");
            var thres = document.getElementsByClassName("thres");
            var dz = document.getElementsByClassName("dz");
            var turbo = document.getElementsByClassName("turbo");
            var scaling = document.getElementsByClassName("scaling");
            var diag = document.getElementsByClassName("diag");

            log('Loading Mapping Found: ' + src.length + ' nbMapping: ' + nbMapping + ' cfg: ' + value[2]);

            var j = 3;
            for (var i = 0; i < nbMapping; i++) {
                src[i].value = value[j++];
                dest[i].value = value[j++];
                destId[i].value = value[j++];
                max[i].value = value[j++];
                thres[i].value = value[j++];
                dz[i].value = value[j++];
                turbo[i].value = value[j++];
                scaling[i].value = value[j] & 0xF;
                diag[i].value = value[j++] >> 4;
            }
            resolve();
        })
        .catch(error => {
            reject(error);
        });
    });
}

function saveGlobal() {
    document.getElementById("globalSaveText").style.display = 'none';
    if (apiVersion > 1) {
        var data = new Uint8Array(4);
    }
    else if (apiVersion > 0) {
        var data = new Uint8Array(3);
    }
    else {
        var data = new Uint8Array(2);
    }
    data[0] = document.getElementById("systemCfg").value;
    data[1] = document.getElementById("multitapCfg").value;
    if (apiVersion > 0) {
        data[2] = document.getElementById("inquiryMode").value;
    }
    if (apiVersion > 1) {
        data[3] = document.getElementById("banksel").value;
    }
    return new Promise(function(resolve, reject) {
        saveGlobalCfg(brService, data)
        .then(_ => {
            document.getElementById("globalSaveText").style.display = 'block';
            requestRestart('Adapter settings');
            log('Global Config saved');
            resolve();
        })
        .catch(error => {
            reject(error);
        });
    });
}

function saveOutput() {
    document.getElementById("outputSaveText").style.display = 'none';
    document.getElementById("outputSaveMouse").style.display = 'none';
    var data = new Uint8Array(2);
    data[0] = document.getElementById("outputMode").value;
    data[1] = document.getElementById("outputAcc").value;
    var cfgId = document.getElementById("outputSelect").value;
    return new Promise(function(resolve, reject) {
        saveOutputCfg(brService, data, cfgId)
        .then(_ => {
            document.getElementById("outputSaveText").style.display = 'block';
            requestRestart('Console ports');
            if (data[0] == 3) {
                document.getElementById("outputSaveMouse").style.display = 'block';
            }
            log('Output ' + cfgId + ' Config saved');
            resolve();
        })
        .catch(error => {
            reject(error);
        });
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
    document.getElementById("inputSaveText").style.display = 'none';
    var cfgSize = nbMapping*8 + 3;
    var cfg = new Uint8Array(cfgSize);
    var cfgId = document.getElementById("inputSelect").value;

    var src = document.getElementsByClassName("src");
    var dest = document.getElementsByClassName("dest");
    var destId = document.getElementsByClassName("destId");
    var max = document.getElementsByClassName("max");
    var thres = document.getElementsByClassName("thres");
    var dz = document.getElementsByClassName("dz");
    var turbo = document.getElementsByClassName("turbo");
    var scaling = document.getElementsByClassName("scaling");
    var diag = document.getElementsByClassName("diag");

    var j = 0;
    cfg[j++] = 0;//document.getElementById("mainInput").value;
    cfg[j++] = 0;//document.getElementById("subInput").value;
    cfg[j++] = nbMapping;

    for (var i = 0; i < nbMapping; i++) {
        cfg[j++] = src[i].value;
        cfg[j++] = dest[i].value;
        cfg[j++] = destId[i].value;
        cfg[j++] = max[i].value;
        cfg[j++] = thres[i].value;
        cfg[j++] = dz[i].value;
        cfg[j++] = turbo[i].value;
        cfg[j++] = Number(scaling[i].value) | (Number(diag[i].value) << 4);
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

function onDisconnected() {
    log('> Bluetooth Device disconnected');
    document.getElementById("divBtConn").style.display = 'block';
    document.getElementById("divInfo").style.display = 'none';
    document.getElementById("divCfgSel").style.display = 'none';
    //document.getElementById("divBtDisconn").style.display = 'none';
    document.getElementById("divGlobalCfg").style.display = 'none';
    document.getElementById("divOutputCfg").style.display = 'none';
    document.getElementById("divInputCfg").style.display = 'none';
}

function swGameIdCfg() {
    setGameIdCfg(brService)
    .then(_ => {
        return getCfgSrc(brService);
    })
    .then(value => {
        current_cfg = value;
        initBlueRetroCfg();
        return loadGlobalCfg();
    })
    .then(() => {
        return loadOutputCfg(0);
    })
    .then(() => {
        return loadInputCfg(0);
    })
}

function swDefaultCfg() {
    setDefaultCfg(brService)
    .then(_ => {
        return getCfgSrc(brService);
    })
    .then(value => {
        current_cfg = value;
        initBlueRetroCfg();
        return loadGlobalCfg();
    })
    .then(() => {
        return loadOutputCfg(0);
    })
    .then(() => {
        return loadInputCfg(0);
    })
}

function initCfgSelection() {
    let divCfgSel = document.getElementById("divCfgSel");
    let cfgSw = document.createElement("div");
    let cfgBtn = document.createElement("button");

    divCfgSel.innerHTML = '';

    let header = document.createElement("h2");
    header.style.margin = 0;
    header.innerText = 'Configuration profile';

    divCfgSel.appendChild(header);

    divCfgSel.innerHTML += '<p class="section-help">Your settings apply to every game, unless you give the game that is running its own settings.</p>'

    let gameLabel = gamename || 'the current game';
    let editing = document.createElement("p");
    let strong = document.createElement("strong");
    strong.innerText = 'Currently editing: ';
    editing.appendChild(strong);

    cfgBtn.id = "cfgSw";

    if (current_cfg == 0) {
        cfgBtn.innerText = 'Use separate settings for ' + gameLabel;
        cfgBtn.addEventListener("click", swGameIdCfg);
        editing.append('Settings for all games');
        if (gameid.length) {
            cfgSw.appendChild(cfgBtn);
        }
        else {
            addFieldHelp(cfgSw, 'Separate settings are available when the adapter detects the game that is running.');
        }
    }
    else {
        cfgBtn.innerText = 'Go back to settings for all games';
        cfgBtn.addEventListener("click", swDefaultCfg);
        editing.append('Settings for ' + gameLabel + ' only');
        cfgSw.appendChild(cfgBtn);
    }
    divCfgSel.appendChild(editing);
    cfgSw.setAttribute("style", "margin-top:1em;");
    divCfgSel.append(cfgSw);
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
        return getApiVersion(brService);
    })
    .then(value => {
        apiVersion = value;
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
        log("ABI version: " + apiVersion);
        log('Init Cfg DOM...');
        initBlueRetroCfg();
        return loadGlobalCfg();
    })
    .then(() => {
        return loadOutputCfg(0);
    })
    .then(() => {
        return loadInputCfg(0);
    })
    .then(() => {
        document.getElementById("divInfo").innerHTML = 'Connected to: ' + name + ' (' + bdaddr + ') [' + app_ver
            + ']<br> Current Game: ' + gamename + ' (' + gameid + ')';
        try {
            if (app_ver.indexOf(latest_ver) == -1) {
                document.getElementById("divInfo").innerHTML += '<br><br>Download latest FW ' + latest_ver + ' from <a href=\'https://github.com/darthcloud/BlueRetro/releases\' target=\'_blank\'>GitHub</a>';
            }
        }
        catch (e) {
            // Just move on
        }
        document.getElementById("divBtConn").style.display = 'none';
        //document.getElementById("divBtDisconn").style.display = 'block';
        document.getElementById("divInfo").style.display = 'block';
        document.getElementById("divCfgSel").style.display = 'block';
        document.getElementById("divGlobalCfg").style.display = 'block';
        document.getElementById("divOutputCfg").style.display = 'block';
        document.getElementById("divInputCfg").style.display = 'block';
    })
    .catch(error => {
        log('Argh! ' + error);
    });
}

function addInput() {
    if (nbMapping < maxMapping){
        nbMapping++;
        var div = document.getElementById("divMapping");
        var newSubDiv = mappingElement.cloneNode(true);
        var newButton = document.createElement("button");
        newButton.innerText = 'Remove';
        newButton.className = 'remove-mapping';
        newButton.addEventListener("click", delInput);
        newSubDiv.appendChild(newButton);
        newSubDiv.querySelector('.max').value = 100;
        newSubDiv.querySelector('.thres').value = 50;
        newSubDiv.querySelector('.dz').value = 135;
        div.appendChild(newSubDiv);
    }
}

function delInput() {
    this.parentNode.remove();
    nbMapping--;
}

function selectOutput() {
    loadOutputCfg(this.value);
}

function selectInput() {
    loadInputCfg(this.value);
}

function changeSrcLabel() {
    var select = document.getElementsByClassName("src");
    var str = ""
    var tmp;

    srcLabel = this.value;

    for (var i = 0; i < btnList.length; i++) {
        str += "<option value=\"" + i + "\">" + btnName(i, srcLabel) + "</option>";
    }
    for (var i = 0; i < select.length; i++) {
        tmp = select[i].value;
        select[i].innerHTML = str;
        select[i].value = tmp;
    }
    mappingElement.querySelector('.src').innerHTML = str;
}

function showSystemLabels(system) {
    var label = labelName.indexOf(systemLabels[system]);
    var dstLabel = document.getElementById("dstLabel");
    if (label < 0 || destLabel != 0) {
        return;
    }
    dstLabel.value = label;
    changeDstLabel.call(dstLabel);
}

function changeDstLabel() {
    var select = document.getElementsByClassName("dest");
    var str = ""
    var tmp;

    destLabel = this.value;

    for (var i = 0; i < btnList.length; i++) {
        str += "<option value=\"" + i + "\">" + btnName(i, destLabel) + "</option>";
    }
    for (var i = 0; i < select.length; i++) {
        tmp = select[i].value;
        select[i].innerHTML = str;
        select[i].value = tmp;
    }
    mappingElement.querySelector('.dest').innerHTML = str;
}
