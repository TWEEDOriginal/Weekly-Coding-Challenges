const Serializer = require("../serialize");

describe("Valid test cases (happy path)", () => {
  const inputs = [
    "OK",
    new Error("Error message"),
    0,
    "hello",
    "",
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
  const outputs = [
    "$2\r\nOK\r\n",
    "-Error message\r\n",
    ":0\r\n",
    "$5\r\nhello\r\n",
    "$0\r\n\r\n",
    "$-1\r\n",
    "*0\r\n",
    "*2\r\n$5\r\nhello\r\n$5\r\nworld\r\n",
    "*3\r\n:1\r\n:2\r\n:3\r\n",
    "*2\r\n*3\r\n:1\r\n:2\r\n:3\r\n*2\r\n$5\r\nHello\r\n-World\r\n",
    "*3\r\n$5\r\nhello\r\n$-1\r\n$5\r\nworld\r\n",
    "*1\r\n$4\r\nping\r\n",
    "*2\r\n$4\r\necho\r\n$11\r\nhello world\r\n",
    "*2\r\n$3\r\nget\r\n$3\r\nkey\r\n",
    "$11\r\nhello world\r\n",
  ];

  inputs.forEach((input, index) => {
    test(`Testing ${JSON.stringify(input)}`, () => {
      expect(new Serializer(input).serialize()).toStrictEqual(outputs[index]);
    });
  });
});

describe("Invalid test cases", () => {
  const arrays = [[{}], {}, [1, [2, {}]]];

  arrays.forEach((input) => {
    test(`Testing ${input.toString()}`, () => {
      expect(() => serializer.serialize(input)).toThrow(Error);
    });
  });
});
