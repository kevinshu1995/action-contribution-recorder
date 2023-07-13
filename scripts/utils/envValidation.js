const core = require("@actions/core");

const customTruthyArray = ["true", true, 1];
const isTruthy = val => customTruthyArray.includes(val);

const infoLogPrefix = "| 🟢 INFO |";

function isSkippingWritingFiles(path) {
    const IS_SKIPPING_WRITING_FILES = core.getInput("IS_SKIPPING_WRITING_FILES");
    if (isTruthy(IS_SKIPPING_WRITING_FILES)) {
        core.info(`${infoLogPrefix} Skipping writing file \n\t file path: ${path} \n`);
        return true;
    }
    return false;
}

function isSkippingCommitting() {
    const IS_SKIPPING_COMMITTING = core.getInput("IS_SKIPPING_COMMITTING");
    if (isTruthy(IS_SKIPPING_COMMITTING)) {
        core.info(`${infoLogPrefix} Skipping committing \n`);
        return true;
    }
    return false;
}

module.exports = {
    isSkippingWritingFiles,
    isSkippingCommitting,
};

