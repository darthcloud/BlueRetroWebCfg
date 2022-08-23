import { brUuid } from '../utils//constants';
import ChromeSamples from "../utils/ChromeSamples"
function saveOutputCfg(brService, data, cfgId) {
    return new Promise(function (resolve, reject) {
      ChromeSamples.log("Get Output " + cfgId + " CTRL CHRC...");
      brService
        .getCharacteristic(brUuid[2])
        .then((chrc) => {
          ChromeSamples.log("Set Output " + cfgId + " on CTRL chrc...");
          var outputCtrl = new Uint16Array(1);
          outputCtrl[0] = Number(cfgId);
          return chrc.writeValue(outputCtrl);
        })
        .then((_) => {
          ChromeSamples.log("Get Output " + cfgId + " DATA CHRC...");
          return brService.getCharacteristic(brUuid[3]);
        })
        .then((chrc) => {
          ChromeSamples.log("Writing Output " + cfgId + " Config...");
          return chrc.writeValue(data);
        })
        .then((_) => {
          //document.getElementById("outputSaveText").style.display = "block";
          
          ChromeSamples.log("Output " + cfgId + " Config saved");
          if (data[0] === 3) {
            ChromeSamples.log("Mouse mode require setting <Default Mouse> preset.");
          }
          ChromeSamples.log("Please power cycle your BlueRetro device");
          //setInUse(false);
          resolve();
        })
        .catch((error) => {
          //setInUse(false);
          reject(error);
        });
    });
  }

  export default saveOutputCfg