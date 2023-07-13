const yaml = require("js-yaml");
const fs = require("fs");
require("dotenv").config();

function loadAction() {
    return yaml.load(fs.readFileSync("./action.yml", "utf8"));
}

function injectInputs() {
    const { inputs } = loadAction();

    // Setup inputs
    console.group("local-run.js - env");
    process.env = {
        ...process.env,
        ...Object.keys(inputs).reduce((obj, key) => {
            if (process.env[key]) {
                obj[`INPUT_${key}`] = process.env[key];

                console.log(`| ${key} : \n|\t ${obj[`INPUT_${key}`]}`);
                return obj;
            }

            if (inputs[key].default) {
                obj[`INPUT_${key}`] = inputs[key].default;

                console.log(`| ${key} : \n|\t ${obj[`INPUT_${key}`]}`);
                return obj;
            }

            console.error(`| 🟡 ${key} : \n|\t does not have a default value and is not set in the environment`);
            return obj;
        }, {}),
    };
    console.groupEnd("local-run.js - env");
    console.log("\n");
}

try {
    injectInputs();

    require("./index.js");
} catch (e) {
    console.error(e);
}

module.exports = {
    injectInputs,
    loadAction,
};

