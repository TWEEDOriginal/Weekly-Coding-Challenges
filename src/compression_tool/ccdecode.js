#! /usr/bin/env node
const fs = require("fs");
const { getFileContent } = require("../ccwc/utils");
const { buildBinaryTree } = require("./utils/utils");

function removePaddedZeros(compressedTextBuffer, zeroPadding) {
  let compressedText = "";

  for (let i = 0; i < compressedTextBuffer.length; i++) {
    const byte = compressedTextBuffer[i];
    //make 8 bits
    compressedText += byte.toString(2).padStart(8, "0");
  }
  // Remove padding
  return compressedText.substring(0, compressedText.length - zeroPadding);
}

function getFrequencyMapAndCompressedText(fileBuffer) {
  let startIndex = 0;
  //get "\n" index that seperates headerLength and header
  while (String.fromCharCode(fileBuffer[startIndex]) !== "\n") {
    startIndex++;
  }

  const headerLength = parseInt(
    fileBuffer.subarray(0, startIndex).toString("utf8")
  );
  //skip "\n"
  startIndex++;
  const headerEndIndex = startIndex + headerLength;

  const frequencyMap = JSON.parse(
    fileBuffer.subarray(startIndex, headerEndIndex).toString("utf8")
  );
  //compressedText starts after header and ends before zeroPadding byte
  let compressedTextBuffer = fileBuffer.subarray(
    headerEndIndex,
    fileBuffer.length - 1
  );

  const zeroPadding = parseInt(
    fileBuffer.subarray(fileBuffer.length - 1).toString("utf8")
  );

  //remove paddedZeros from compressedText
  const compressedText = removePaddedZeros(compressedTextBuffer, zeroPadding);

  return [frequencyMap, compressedText];
}

async function readCompressedFile(file) {
  const fileBuffer = await getFileContent(file);

  return getFrequencyMapAndCompressedText(fileBuffer);
}

function decompressText(compressedText, tree) {
  let decompressedText = "";
  let node = tree;
  for (let char of compressedText) {
    if (char === "0") {
      node = node.leftChild;
    } else {
      node = node.rightChild;
    }
    if (node.isLeaf()) {
      decompressedText += node.value();
      //reset node to root
      node = tree;
    }
  }
  return decompressedText;
}

async function main() {
  const args = process.argv;
  const inputFile = args[args.length - 2];
  const outputFile = args[args.length - 1];

  const [frequencyMap, compressedText] = await readCompressedFile(inputFile);

  const tree = buildBinaryTree(frequencyMap);
  const decompressedText = decompressText(compressedText, tree);
  // create original file
  fs.writeFileSync(outputFile, decompressedText);
}

main()
  .then()
  .catch((e) => console.error("Invalid file", e));
