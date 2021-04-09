var brUuid = [
    '56830f56-5180-fab0-314b-2fa176799a00',
    '56830f56-5180-fab0-314b-2fa176799a01',
    '56830f56-5180-fab0-314b-2fa176799a02',
    '56830f56-5180-fab0-314b-2fa176799a03',
    '56830f56-5180-fab0-314b-2fa176799a04',
    '56830f56-5180-fab0-314b-2fa176799a05',
];

var btnList = [
    'GP: LX Left;  KB: A',
    'GP: LX Right; KB: D',
    'GP: LY Down;  KB: S',
    'GP: LY Up;    KB: W',
    'GP: RX Left;  M: X Left',
    'GP: RX Right; M: X Right',
    'GP: RY Down;  M: Y Down',
    'GP: RY Up;    M: Y Up',
    'GP: LD Left;  KB: Left',
    'GP: LD Right; KB: Right',
    'GP: LD Down;  KB: Down',
    'GP: LD Up;    KB: Up',
    'GP: RD Left;  M: WX Left',
    'GP: RD Right; M: WX Right',
    'GP: RD Down;  M: WY Down',
    'GP: RD Up;    M: WY Up',
    'GP: RB Left;  KB: Q; M: 4',
    'GP: RB Right; KB: R; M: 5',
    'GP: RB Down;  KB: E; M: 6',
    'GP: RB Up;    KB: F; M: 7',
    'GP: MM; KB: Esc',
    'GP: MS; KB: Enter',
    'GP: MT; KB: L Win',
    'GP: MQ; KB: Hash',
    'GP: LM; M: Right',
    'GP: LS; KB: Z',
    'GP: LT; KB: L CTRL',
    'GP: LJ; M: Middle',
    'GP: RM; M: Left',
    'GP: RS; KB: X; M: 8',
    'GP: RT; KB: L Shift',
    'GP: RJ; KB: Space',
    'KB: B',
    'KB: C',
    'KB: G',
    'KB: H',
    'KB: I',
    'KB: J',
    'KB: K',
    'KB: L',
    'KB: M',
    'KB: N',
    'KB: O',
    'KB: P',
    'KB: T',
    'KB: U',
    'KB: V',
    'KB: Y',
    'KB: 1',
    'KB: 2',
    'KB: 3',
    'KB: 4',
    'KB: 5',
    'KB: 6',
    'KB: 7',
    'KB: 8',
    'KB: 9',
    'KB: 0',
    'KB: Backspace',
    'KB: Tab',
    'KB: Minus',
    'KB: Equal',
    'KB: L Brace',
    'KB: R Brace',
    'KB: Backslash',
    'KB: Semicolon',
    'KB: Apostrophe',
    'KB: Grave',
    'KB: Comma',
    'KB: Dot',
    'KB: Slash',
    'KB: Capslock',
    'KB: F1',
    'KB: F2',
    'KB: F3',
    'KB: F4',
    'KB: F5',
    'KB: F6',
    'KB: F7',
    'KB: F8',
    'KB: F9',
    'KB: F10',
    'KB: F11',
    'KB: F12',
    'KB: Print Screen',
    'KB: Scroll',
    'KB: Pause',
    'KB: Insert',
    'KB: Home',
    'KB: Page Up',
    'KB: Delete',
    'KB: End',
    'KB: Page Down',
    'KB: Numlock',
    'KB: KP Div',
    'KB: KP Multi',
    'KB: KP Minus',
    'KB: KP Plus',
    'KB: KP Enter',
    'KB: KP 1',
    'KB: KP 2',
    'KB: KP 3',
    'KB: KP 4',
    'KB: KP 5',
    'KB: KP 6',
    'KB: KP 7',
    'KB: KP 8',
    'KB: KP 9',
    'KB: KP 0',
    'KB: KP Dot',
    'KB: L Alt',
    'KB: R Ctrl',
    'KB: R Shift',
    'KB: R Alt',
    'KB: R Win',
];

var systemCfg = [
    'Auto',
    'Parallel_1P',
    'Parallel_2P',
    'NES',
    'PCE',
    'MD-Genesis',
    'SNES',
    'CD-i',
    'CD32',
    '3DO',
    'Jaguar',
    'PSX',
    'Saturn',
    'PC-FX',
    'JVS',
    'N64',
    'DC',
    'PS2',
    'GC',
    'Wii-EXT',
    'Exp Board',
];

var multitapCfg = [
    'None',
    'Slot 1',
    'Slot 2',
    'Dual',
    'Alt',
];

var devCfg = [
    'GamePad',
    'GamePadAlt',
    'Keyboard',
    'Mouse',
];

var accCfg = [
    'None',
    'Memory',
    'Rumble',
    'Both',
];

var scaling = [
    'Linear',
    'Aggressive',
    'Relaxed',
    'Wide',
    'S-Curve',
    'Passthrough',
];

var diagScaling = [
    'Passthrough',
    'Circular->Square',
    'Circular->N64 Hexagone',
    'Square->Circular',
    'Square->N64 Hexagone'
];

const maxMainInput = 12;
const maxSubInput = 4;
const maxOutput = 12;
const maxMax = 255;
const maxThres = 100;
const maxTurbo = 16;

var bluetoothDevice;
var maxMapping = 255;
var nbMapping = 1;
let brService = null;
var mappingElement = null;
let inputChrc = null;
var pageInit = 0;

function initGlobalCfg() {
    var div = document.createElement("div");

    /* System */
    var label = document.createElement("label");
    label.innerText = 'System: ';
    label.setAttribute("for", "systemCfg");

    var sel = document.createElement("select");
    for (var i = 0; i < systemCfg.length; i++) {
        var option  = document.createElement("option");
        option.value = i;
        option.text = systemCfg[i];
        sel.add(option);
    }
    sel.id = "systemCfg";
    div.appendChild(label);
    div.appendChild(sel);

    var divGlobalCfg = document.getElementById("divGlobalCfg");
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
        option.text = multitapCfg[i];
        sel.add(option);
    }
    sel.id = "multitapCfg";
    div.appendChild(label);
    div.appendChild(sel);

    divGlobalCfg.appendChild(div);

    div = document.createElement("div");

    var btn = document.createElement("button");
    btn.id = "globalSave";
    btn.innerText = 'Save';
    btn.addEventListener("click", saveGlobal);
    div.appendChild(btn);
    div.setAttribute("style", "margin-top:1em;");

    divGlobalCfg.appendChild(div);
}

function initOutputSelect() {
    var div = document.createElement("div");

    /* Output select */
    var label = document.createElement("label");
    label.innerText = 'Select output: ';
    label.setAttribute("for", "outputSelect");

    var main = document.createElement("select");
    for (var i = 0; i < maxOutput; i++) {
        var option  = document.createElement("option");
        option.value = i;
        option.text = "Output " + (i + 1);
        main.add(option);
    }
    main.id = "outputSelect";
    main.addEventListener("change", selectOutput);
    div.appendChild(label);
    div.appendChild(main);

    var divOutputCfg = document.getElementById("divOutputCfg");
    divOutputCfg.appendChild(div);
}

function initOutputMode() {
    var div = document.createElement("div");
    div.setAttribute("style", "margin-top:1em;");

    /* Output mode */
    var span = document.createElement("span");
    span.setAttribute("style", "display:inline-block;");
    var label = document.createElement("label");
    label.innerText = 'Mode';
    label.setAttribute("for", "outputMode");
    label.setAttribute("style", "display:block;");

    var main = document.createElement("select");
    for (var i = 0; i < devCfg.length; i++) {
        var option  = document.createElement("option");
        option.value = i;
        option.text = devCfg[i];
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
    label.innerText = 'Accessories';
    label.setAttribute("for", "outputAcc");
    label.setAttribute("style", "display:block;");

    main = document.createElement("select");
    for (var i = 0; i < accCfg.length; i++) {
        var option  = document.createElement("option");
        option.value = i;
        option.text = accCfg[i];
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
}

function initInputSelect() {
    var div = document.createElement("div");
    div.setAttribute("style", "margin-bottom:1em;");

    /* Input select */
    var label = document.createElement("label");
    label.innerText = 'Select Bluetooth device: ';
    label.setAttribute("for", "inputSelect");

    var main = document.createElement("select");
    for (var i = 0; i < maxMainInput; i++) {
        var option  = document.createElement("option");
        option.value = i;
        option.text = "Device " + (i + 1);
        main.add(option);
    }
    main.id = "inputSelect";
    main.addEventListener("change", selectInput);
    div.appendChild(label);
    div.appendChild(main);

    var divInputCfg = document.getElementById("divInputCfg");
    divInputCfg.appendChild(div);
}

function initInputAssign() {
    var div = document.createElement("div");

    /* Main dev */
    var main = document.createElement("select");
    main.setAttribute("style", "max-width:40%;");
    for (var i = 0; i < maxMainInput; i++) {
        var option  = document.createElement("option");
        option.value = i;
        option.text = "Input " + (i + 1);
        main.add(option);
    }
    main.id = "mainInput";
    div.appendChild(main);

    /* Sub dev */
    var sub = document.createElement("select");
    sub.setAttribute("style", "max-width:40%;");
    for (var i = 0; i <= maxSubInput; i++) {
        var option  = document.createElement("option");
        option.value = i;
        if (i) {
            option.text = "Sub Input " + i;
        }
        else {
            option.text = "Sub Input Merged";
        }
        sub.add(option);
    }
    sub.id = "subInput";
    div.appendChild(sub);

    var divInputCfg = document.getElementById("divInputCfg");
    divInputCfg.appendChild(div);
}

function initFirstOutputMapping() {
    mappingElement = document.createElement("div");

    /* Src */
    var span = document.createElement("span");
    span.setAttribute("style", "max-width:10%;display:inline-block;");
    var label = document.createElement("label");
    label.innerText = 'Src';
    label.setAttribute("style", "display:block;");

    var src = document.createElement("select");
    for (var i = 0; i < btnList.length; i++) {
        var option  = document.createElement("option");
        option.value = i;
        option.text = btnList[i];
        src.add(option);
    }
    src.setAttribute("class", "src");
    span.appendChild(label);
    span.appendChild(src);
    mappingElement.appendChild(span);

    /* Dest */
    span = document.createElement("span");
    span.setAttribute("style", "max-width:10%;display:inline-block;");
    label = document.createElement("label");
    label.innerText = 'Dest';
    label.setAttribute("style", "display:block;");

    var dest = src.cloneNode(true);
    dest.setAttribute("class", "dest");
    span.appendChild(label);
    span.appendChild(dest);
    mappingElement.appendChild(span);

    /* Dest ID */
    span = document.createElement("span");
    span.setAttribute("style", "max-width:10%;display:inline-block;");
    label = document.createElement("label");
    label.innerText = 'Dest ID';
    label.setAttribute("style", "display:block;");

    var destId = document.createElement("select");
    for (var i = 0; i < maxOutput; i++) {
        var option  = document.createElement("option");
        option.value = i;
        option.text = "Output " + (i + 1);
        destId.add(option);
    }
    destId.setAttribute("class", "destId");
    span.appendChild(label);
    span.appendChild(destId);
    mappingElement.appendChild(span);

    /* Max */
    span = document.createElement("span");
    span.setAttribute("style", "max-width:10%;display:inline-block;");
    label = document.createElement("label");
    label.innerText = 'Max';
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
    span.setAttribute("style", "max-width:10%;display:inline-block;");
    label = document.createElement("label");
    label.innerText = 'Thres';
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
    span.setAttribute("style", "max-width:10%;display:inline-block;");
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
    span.setAttribute("style", "max-width:10%;display:inline-block;");
    label = document.createElement("label");
    label.innerText = 'Turbo';
    label.setAttribute("style", "display:block;");

    var turbo = document.createElement("select");
    for (var i = 0; i < maxTurbo; i++) {
        var option  = document.createElement("option");
        option.value = i;
        if (i) {
            option.text = "Framerate/" + i;
        }
        else {
            option.text = "Disable";
        }
        turbo.add(option);
    }
    turbo.setAttribute("class", "turbo");
    span.appendChild(label);
    span.appendChild(turbo);
    mappingElement.appendChild(span);

    /* Scaling */
    span = document.createElement("span");
    span.setAttribute("style", "max-width:10%;display:inline-block;");
    label = document.createElement("label");
    label.innerText = 'Scaling';
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
    span.setAttribute("style", "max-width:10%;display:inline-block;");
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
    addButton.innerText = '+';
    addButton.addEventListener("click", addInput);

    /* Save */
    divSave = document.createElement("div");

    var btn = document.createElement("button");
    btn.id = "inputSave";
    btn.innerText = 'Save';
    btn.addEventListener("click", saveInput);
    divSave.appendChild(btn);
    divSave.setAttribute("style", "margin-top:1em;");

    /* Append first cfg */
    divMappingGrp = document.createElement("div");
    divMapping = document.createElement("div");
    divMapping.appendChild(mappingElement);
    divMapping.id = "divMapping";
    var divInputCfg = document.getElementById("divInputCfg");
    divMappingGrp.appendChild(divMapping);
    divMappingGrp.appendChild(addButton);
    divMappingGrp.appendChild(divSave);
    divInputCfg.appendChild(divMappingGrp);
}

function initOutputMapping() {
    mappingElement = document.createElement("div");

    /* Src */
    var src = document.createElement("select");
    src.setAttribute("style", "max-width:10%;");
    for (var i = 0; i < btnList.length; i++) {
        var option  = document.createElement("option");
        option.value = i;
        option.text = btnList[i];
        src.add(option);
    }
    src.setAttribute("class", "src");
    mappingElement.appendChild(src);

    /* Dest */
    var dest = src.cloneNode(true);
    dest.setAttribute("class", "dest");
    mappingElement.appendChild(dest);

    /* Dest ID */
    var destId = document.createElement("select");
    destId.setAttribute("style", "max-width:10%;");
    for (var i = 0; i < maxOutput; i++) {
        var option  = document.createElement("option");
        option.value = i;
        option.text = "Output " + (i + 1);
        destId.add(option);
    }
    destId.setAttribute("class", "destId");
    mappingElement.appendChild(destId);

    /* Max */
    var max = document.createElement("select");
    max.setAttribute("style", "max-width:10%;");
    for (var i = 0; i <= maxMax; i += 5) {
        var option  = document.createElement("option");
        option.value = i;
        option.text = i + "%";
        max.add(option);
    }
    max.setAttribute("class", "max");
    max.value = 100;
    mappingElement.appendChild(max);

    /* Threshold */
    var thres = document.createElement("select");
    thres.setAttribute("style", "thres-width:10%;");
    for (var i = 0; i <= maxThres; i += 5) {
        var option  = document.createElement("option");
        option.value = i;
        option.text = i + "%";
        thres.add(option);
    }
    thres.setAttribute("class", "thres");
    thres.value = 50;
    mappingElement.appendChild(thres);

    /* Deadone */
    var dz = document.createElement("select");
    dz.setAttribute("style", "dz-width:10%;");
    for (var i = 0; i <= maxMax; i += 5) {
        var option  = document.createElement("option");
        option.value = i;
        option.text = i/10000 + "%";
        dz.add(option);
    }
    dz.setAttribute("class", "dz");
    dz.value = 135;
    mappingElement.appendChild(dz);

    /* Turbo */
    var turbo = document.createElement("select");
    turbo.setAttribute("style", "max-width:10%;");
    for (var i = 0; i < maxTurbo; i++) {
        var option  = document.createElement("option");
        option.value = i;
        if (i) {
            option.text = "Framerate/" + i;
        }
        else {
            option.text = "Disable";
        }
        turbo.add(option);
    }
    turbo.setAttribute("class", "turbo");
    mappingElement.appendChild(turbo);

    /* Scaling */
    var sca = document.createElement("select");
    sca.setAttribute("style", "max-width:10%;");
    for (var i = 0; i < scaling.length; i++) {
        var option  = document.createElement("option");
        option.value = i;
        option.text = scaling[i];
        sca.add(option);
    }
    sca.setAttribute("class", "scaling");
    mappingElement.appendChild(sca);

    /* Scaling diag */
    var diag = document.createElement("select");
    diag.setAttribute("style", "max-width:10%;");
    for (var i = 0; i < diagScaling.length; i++) {
        var option  = document.createElement("option");
        option.value = i;
        option.text = diagScaling[i];
        diag.add(option);
    }
    diag.setAttribute("class", "diag");
    mappingElement.appendChild(diag);
}

function initBlueRetroCfg() {
    initGlobalCfg();
    initOutputSelect();
    initOutputMode();
    initInputSelect();
    //initInputAssign();
    initFirstOutputMapping();
    initOutputMapping();
    pageInit = 1;
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
            document.getElementById("multitapCfg").value = value.getUint8(1);
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
            for (var i = 0; i < src.length; i++) {
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
    var data = new Uint8Array(2);
    data[0] = document.getElementById("systemCfg").value;
    data[1] = document.getElementById("multitapCfg").value;
    return new Promise(function(resolve, reject) {
        log('Get Global Config CHRC...');
        brService.getCharacteristic(brUuid[1])
        .then(chrc => {
            log('Writing Global Config...');
            return chrc.writeValue(data);
        })
        .then(_ => {
            log('Global Config saved');
            resolve();
        })
        .catch(error => {
            reject(error);
        });
    });
}

function saveOutput() {
    var data = new Uint8Array(2);
    data[0] = document.getElementById("outputMode").value;
    data[1] = document.getElementById("outputAcc").value;
    cfgId = document.getElementById("outputSelect").value;
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
            log('Writing Output ' + cfgId + ' Config...');
            return chrc.writeValue(data);
        })
        .then(_ => {
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
    var cfgSize = nbMapping*8 + 3;
    var cfg = new Uint8Array(cfgSize);
    cfgId = document.getElementById("inputSelect").value;

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
    document.getElementById("divBtDisconn").style.display = 'none';
    document.getElementById("divGlobalCfg").style.display = 'none';
    document.getElementById("divOutputCfg").style.display = 'none';
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
        return loadGlobalCfg();
    })
    .then(() => {
        return loadOutputCfg(0);
    })
    .then(() => {
        return loadInputCfg(0);
    })
    .then(() => {
        document.getElementById("divBtConn").style.display = 'none';
        //document.getElementById("divBtDisconn").style.display = 'block';
        document.getElementById("divGlobalCfg").style.display = 'block';
        document.getElementById("divOutputCfg").style.display = 'block';
        document.getElementById("divInputCfg").style.display = 'block';
    })
    .catch(error => {
        log('Argh! ' + error);
    });
}

function btDisconn() {
    if (!bluetoothDevice) {
        return;
    }
    log('Disconnecting from Bluetooth Device...');
    if (bluetoothDevice.gatt.connected) {
        bluetoothDevice.gatt.disconnect();
    } else {
        log('> Bluetooth Device is already disconnected');
    }
    onDisconnected();
}

function addInput() {
    if (nbMapping < maxMapping){
        nbMapping++;
        var div = document.getElementById("divMapping");
        var newSubDiv = mappingElement.cloneNode(true);
        var newButton = document.createElement("button");
        newButton.innerText = '-';
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
