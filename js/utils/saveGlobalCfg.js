import { brUuid } from "../utils/constants.js";

export const saveGlobalCfg = (brService, globalCfg) => {
    return new Promise((resolve, reject) => {
      brService
        .getCharacteristic(brUuid[1])
        .then((chrc) => {
          return chrc.writeValue(globalCfg);
        })
        .then((_) => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  export default saveGlobalCfg;