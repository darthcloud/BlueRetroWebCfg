import { brUuid } from "./constants";
import presetWriteRecursive from "./presetWriteRecursive";

export function writeInputCfg(cfgId, cfg, brService) {
    return new Promise(function (resolve, reject) {
      let ctrl_chrc = null;
      let data_chrc = null;
      brService
        .getCharacteristic(brUuid[4])
        .then((chrc) => {
          ctrl_chrc = chrc;
          return brService.getCharacteristic(brUuid[5]);
        })
        .then((chrc) => {
          var inputCtrl = new Uint16Array(2);
          inputCtrl[0] = Number(cfgId);
          inputCtrl[1] = 0;
          data_chrc = chrc;
          return presetWriteRecursive(cfg, inputCtrl, ctrl_chrc, data_chrc);
        })
        .then((_) => {
          resolve(cfg);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  export default writeInputCfg;