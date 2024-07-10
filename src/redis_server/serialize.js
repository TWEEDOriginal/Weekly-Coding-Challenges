// serialise to Redis Serialisation Protocol (RESP) messages.

class Serializer {
  constructor(request) {
    this.input = request;
    this.output = "";
    this.stack = [];
  }
  serialize() {
    this.analyseType(this.input);
    while (this.stack.length > 0) {
      const topArray = this.stack[this.stack.length - 1];
      if (topArray.length > 0) {
        this.analyseType(topArray.shift());
      } else {
        this.stack.pop();
      }
    }
    return this.output;
  }

  analyseType(input) {
    if (Array.isArray(input)) {
      this.serializerArray(input);
    } else if (typeof input === "string") {
      this.serializeString(input);
    } else if (!isNaN(input) && typeof input === "number") {
      this.serializeInteger(input);
    } else if (input === null) {
      this.serializeNull();
    } else if (input instanceof Error) {
      this.serializerError(input);
    } else {
      throw new Error("Invalid input");
    }
  }

  serializerArray(input) {
    this.output += `*${input.length}\r\n`;
    this.stack.push(input);
  }

  serializeString(input) {
    this.output += `$${input.length}\r\n${input}\r\n`;
  }

  serializeInteger(input) {
    this.output += `:${input}\r\n`;
  }

  serializeNull() {
    this.output += "$-1\r\n";
  }

  serializerError(input) {
    this.output += `-${input.message}\r\n`;
  }
}

module.exports = Serializer;
