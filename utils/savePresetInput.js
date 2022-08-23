import ChromeSamples from "../utils/ChromeSamples";
import writeInputCfg from "./writeInputCfg";
import {btn} from "../utils/constants";

export function savePresetInput(preset, brService, input) {
    //make sure preset is not placeholder before we do anything
      var nbMapping = preset.map.length;
      var cfgSize = nbMapping * 8 + 3;
      var cfg = new Uint8Array(cfgSize);
      var cfgId = input - 1;
      var j = 0;
      cfg[j++] = 0;
      cfg[j++] = 0;
      cfg[j++] = nbMapping;
      for (var i = 0; i < nbMapping; i++) {
        cfg[j++] = btn[preset.map[i][0]];
        cfg[j++] = btn[preset.map[i][1]];
        cfg[j++] = preset.map[i][2] + cfgId;
        cfg[j++] = preset.map[i][3];
        cfg[j++] = preset.map[i][4];
        cfg[j++] = preset.map[i][5];
        cfg[j++] = preset.map[i][6];
        cfg[j++] =
          Number(preset.map[i][7]) |
          (Number(preset.map[i][8]) << 4);
      }
  
      return new Promise(function (resolve, reject) {
        writeInputCfg(cfgId, cfg, brService)
          .then((_) => {
            ChromeSamples.log("Input " + cfgId + " Config saved");
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    
  }

  export default savePresetInput;