const yaml = require("js-yaml");
const fs = require("fs");
require("dotenv").config();

try {
    const { inputs } = yaml.load(fs.readFileSync("./action.yml", "utf8"));

    // Setup inputs
    process.env = {
        ...process.env,
        ...Object.keys(inputs).reduce((obj, key) => {
            if (process.env[key]) {
                obj[`INPUT_${key}`] = process.env[key];

                return obj;
            }

            if (inputs[key].default) {
                obj[`INPUT_${key}`] = inputs[key].default;
                return obj;
            }

            console.error(`Input required and not supplied: ${key}`);
            return obj;
        }, {}),
    };

    require("./index.js");
} catch (e) {
    console.error(e);
}

