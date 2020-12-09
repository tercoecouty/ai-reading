const fs = require("fs");
const path = require("path");

function emptyDir(dirPath) {
    ensureDir(dirPath);
    fs.readdirSync(dirPath).forEach((item) => {
        fs.rmSync(path.resolve(dirPath, item), { recursive: true });
    });
}

function ensureDir(dirPath) {
    if (!exist(dirPath)) fs.mkdirSync(dirPath);
}

function link(src, dest) {
    if (exist(dest)) return;
    fs.linkSync(src, dest);
}

function exist(filePath) {
    try {
        fs.accessSync(filePath);
        return true;
    } catch (e) {
        return false;
    }
}

function readFile(filePath) {
    if (!exist(filePath)) return "";

    return fs.readFileSync(filePath).toString();
}

module.exports = {
    ensureDir,
    emptyDir,
    link,
    exist,
    readFile,
};
