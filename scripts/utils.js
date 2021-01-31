const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

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

    ensureDir(path.dirname(dest));
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

function copyFile(src, dest) {
    if (!exist(src)) return;

    ensureDir(path.dirname(dest));
    fs.copyFileSync(src, dest);
}

function hash(text) {
    const hash = crypto.createHash("md5");
    hash.update(text);

    return hash.digest("hex");
}

module.exports = {
    ensureDir,
    emptyDir,
    link,
    exist,
    readFile,
    hash,
    copyFile,
};
