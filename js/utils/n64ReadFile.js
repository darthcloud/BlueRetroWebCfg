import { brUuid, pakSize } from "../utils/constants.js";
import n64ReadFileRecursive from "./n64ReadFileRecursive.js";

export const n64ReadFile = (brService, pak, setProgress, cancel) => {
    var data = new Uint8Array(pakSize);
    return new Promise((resolve, reject) => {
      var offset = new Uint32Array(1);
      let ctrl_chrc = null;
      brService
        .getCharacteristic(brUuid[10])
        .then((chrc) => {
          ctrl_chrc = chrc;
          offset[0] = Number(pak) * pakSize;
          return ctrl_chrc.writeValue(offset);
        })
        .then((_) => {
          return brService.getCharacteristic(brUuid[11]);
        })
        .then((chrc) => {
          return n64ReadFileRecursive(chrc, data, 0, setProgress, cancel);
        })
        .then((_) => {
          offset[0] = 0;
          return ctrl_chrc.writeValue(offset);
        })
        .then((_) => {
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  export default n64ReadFile;