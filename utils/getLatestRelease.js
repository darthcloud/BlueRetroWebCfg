import { urlLatestRelease } from "../utils/constants.js";

export const getLatestRelease = () => {
  return new Promise((resolve, reject) => {
    fetch(urlLatestRelease)
      .then((rsp) => {
        return rsp.json();
      })
      .then((data) => {
        let latest_ver = data['tag_name'];
        resolve(latest_ver);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export default getLatestRelease;
