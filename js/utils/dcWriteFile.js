import { brUuid } from "../utils/constants.js";
import dcWriteRecursive from "../utils/dcWriteRecursive.js";

export const dcWriteFile = (brService, data, setProgress, cancel) => {
  var offset = new Uint32Array(1);
  let ctrl_chrc = null;
  return new Promise((resolve, reject) => {
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
        return dcWriteRecursive(chrc, data, 0, setProgress, cancel);
      })
      .then((_) => {
        offset[0] = 0;
        return ctrl_chrc.writeValue(offset);
      })
      .then((_) => {
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export default dcWriteFile;
