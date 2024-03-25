#! /usr/bin/env node
const readline = require("readline");
const fs = require("fs");
const { getFileContent } = require("./utils");

const countBytes = async ({ file }) => {
  if (!file) {
    const readStream = process.stdin;
    let fileSizeInBytes = 0;

    for await (const chunk of readStream) fileSizeInBytes += chunk.length;

    return fileSizeInBytes;
  }
  const stats = fs.statSync(file);
  const fileSizeInBytes = stats.size;
  return fileSizeInBytes;
};

const countLinesAsync = (file) => {
  let linesCount = 0;
  const rl = readline.createInterface({
    input: fs.createReadStream(file),
    output: process.stdout,
    terminal: false,
  });
  rl.on("line", function (line) {
    linesCount++; // on each linebreak, add +1 to 'linesCount'
  });
  rl.on("close", function () {
    console.log(`${linesCount} ${file}`); // print the result when the 'close' event is called
  });
};

async function getFileContentAndByteSize(stream) {
  let fileContent = "";
  let fileSizeInBytes = 0;
  for await (const chunk of stream) {
    fileSizeInBytes += chunk.length;
    fileContent += chunk.toString("utf8");
  }
  return [fileContent, fileSizeInBytes];
}

const countLines = async ({ file, fileContent }) => {
  if (!fileContent) {
    fileContent = await getFileContent(file, "utf-8");
  }
  let count = 0;

  for (let i = 0; i < fileContent.length; i++) {
    const char = fileContent[i];
    // newline
    if (["\n", "\r\n"].includes(char)) {
      count++;
    }
  }
  return count;
};

const countWords = async ({ file, fileContent }) => {
  if (!fileContent) {
    fileContent = await getFileContent(file, "utf-8");
  }
  let count = 0;
  let word = "";

  for (let j = 0; j < fileContent.length; j++) {
    const char = fileContent[j];

    // space, newline or tab
    if ([" ", "\n", "\t", "\r"].includes(char)) {
      if (word !== "") {
        count++;
      }
      word = "";
    } else {
      word += char;
    }
  }
  return count;
};

const countCharacters = async ({ file, fileContent }) => {
  if (!fileContent) {
    fileContent = await getFileContent(file, "utf-8");
  }

  return fileContent.length;
};

const countLinesWordsAndBytes = async (file) => {
  let fileContent, fileSizeInBytes;
  if (file) {
    fileContent = fs.readFileSync(file, "utf-8");
    fileSizeInBytes = await countBytes({ file });
  } else {
    [fileContent, fileSizeInBytes] = await getFileContentAndByteSize(
      process.stdin
    );
  }

  console.log(
    `${await countLines({ fileContent })} ${await countWords({
      fileContent,
    })} ${fileSizeInBytes} ${file ? `(${file})` : ""}`
  );
};

async function main() {
  const args = process.argv;
  const validOptions = new Set(["-c", "-l", "-m", "-w"]);
  let option, file;

  //have option or file or both
  if (validOptions.has(args[args.length - 1])) {
    option = args[args.length - 1];
  } else if (validOptions.has(args[args.length - 2])) {
    option = args[args.length - 2];
    file = args[args.length - 1];
  } else {
    const split_file = args[args.length - 1].split("/");
    if (split_file[split_file.length - 1] !== "ccwc")
      file = args[args.length - 1];
  }

  const logCount = async (operation, file) => {
    const count = await operation({ file });
    console.log(`${count} ${file ? `${file}` : ""}`);
  };

  switch (option) {
    case "-c": {
      logCount(countBytes, file);
      break;
    }
    case "-l": {
      logCount(countLines, file);
      break;
    }
    case "-w": {
      logCount(countWords, file);
      break;
    }
    case "-m": {
      logCount(countCharacters, file);
      break;
    }
    default:
      await countLinesWordsAndBytes(file);
  }
}

if (require.main === module) {
  main()
    .then()
    .catch((e) => console.error("No such file or invalid option"));
}
