import { brUuid } from "../utils/constants.js";

export const getStringCmd = (service, command) => {
  return new Promise((resolve, reject) => {
    var cmd = new Uint8Array(1);
    var cmd_chrc;
    service
      .getCharacteristic(brUuid[7])
      .then((chrc) => {
        cmd_chrc = chrc;
        cmd[0] = command;
        return cmd_chrc.writeValue(cmd);
      })
      .then((_) => {
        return cmd_chrc.readValue();
      })
      .then((value) => {
        let enc = new TextDecoder("utf-8");
        let string = enc.decode(value);
        resolve(string);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export default getStringCmd;
