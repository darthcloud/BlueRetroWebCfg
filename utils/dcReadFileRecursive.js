import { vmuSize } from "../utils/constants.js";

export const dcReadFileRecursive = (chrc, data, offset, setProgress, cancel) => {
    return new Promise(function (resolve, reject) {
      if (cancel.current === 1) {
        throw new Error("Cancelled");
      }
      setProgress(Math.round((offset / vmuSize) * 100));
      chrc
        .readValue()
        .then((value) => {
          var tmp = new Uint8Array(value.buffer);
          data.set(tmp, offset);
          offset += value.byteLength;
          if (offset < vmuSize) {
            resolve(dcReadFileRecursive(chrc, data, offset, setProgress, cancel));
          } else {
            resolve(data);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  export default dcReadFileRecursive