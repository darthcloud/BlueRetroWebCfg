import { brUuid } from "../utils/constants.js";

export const getGameId = (service) => {
  return new Promise((resolve, reject) => {
    service
      .getCharacteristic(brUuid[7])
      .then((chrc) => {
        var cmd_chrc = chrc;
        cmd[0] = cfg_cmd_get_gameid;
        return cmd_chrc.writeValue(cmd);
      })
      .then((_) => {
        return cmd_chrc.readValue();
      })
      .then((value) => {
        let enc = new TextDecoder("utf-8");
        let gameid = enc.decode(value);
        resolve(gameid);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export default getGameId;
