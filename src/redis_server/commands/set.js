const { store, expireMap } = require("../store");

const hasTimeElapsed = (time, option) => {
  if (option === "EXAT") {
    return time * 1000 < Date.now();
  }
  if (option === "PXAT") {
    return time < Date.now();
  }
  return false;
};

const setValue = (key, value, expiryTime) => {
  store.set(key, value);

  if (expiryTime) {
    expireMap.set(key, expiryTime);
  }

  return "+OK\r\n";
};

const handleSet = (data) => {
  const [_, key, value, expiryOption, time] = data;

  if (expiryOption && time) {
    const expiryTime = parseInt(time.toString());

    if (hasTimeElapsed(expiryTime, expiryOption)) {
      return "+OK\r\n";
    }

    switch (expiryOption) {
      case "EX":
        return setValue(key, value, expiryTime * 1000 + Date.now());
      case "PX":
        return setValue(key, value, expiryTime + Date.now());
      case "EXAT":
        return setValue(key, value, expiryTime * 1000);
      case "PXAT":
        return setValue(key, value, expiryTime);
    }
  }
  return setValue(key, value);
};

module.exports = handleSet;
