import ChromeSamples from "./ChromeSamples";
import { brUuid } from "../utils/constants";

export const getGlobalCfg = (service, apiver) => {
  return new Promise((resolve, reject) => {
    if (apiver === -1) {
      reject(Error("failed to get API version"));
    }
    service
      .getCharacteristic(brUuid[1])
      .then((chrc) => {
        ChromeSamples.log("Reading Global Config...");
        return chrc.readValue();
      })
      .then((value) => {
        ChromeSamples.log("Global Config size: " + value.byteLength);
        //get global config size from apiVersion
        var temp = new Uint8Array(2);

        if (apiver > 0) {
          temp = new Uint8Array(3);
        }
        if (apiver > 1) {
          temp = new Uint8Array(4);
        }

        //systemCfg value
        temp[0] = value.getUint8(0);
        //multitapCfg value
        temp[1] = value.getUint8(1);
        if (apiver > 0) {
          temp[2] = value.getUint8(2);
        }
        if (apiver > 1) {
          //bank select value
          temp[3] = value.getUint8(3);
        }
        resolve(temp);
      });
  });
};

export default getGlobalCfg;
