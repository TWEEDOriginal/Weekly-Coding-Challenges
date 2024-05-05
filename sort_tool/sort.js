#! /usr/bin/env node
const fs = require("fs");
const readline = require("readline");
const {
  radixSort,
  mergeSort,
  quickSort,
  heapSort,
  randomSort,
  removeDuplicatesFromSortedArray,
  removeDuplicatesFromUnSortedArray,
} = require("./utils");

const heapInsert = async (file) => {
  if (!fs.existsSync(file)) stream = process.stdin;
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
      if (line.trim()) heapSort.insert(res, line.trim());
    });
    rl.on("close", function () {
      resolve(res);
    });
  });
};

async function main() {
  const args = process.argv;
  let file;
  let unique = false;
  let option;
  file = args[args.length - 1];

  const validSortOptions = new Set([
    "--radix-sort",
    "--quick-sort",
    "--heap-sort",
    "--merge-sort",
    "--random-sort",
  ]);
  for (let i = args.length - 2; i >= 2; i--) {
    if (args[i] === "-u") unique = true;

    if (validSortOptions.has(args[i])) option = args[i];
  }

  const fileContent =
    option === "--heap-sort"
      ? await heapInsert(file)
      : fs
          .readFileSync(file, "utf-8")
          .trim()
          .split(/\n|\r|\r\n/);

  const logResult = async (sortedArray, unique, randomSort) => {
    if (unique) {
      removeDuplicatesFromSortedArray(sortedArray);
      if (randomSort) {
        sortedArray = removeDuplicatesFromUnSortedArray(sortedArray);
      }
    }
    console.log(sortedArray.join("\n"));
  };

  switch (option) {
    case "--radix-sort": {
      logResult(radixSort(fileContent), unique);
      break;
    }
    // removes duplicates whilst sort
    case "--quick-sort": {
      logResult(quickSort(fileContent, unique));
      break;
    }
    case "--heap-sort": {
      logResult(heapSort.heapSort(fileContent, true), unique);
      break;
    }
    // removes duplicates whilst sort
    case "--merge-sort": {
      logResult(mergeSort(fileContent, unique));
      break;
    }
    // removes duplicates whilst sort
    case "--random-sort": {
      logResult(randomSort(fileContent), unique, true);
      break;
    }
    default: // tim sort: combination of insertion sort and merge sort
      logResult(fileContent.sort(), unique);
  }
}

main()
  .then()
  .catch((e) => console.error("No such file or invalid option"));
