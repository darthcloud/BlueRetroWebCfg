import { brUuid, cfg_cmd_set_default_cfg } from "../utils/constants.js";

export const setDefaultCfg = (service) => {
  return new Promise((resolve, reject) => {
    var cmd = new Uint8Array(1);
    service
      .getCharacteristic(brUuid[7])
      .then((chrc) => {
        cmd[0] = cfg_cmd_set_default_cfg;
        return chrc.writeValue(cmd);
      })
      .then((_) => {
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export default setDefaultCfg;
