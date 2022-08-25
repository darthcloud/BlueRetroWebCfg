import { brUuid, sys_deep_sleep } from "../utils/constants.js";
import ChromeSamples from "../utils/ChromeSamples.js";

export function setDeepSleep(brService) {
    var cmd = new Uint8Array(1);
    let ctrl_chrc = null;
    brService
      .getCharacteristic(brUuid[7])
      .then((chrc) => {
        ctrl_chrc = chrc;
        cmd[0] = sys_deep_sleep;
        return ctrl_chrc.writeValue(cmd);
      })
      .catch((error) => {
        ChromeSamples.log("Argh! " + error);
        return ctrl_chrc.writeValue(cmd);
      });
  }

export default setDeepSleep;