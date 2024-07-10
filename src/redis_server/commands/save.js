const fs = require("fs");
const { store, expireMap } = require("../store");

const RDB_File = "store.json";
const expiry_RDB_File = "expiry.json";

const save = () => {
  const str = JSON.stringify(Array.from(store.entries()));
  const expiryStr = JSON.stringify(Array.from(expireMap.entries()));
  fs.writeFile(RDB_File, str, (err) => {
    if (err) {
      return;
    }
  });
  fs.writeFile(expiry_RDB_File, expiryStr, (err) => {
    if (err) {
      return;
    }
  });

  return "+OK\r\n";
};

const loadOnStartup = () => {
  fs.readFile(RDB_File, "utf8", (err, data) => {
    if (err) {
      return;
    }
    const entries = JSON.parse(data);
    for (const [key, value] of entries) {
      store.set(key, value);
    }
    console.log("store backup loaded on startup");
  });

  fs.readFile(expiry_RDB_File, "utf8", (err, data) => {
    if (err) {
      return;
    }

    const entries = JSON.parse(data);
    for (const [key, value] of entries) {
      expireMap.set(key, value);
    }
    console.log("expiry map backup loaded on startup");
  });
};

module.exports = { save, loadOnStartup };
