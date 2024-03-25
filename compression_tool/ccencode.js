#! /usr/bin/env node
const fs = require("fs");
const { getFileContent } = require("../ccwc/utils");
const { buildBinaryTree } = require("./utils/utils");

function buildFrequencyMap(fileContent) {
  const frequencyMap = {};

  for (let char of fileContent) {
    frequencyMap[char] = frequencyMap[char] ? frequencyMap[char] + 1 : 1;
  }
  console.log(frequencyMap);
  return frequencyMap;
}

function writeHeaderToOutputFile(frequencyMap, outputFile) {
  // Creates a Buffer containing the UTF-8-encoded bytes for the string
  const header = Buffer.from(JSON.stringify(frequencyMap));
  // Writing header length to output in order to tell when
  // header ends and when compressed data starts.
  fs.writeFileSync(outputFile, header.length.toString() + "\n");

  // appending the header
  fs.appendFileSync(outputFile, header);
}

function encodeText(fileContent, prefixCodeTable) {
  let compressedText = "";
  for (let char of fileContent) {
    compressedText += prefixCodeTable[char];
  }
  return compressedText;
}

function convertTextToTypedArray(compressedText) {
  let zeroPadding = 0;
  // Pad with zero bit to make it a multiple of 8
  while (compressedText.length % 8 !== 0) {
    compressedText += "0";
    zeroPadding++;
  }
  const bufferLength = compressedText.length / 8;
  const compressedTextBuffer = new Uint8Array(bufferLength);

  for (let i = 0; i < bufferLength; i++) {
    const start = i * 8;
    const end = start + 8;
    const byte = compressedText.slice(start, end);
    compressedTextBuffer[i] = parseInt(byte, 2);
  }

  return [compressedTextBuffer, zeroPadding];
}

function writeCompressedTextToFile(compressedText, outputFile) {
  const [compressedTextBuffer, zeroPadding] =
    convertTextToTypedArray(compressedText);
  //append compressedData
  fs.appendFileSync(outputFile, compressedTextBuffer);
  //save padding as last byte
  fs.appendFileSync(outputFile, zeroPadding.toString());
}

function compareInputAndOutputFileSize(inputFile, outputFile) {
  const inputSize = fs.statSync(inputFile).size;
  const outputSize = fs.statSync(outputFile).size;
  console.log("Input file size " + inputSize);
  console.log("Output file size " + outputSize);
  console.log("Compression ratio %s", inputSize / outputSize);
}

async function main() {
  const args = process.argv;
  const inputFile = args[args.length - 2];
  const outputFile = args[args.length - 1];

  const fileContent = await getFileContent(inputFile, "utf-8");

  const frequencyMap = buildFrequencyMap(fileContent);

  const tree = buildBinaryTree(frequencyMap);
  const prefixCodeTable = tree.generatePrefixCodeTable();
  console.log(prefixCodeTable);

  writeHeaderToOutputFile(frequencyMap, outputFile);
  const compressedText = encodeText(fileContent, prefixCodeTable);
  writeCompressedTextToFile(compressedText, outputFile);
  compareInputAndOutputFileSize(inputFile, outputFile);
}

main()
  .then()
  .catch((e) => console.error("Invalid file", e));
