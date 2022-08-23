import { brUuid } from "../utils/constants";
import ChromeSamples from "./ChromeSamples"

export function saveGlobalCfg(brService, globalCfg) {
    return new Promise(function (resolve, reject) {
      ChromeSamples.log("Get Global Config CHRC...");
      brService
        .getCharacteristic(brUuid[1])
        .then((chrc) => {
          ChromeSamples.log("Writing Global Config...");
          return chrc.writeValue(globalCfg);
        })
        .then((_) => {
          ChromeSamples.log("Global Config saved");
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  export default saveGlobalCfg;