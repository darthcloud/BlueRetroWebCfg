import { brUuid, sys_reset } from "../utils/constants.js";
import ChromeSamples from "../utils/ChromeSamples.js";

export function setReset(brService) {
    var cmd = new Uint8Array(1);
    let ctrl_chrc = null;
    brService
      .getCharacteristic(brUuid[7])
      .then((chrc) => {
        ctrl_chrc = chrc;
        cmd[0] = sys_reset;
        return ctrl_chrc.writeValue(cmd);
      })
      .catch((error) => {
        ChromeSamples.log("Argh! " + error);
        return ctrl_chrc.writeValue(cmd);
      });
  }

  export default setReset;