const fs = require("fs");

async function readStdIn(stream, encoding) {
  let fileContent = "";
  const chunks = [];
  for await (const chunk of stream) {
    fileContent += chunk.toString("utf8");
    chunks.push(chunk);
  }

  return encoding ? fileContent : Buffer.concat(chunks);
}

// return file as utf8 string or Buffer
const getFileContent = async (file, encoding) => {
  if (file) {
    return fs.readFileSync(file, encoding);
  } else {
    return await readStdIn(process.stdin, encoding);
  }
};

module.exports = {
  getFileContent,
};
