const path = require("path");
const fs = require("fs");
const shelljs = require("shelljs");
async function dumpDatabase(output) {
  return shelljs.exec(`mongodump -d=hms -o=${output}`);
}
async function removeFolder(pathName) {
  pathName && shelljs.rm("-rf", pathName);
}
function deletePreviousExceptOne(backupPath) {
  const folderList = fs
    .readdirSync(backupPath)
    .filter((item) => ![".", ".."].includes(item))
    .sort((a, b) => {
      return a.split("-")[2].localeCompare(b.split("-")[2]);
    });
  if (folderList.length > 2) {
    for (let index = 0; index < folderList.length - 2; index++) {
      const pathName = folderList[index];
      removeFolder(path.join(backupPath, pathName)).catch(console.error);
    }
  }
}
function backup() {
  try {
    const date = new Date();
    const backupName = `backup-${date.getFullYear()}${String(
      date.getMonth() + 1
    ).padStart(2, "0")}${String(date.getDate()).padStart(
      2,
      "0"
    )}-${date.getTime()}`;
    const allDisk = shelljs
      .exec("wmic logicaldisk get name")
      .toString()
      .split("\n")
      .splice(1)
      .map((line) => {
        return line.trim().substring(0, 2);
      });
    for (let index = 0; index < allDisk.length; index++) {
      const disk = allDisk[index];
      if (!!disk) {
        const backupPath = path.resolve(`${disk}/hms_backup`);
        if (!fs.existsSync(backupPath)) {
          fs.mkdirSync(backupPath);
        } else deletePreviousExceptOne(backupPath);
        dumpDatabase(path.join(backupPath, backupName)).catch(console.error);
      }
    }
  } catch (error) {
    console.error(error);
  }
}
module.exports = backup;
