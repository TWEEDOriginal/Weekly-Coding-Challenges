const Deserializer = require("../deserialize");

describe("Valid test cases (happy path)", () => {
  const inputs = [
    "+OK\r\n",
    "-Error message\r\n",
    ":0\r\n",
    "$5\r\nhello\r\n",
    "$0\r\n\r\n",
    "$-1\r\n",
    "*-1\r\n",
    "*0\r\n",
    "*2\r\n$5\r\nhello\r\n$5\r\nworld\r\n",
    "*3\r\n:1\r\n:2\r\n:3\r\n",
    "*2\r\n*3\r\n:1\r\n:2\r\n:3\r\n*2\r\n+Hello\r\n-World\r\n",
    "*3\r\n$5\r\nhello\r\n$-1\r\n$5\r\nworld\r\n",
    "*1\r\n$4\r\nping\r\n",
    "*2\r\n$4\r\necho\r\n$11\r\nhello world\r\n",
    "*2\r\n$3\r\nget\r\n$3\r\nkey\r\n",
    "+hello world\r\n",
  ];

  const outputs = [
    "OK",
    new Error("Error message"),
    0,
    "hello",
    "",
    null,
    null,
    [],
    ["hello", "world"],
    [1, 2, 3],
    [
      [1, 2, 3],
      ["Hello", new Error("World")],
    ],
    ["hello", null, "world"],
    ["ping"],
    ["echo", "hello world"],
    ["get", "key"],
    "hello world",
  ];

  inputs.forEach((input, index) => {
    test(`Testing ${JSON.stringify(input)}`, () => {
      expect(new Deserializer(input).deserialize()).toStrictEqual(
        outputs[index]
      );
    });
  });
});

describe("Invalid test cases", () => {
  const inputs = ["", "*2", "+Hello World\r\n*", "*3\r\n+arr\r\n"];

  inputs.forEach((input) => {
    test(`Testing ${JSON.stringify(input)}`, () => {
      expect(() => new Deserializer(input).deserialize()).toThrow(Error);
    });
  });
});
