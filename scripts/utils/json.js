const fs = require("fs");
const core = require("@actions/core");
const envValidation = require("./envValidation.js");

function read(path) {
    try {
        const rawData = fs.readFileSync(path);
        return JSON.parse(rawData);
    } catch (e) {
        core.info(`| 🟡 WARNING | reading json file \n\t ${e.message} \n`);
        return null;
    }
}

function write(path, data) {
    if (envValidation.isSkippingWritingFiles(path)) return false;
    try {
        fs.writeFileSync(path, JSON.stringify(data, null, 2));
        return true;
    } catch (e) {
        core.error(e.message);
        return false;
    }
}

module.exports = {
    read,
    write,
};

