#! /usr/bin/env node
const fs = require("fs");
const readline = require("readline");

const getFields = async ({ file, indices, delimiter }) => {
  if (file === "-" || !fs.existsSync(file)) stream = process.stdin;
  else {
    stream = fs.createReadStream(file);
  }

  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: stream,
      output: undefined,
      terminal: false,
    });
    const res = [];

    rl.on("line", function (line) {
      //split each line by delimiter
      const fields = line.split(delimiter);
      // list of fields to be printed out
      let requiredFields = [];
      for (let index of indices) {
        requiredFields.push(fields[index - 1]);
      }
      res.push(requiredFields);
    });
    rl.on("close", function () {
      resolve(res);
    });
  });
};

const getOptionFileAndIndices = (args, optionPosition, filePosition) => {
  let indices;
  const lists = args[optionPosition].slice(2);

  let seperator = " ";
  if (lists.includes(",")) seperator = ",";

  indices = lists.split(seperator).map((index) => parseInt(index));

  return [args[optionPosition].slice(0, 2), args[filePosition], indices];
};

async function main() {
  const args = process.argv;

  const validOptions = new Set(["-f"]);
  var option,
    file,
    indices = [];
  // default to tab
  let delimiter = "\t";

  for (let i = args.length - 1; i >= 2; i--) {
    if (validOptions.has(args[i].slice(0, 2))) {
      [option, file, indices] = getOptionFileAndIndices(
        args,
        i,
        args.length - 1
      );
    }
    if (args[i].slice(0, 2) === "-d") delimiter = args[i].slice(2);
  }

  const logResult = async (operation, file, indices, delimiter) => {
    const res = await operation({ file, indices, delimiter });
    for (let portion of res) {
      //Output fields are separated by the delimiter character
      console.log(portion.join(delimiter));
    }
  };

  switch (option) {
    case "-f": {
      logResult(getFields, file, indices, delimiter);
      break;
    }

    default:
      return;
  }
}

main()
  .then()
  .catch((e) => console.error("No such file or invalid option"));
