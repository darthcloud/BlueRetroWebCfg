import { mtu, block } from "../utils/constants";

export const n64WriteRecursive = (chrc, data, offset, transferProgressHook, cancelRef) => {
    return new Promise(function (resolve, reject) {
      var curBlock = ~~(offset / block) + 1;
      if (cancelRef.current === 1) {
        throw new Error("Cancelled");
      }
      transferProgressHook(progress(data.byteLength, offset));
      let tmpViewSize = curBlock * block - offset;
      if (tmpViewSize > mtu) {
        tmpViewSize = mtu;
      }
      var tmpView = new DataView(data, offset, tmpViewSize);
      chrc
        .writeValue(tmpView)
        .then((_) => {
          offset += tmpViewSize;
          if (offset < data.byteLength) {
            resolve(n64WriteRecursive(chrc, data, offset, transferProgressHook, cancelRef));
          } else {
            resolve();
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  const progress = (total, loaded) => {
    var percentLoaded = Math.round((loaded / total) * 100);
    // Increase the progress bar length.
    if (percentLoaded < 100) {
      return percentLoaded;
    }
  };

  export default n64WriteRecursive;