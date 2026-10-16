import { brUuid, cfg_cmd_sys_factory } from "../utils/constants.js";
import ChromeSamples from "../utils/ChromeSamples.js";

export function setFactoryReset(brService) {
    var cmd = new Uint8Array(1);
    let ctrl_chrc = null;
    brService
      .getCharacteristic(brUuid[7])
      .then((chrc) => {
        ctrl_chrc = chrc;
        cmd[0] = cfg_cmd_sys_factory;
        return ctrl_chrc.writeValue(cmd);
      })
      .catch((error) => {
        ChromeSamples.log("Argh! " + error);
        return ctrl_chrc.writeValue(cmd);
      });
  }

  export default setFactoryReset;