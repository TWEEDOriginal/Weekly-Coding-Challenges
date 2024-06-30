const fs = require("fs");
const path = require("path");
const parser = require("./jsonParser");

async function parse(file) {
  try {
    const result = await parser(file);
    console.info("result", result);
  } catch (e) {
    console.error(e?.message || e);
  }
  console.log(process.exitCode);
}

async function main() {
  const testFolder = "./tests/";
  //get folders
  const folders = fs
    .readdirSync(testFolder, { withFileTypes: true })
    .filter((item) => item.isDirectory())
    .map((item) => item.name);

  for (let folder of folders) {
    const folderPath = `${testFolder}${folder}`;
    //get json files in each folder
    const files = fs
      .readdirSync(folderPath, { withFileTypes: true })
      .filter(
        (item) => !item.isDirectory() && path.extname(item.name) === ".json"
      )
      .map((item) => item.name);

    // parse each file
    for (let file of files) {
      await parse(`${folderPath}/${file}`);
    }
  }
}

main().then();
