// de-serialise Redis Serialisation Protocol (RESP) messages.

class Deserializer {
  constructor(request) {
    this.input = request;
    this.index = 0;
    this.stack = [];
    this.output;
  }

  deserialize() {
    this.lexer();
    this.parser();
    return this.output;
  }

  lexer() {
    if (this.input.length === 0) {
      throw new Error("invalid input");
    }
    while (this.index < this.input.length) {
      const token = this.input[this.index];
      this.index++;

      switch (token) {
        case "+":
          this.analyseSimpleString();
          break;
        case "*":
          this.analyseArray();
          break;
        case "$":
          this.analyseBulkString();
          break;
        case "-":
          this.analyseError();
          break;
        case ":":
          this.analyseInteger();
          break;
        default:
          throw new Error(`Invalid token ${token} at ${this.index - 1}`);
      }
    }
  }

  parser() {
    let idx = this.stack.length - 1;
    while (idx >= 0) {
      const item = this.stack[idx];
      if (Array.isArray(item)) {
        for (let i = item.length - 1; i >= 0; i--) {
          if (this.stack.length <= idx + i + 1) {
            throw new Error("Invalid number of array items");
          }
          item[i] = this.stack[idx + i + 1];
          this.stack.splice(idx + i + 1, 1);
        }
      }
      idx--;
    }
    this.output = this.stack.pop();
  }

  analyseInteger() {
    this.stack.push(this.getNumberOfElements());
  }

  analyseSimpleString() {
    let value = "";
    while (!["\n", "\r"].includes(this.input[this.index])) {
      value += this.input[this.index];
      this.index++;
    }
    this.stack.push(value);

    // end with CRLF terminator
    this.terminateCRLF();
  }

  analyseArray() {
    const arrayLength = this.getNumberOfElements();

    if (arrayLength === -1) {
      this.stack.push(null);
    } else if (arrayLength === 0) {
      this.stack.push([]);
    } else {
      this.stack.push(new Array(arrayLength));
    }
  }

  analyseError() {
    let value = "";
    while (this.input[this.index] !== "\r") {
      value += this.input[this.index];
      this.index++;
    }
    this.stack.push(new Error(value));

    // end with CRLF terminator
    this.terminateCRLF();
  }

  analyseBulkString() {
    const len = this.getNumberOfElements();
    if (len === -1) {
      this.stack.push(null);
      return;
    }

    if (len > 0) {
      if (this.input.length <= this.index + len)
        throw new Error(`Invalid Bulk String length ${len}`);
      // get data
      this.stack.push(this.input.substring(this.index, this.index + len));
      this.index = this.index + len;
    } else {
      this.stack.push("");
    }

    // end with final CRLF terminator
    this.terminateCRLF();
  }

  getNumberOfElements() {
    let value = "";

    // positive or negative decimal digits
    while (/[\d-+]/.test(this.input[this.index])) {
      value += this.input[this.index];
      this.index++;
    }

    const noOfElements = parseInt(value);

    if (isNaN(noOfElements))
      throw new Error(`invalid token ${value}, not a digit at ${this.index}`);

    if (noOfElements < -1)
      throw new Error(`invalid number of elements ${noOfElements}`);

    this.terminateCRLF();
    return noOfElements;
  }

  terminateCRLF() {
    if (this.input.substring(this.index, this.index + 2) != "\r\n")
      throw new Error(`Expected CRLF terminator.`);

    this.index = this.index + 2;
  }
}

module.exports = Deserializer;
