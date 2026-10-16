import ChromeSamples from "./ChromeSamples.js"
import { brUuid } from "../utils/constants.js";

export const getApiVersion = (service) => {
    return new Promise((resolve, reject) => {
      service
        .getCharacteristic(brUuid[6])
        .then((chrc) => {
          ChromeSamples.log("Reading Api version...");
          return chrc.readValue();
        })
        .then((value) => {
          resolve(value.getUint8(0));
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  export default getApiVersion;