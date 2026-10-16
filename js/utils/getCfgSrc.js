import { brUuid, cfg_cmd_get_cfg_src } from "../utils/constants.js";

export const getCfgSrc = (service) => {
    return new Promise((resolve, reject) => {
      var cmd = new Uint8Array(1);
      var cmd_chrc;
      service
        .getCharacteristic(brUuid[7])
        .then((chrc) => {
          cmd_chrc = chrc;
          cmd[0] = cfg_cmd_get_cfg_src;
          return cmd_chrc.writeValue(cmd);
        })
        .then((_) => {
          return cmd_chrc.readValue();
        })
        .then((value) => {
          resolve(value.getUint8(0));
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  export default getCfgSrc;