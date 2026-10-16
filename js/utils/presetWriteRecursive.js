import ChromeSamples from "./ChromeSamples.js";

export function presetWriteRecursive(cfg, inputCtrl, ctrl_chrc, data_chrc) {
    return new Promise((resolve, reject) => {
      ChromeSamples.log("Set Input Ctrl CHRC... " + inputCtrl[1]);
      ctrl_chrc
        .writeValue(inputCtrl)
        .then((_) => {
          ChromeSamples.log("Writing Input Data CHRC...");
          var tmpViewSize = cfg.byteLength - inputCtrl[1];
          if (tmpViewSize > 512) {
            tmpViewSize = 512;
          }
          var tmpView = new DataView(cfg.buffer, inputCtrl[1], tmpViewSize);
          return data_chrc.writeValue(tmpView);
        })
        .then((_) => {
          ChromeSamples.log("Input Data Written");
          inputCtrl[1] += Number(512);
          if (inputCtrl[1] < cfg.byteLength) {
            resolve(presetWriteRecursive(cfg, inputCtrl, ctrl_chrc, data_chrc));
          } else {
            resolve();
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  export default presetWriteRecursive;