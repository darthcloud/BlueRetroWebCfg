import { pakSize } from "../utils/constants";

export const n64ReadFileRecursive = (chrc, data, offset, setProgress, cancel) => {
    return new Promise(function (resolve, reject) {
      if (cancel.current === 1) {
        throw new Error("Cancelled");
      }
      setProgress(Math.round((offset / pakSize) * 100));
      chrc
        .readValue()
        .then((value) => {
          var tmp = new Uint8Array(value.buffer);
          data.set(tmp, offset);
          offset += value.byteLength;
          if (offset < pakSize) {
            resolve(n64ReadFileRecursive(chrc, data, offset, setProgress, cancel));
          } else {
            resolve(data);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  export default n64ReadFileRecursive