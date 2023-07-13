const core = require("@actions/core");
const fs = require("fs");
const envValidation = require("./envValidation.js");

const insert = (previousContent, newContent, key = "insert-key") => {
    const tagToLookFor = `<!--${key}:`;
    const closingTag = "-->";
    const startOfOpeningTagIndex = previousContent.indexOf(`${tagToLookFor}START`);
    const endOfOpeningTagIndex = previousContent.indexOf(closingTag, startOfOpeningTagIndex);
    const startOfClosingTagIndex = previousContent.indexOf(`${tagToLookFor}END`, endOfOpeningTagIndex);
    if (startOfOpeningTagIndex === -1 || endOfOpeningTagIndex === -1 || startOfClosingTagIndex === -1) {
        // Exit with error if comment is not found on the readme
        core.error(`Cannot find the comment tag on the readme:\n${tagToLookFor}START -->\n${tagToLookFor}END -->`);
        process.exit(1);
    }
    return [
        previousContent.slice(0, endOfOpeningTagIndex + closingTag.length),
        "\n",
        newContent,
        "\n",
        previousContent.slice(startOfClosingTagIndex),
    ].join("");
};

const read = path => {
    return fs.readFileSync(path, "utf8");
};

const write = (path, newContent) => {
    if (envValidation.isSkippingWritingFiles(path)) return;
    return fs.writeFileSync(path, newContent);
};

module.exports = {
    insert,
    read,
    write,
};

