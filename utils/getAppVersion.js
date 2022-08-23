import ChromeSamples from "./ChromeSamples";
import { brUuid } from "../utils/constants";

export const getAppVersion = (service) => {
  return new Promise((resolve, reject) => {
    service
      .getCharacteristic(brUuid[9])
      .then((chrc) => {
        ChromeSamples.log("Reading App version...");
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

export default getAppVersion;
