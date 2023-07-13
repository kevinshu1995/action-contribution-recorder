const core = require("@actions/core");

function isSkippingWritingFiles(path) {
    const IS_SKIPPING_WRITING_FILES = core.getInput("IS_SKIPPING_WRITING_FILES");
    if (IS_SKIPPING_WRITING_FILES === "true" || IS_SKIPPING_WRITING_FILES === true) {
        core.info(`| 🟢 INFO | Skipping writing file \n\t file path: ${path} \n`);
        return true;
    }
    return false;
}

function isSkippingCommitting() {
    const IS_SKIPPING_COMMITTING = core.getInput("IS_SKIPPING_COMMITTING");
    if (["true", true, 1].includes(IS_SKIPPING_COMMITTING)) {
        core.info(`| 🟢 INFO | Skipping committing \n`);
        return true;
    }
    return false;
}

module.exports = {
    isSkippingWritingFiles,
    isSkippingCommitting,
};

