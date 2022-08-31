import { brUuid } from '../utils//constants.js';
import ChromeSamples from "../utils/ChromeSamples.js"

export const saveOutputCfg = (brService, data, cfgId) => {
    return new Promise((resolve, reject) => {
      ChromeSamples.log("Get Output " + cfgId + " CTRL CHRC...");
      brService
        .getCharacteristic(brUuid[2])
        .then((chrc) => {
          ChromeSamples.log("Set Output " + cfgId + " on CTRL chrc...");
          var outputCtrl = new Uint16Array(1);
          outputCtrl[0] = Number(cfgId);
          return chrc.writeValue(outputCtrl);
        })
        .then((_) => {
          ChromeSamples.log("Get Output " + cfgId + " DATA CHRC...");
          return brService.getCharacteristic(brUuid[3]);
        })
        .then((chrc) => {
          ChromeSamples.log("Writing Output " + cfgId + " Config...");
          return chrc.writeValue(data);
        })
        .then((_) => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  export default saveOutputCfg