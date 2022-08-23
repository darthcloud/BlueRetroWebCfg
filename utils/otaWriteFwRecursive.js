import { mtu } from "../utils/constants";

const otaWriteFwRecursive = (chrc, data, offset, setProgress, cancel) => {
    return new Promise(function (resolve, reject) {
      if (cancel.current === 1) {
        throw new Error("Cancelled");
      }
      setProgress(Math.round((offset / data.byteLength) * 100));
      var tmpViewSize = data.byteLength - offset;
      if (tmpViewSize > mtu) {
        tmpViewSize = mtu;
      }
      var tmpView = new DataView(data, offset, tmpViewSize);
      chrc
        .writeValue(tmpView)
        .then((_) => {
          offset += Number(mtu);
          if (offset < data.byteLength) {
            resolve(otaWriteFwRecursive(chrc, data, offset, setProgress, cancel));
          } else {
            //setShowCancel(false);
            //setProgress(0);
            resolve();
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  export default otaWriteFwRecursive