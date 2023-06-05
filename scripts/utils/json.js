const fs = require("fs");
const core = require("@actions/core");

function read(path) {
    try {
        const rawData = fs.readFileSync(path);
        return JSON.parse(rawData);
    } catch (e) {
        core.error(e.message);
        return null;
    }
}

function write(path, data) {
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

