const Serializer = require("../serialize");
const handleSet = require("./set");
const { handleGet, handleExists, handleDelete } = require("./get");
const { handleIncrease, handleDecrease } = require("./incrAndDecr");
const { handlePush } = require("./push");
const { save } = require("./save");

const handleCommand = (data) => {
  const command = data[0].toUpperCase();
  switch (command) {
    case "PING":
      return "+PONG\r\n";
    case "ECHO":
      return new Serializer(data[1]).serialize();
    case "SET":
      return handleSet(data);
    case "GET":
      return handleGet(data);
    case "EXISTS":
      return handleExists(data);
    case "DEL":
      return handleDelete(data);
    case "INCR":
      return handleIncrease(data);
    case "DECR":
      return handleDecrease(data);
    case "LPUSH":
      return handlePush(data, "L");
    case "RPUSH":
      return handlePush(data, "R");
    case "SAVE":
      return save(data);
    default:
      throw new Error(`UNKNOWN_COMMAND: ${command}`);
  }
};

module.exports = handleCommand;
