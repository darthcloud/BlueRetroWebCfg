import ChromeSamples from "./ChromeSamples"
import { brUuid } from "../utils/constants";

export const getApiVersion = (service) => {
    return new Promise((resolve, reject) => {
      service
        .getCharacteristic(brUuid[6])
        .then((chrc) => {
          ChromeSamples.log("Reading Api version...");
          return chrc.readValue();
        })
        .then((value) => {
          resolve(value);
        })
        .catch((error) => {
          reject(error);
        });
      
    });
  };
  export default getApiVersion;