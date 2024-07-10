const Serializer = require("../serialize");
const { store } = require("../store");
const { hasKeyExpired } = require("./get");

const handleIncrease = (data) => {
  const key = data[1];
  hasKeyExpired(key);
  let value = store.get(key) ?? 0;
  value = Number(value);

  if (isNaN(value) || !Number.isInteger(value)) {
    throw new Error("value is not an integer or out of range");
  }
  value++;
  store.set(key, String(value));
  return new Serializer(value).serialize();
};

const handleDecrease = (data) => {
  const key = data[1];
  hasKeyExpired(key);
  let value = store.get(key) ?? 0;
  value = Number(value);

  if (isNaN(value) || !Number.isInteger(value)) {
    throw new Error("value is not an integer or out of range");
  }
  value--;
  store.set(key, String(value));
  return new Serializer(value).serialize();
};

module.exports = { handleIncrease, handleDecrease };
