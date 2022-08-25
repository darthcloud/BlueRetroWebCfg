import { brUuid } from "../utils/constants.js";

export const getBdAddr = (service) => {
  return new Promise((resolve, reject) => {
    service
      .getCharacteristic(brUuid[12])
      .then((chrc) => {
        return chrc.readValue();
      })
      .then((value) => {
        let bdaddr = value.getUint8(5).toString(16).padStart(2, '0') + ':'
                + value.getUint8(4).toString(16).padStart(2, '0') + ':'
                + value.getUint8(3).toString(16).padStart(2, '0') + ':'
                + value.getUint8(2).toString(16).padStart(2, '0') + ':'
                + value.getUint8(1).toString(16).padStart(2, '0') + ':'
                + value.getUint8(0).toString(16).padStart(2, '0');
        resolve(bdaddr);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export default getBdAddr;
