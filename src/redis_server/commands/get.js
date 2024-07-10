const Serializer = require("../serialize");
const { store, expireMap } = require("../store");

const hasKeyExpired = (key) => {
  if (expireMap.has(key) && expireMap.get(key) <= Date.now()) {
    expireMap.delete(key);
    store.delete(key);
  }
};

const handleGet = (data) => {
  const key = data[1];
  hasKeyExpired(key);

  const res = store.get(key) ?? null;
  return new Serializer(res).serialize();
};

const handleExists = (data) => {
  let count = 0;
  for (let i = 1; i < data.length; i++) {
    const key = data[i];
    hasKeyExpired(key);
    if (store.has(key)) count++;
  }
  return new Serializer(count).serialize();
};

const handleDelete = (data) => {
  let count = 0;
  for (let i = 1; i < data.length; i++) {
    const key = data[i];
    if (store.has(key)) {
      expireMap.delete(key);
      store.delete(key);
      count++;
    }
  }
  return new Serializer(count).serialize();
};

module.exports = { handleGet, handleExists, handleDelete, hasKeyExpired };
