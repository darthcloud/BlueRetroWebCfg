import { brUuid, vmuSize } from "../utils/constants.js";
import dcReadFileRecursive from "./dcReadFileRecursive.js";

export const dcReadFile = (brService, setProgress, cancel) => {
    var data = new Uint8Array(vmuSize);
    return new Promise((resolve, reject) => {
      var offset = new Uint32Array(1);
      let ctrl_chrc = null;
      brService
        .getCharacteristic(brUuid[10])
        .then((chrc) => {
          ctrl_chrc = chrc;
          offset[0] = 0;
          return ctrl_chrc.writeValue(offset);
        })
        .then((_) => {
          return brService.getCharacteristic(brUuid[11]);
        })
        .then((chrc) => {
          return dcReadFileRecursive(chrc, data, 0, setProgress, cancel);
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

  export default dcReadFile;