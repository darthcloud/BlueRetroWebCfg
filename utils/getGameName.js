export const getGameName = (gameid) => {
  var db = null;
  return new Promise((resolve, reject) => {
    fetch("gameid.db")
      .then(rsp => {
        return rsp.arrayBuffer();
      })
      .then(data => {
        db = data;
        initSqlJs({ locateFile: file => `sql.js/${file}` }).then(function(SQL){
          let db = new SQL.Database(new Uint8Array(data));
          let gamename = db.exec('SELECT name FROM \'games\' WHERE id="'
            + gameid + '" LIMIT 1');
          resolve(gamename[0].values[0][0])
        });
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export default getGameName;
