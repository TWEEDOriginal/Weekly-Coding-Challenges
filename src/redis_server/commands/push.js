const Serializer = require("../serialize");
const { store } = require("../store");
const { hasKeyExpired } = require("./get");

const handlePush = (data, side) => {
  const key = data[1];
  hasKeyExpired(key);
  const list = store.get(key) ?? [];

  for (let i = 2; i < data.length; i++) {
    side === "L" ? list.unshift(data[i]) : list.push(data[i]);
  }

  store.set(key, list);
  return new Serializer(list.length).serialize();
};

module.exports = { handlePush };
