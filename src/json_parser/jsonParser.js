const fs = require("fs").promises;

// group into list of characters
function lexer(str) {
  const tokens = [];

  for (let i = 0; i < str.length; i++) {
    char = str[i];

    if (char === "{") {
      tokens.push({ type: "BraceOpen", value: char });
    } else if (char === "}") {
      tokens.push({ type: "BraceClose", value: char });
    } else if (char === "[") {
      tokens.push({ type: "BracketOpen", value: char });
    } else if (char === "]") {
      tokens.push({ type: "BracketClose", value: char });
    } else if (char === ":") {
      tokens.push({ type: "Colon", value: char });
    } else if (char === ",") {
      tokens.push({ type: "Comma", value: char });
    } else if (char === '"') {
      let value = "";
      char = str[++i];
      while (char !== '"') {
        value += char;
        char = str[++i];
      }
      tokens.push({ type: "String", value });
    } else if (/[\d\w-+.]/.test(char)) {
      // if it's a number or a word character
      let value = "";
      while (/[\d\w-+.]/.test(char)) {
        value += char;
        char = str[++i];
      }
      // go back to last char
      i--;

      if (!isNaN(Number(value)))
        tokens.push({ type: "Number", value: Number(value) });
      else if (value === "true") tokens.push({ type: "True", value: true });
      else if (value === "false") tokens.push({ type: "False", value: false });
      else if (value === "null") tokens.push({ type: "Null", value: null });
      else tokens.push({ type: "Unknown", value });
    } else if (/\s/.test(char)) {
      // Skip whitespace
      continue;
    } else {
      tokens.push({ type: "Unknown", value: char });
    }
  }
  console.log(tokens);
  return tokens;
}
function parser(tokens) {
  function exitParser(errorMessage) {
    process.exitCode = 1;
    throw new Error(errorMessage);
  }

  if (tokens.length <= 0) {
    exitParser("Invalid JSON file: empty file");
  }

  let index = 0,
    token = tokens[0];

  if (!["BraceOpen", "BracketOpen"].includes(token.type))
    exitParser("A JSON payload should be an object or array");

  function advance() {
    token = tokens[++index];
    return token;
  }

  function parseValue() {
    const type = token?.type;
    switch (type) {
      case "String":
      case "Number":
      case "True":
      case "False":
      case "Null": {
        const value = token?.value;
        advance(); // skip value
        return value;
      }
      case "BraceOpen":
        return parseObject();
      case "BracketOpen":
        return parseArray();
      default: {
        exitParser(
          `Unexpected token. type: ${token?.type}, value: ${token?.value}`
        );
      }
    }
  }

  function parseObject() {
    const node = {};
    advance(); //skip '{'

    while (token && token.type !== "BraceClose") {
      if (token?.type === "String") {
        const key = token.value;
        advance();
        if (token?.type !== "Colon") {
          exitParser(
            `Expected : in key-value pair. Got type: ${token?.type}, value: ${token?.value} instead`
          );
        }
        advance(); // Skip ':'
        const value = parseValue(); // Recursively parse the value
        node[key] = value;
      } else {
        exitParser(
          `Expected String key in object. Token type: ${token?.type}, value: ${token?.value}`
        );
      }

      if (token?.type === "Comma") {
        advance(); // Skip ',' if present
        if (token?.type === "BraceClose") {
          exitParser("Trailing comma");
        }
      }
    }
    if (!token) exitParser("Unclosed Object");
    advance(); //skip '}'
    return node;
  }

  function parseArray() {
    const node = [];
    advance(); // Skip '['

    while (token && token.type !== "BracketClose") {
      const value = parseValue();
      node.push(value);

      if (token?.type === "Comma") {
        advance(); // Skip ',' if present
        if (token?.type === "BracketClose") {
          exitParser("Trailing comma");
        }
      }
    }
    if (!token) exitParser("Unclosed Array");

    advance(); //skip ']'

    return node;
  }

  const result = parseValue();
  if (index < tokens.length) {
    exitParser(
      `Invalid JSON file, unexpected end of string. Token type: ${token?.type}, value: ${token?.value}`
    );
  }
  console.info("Valid JSON file");
  process.exitCode = 0;
  return result;
}

async function parse(file) {
  console.info(file);
  const fileContent = await fs.readFile(file, "utf-8");
  const tokens = lexer(fileContent);
  return parser(tokens);
}

module.exports = parse;
