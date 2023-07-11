const { spawn, execSync } = require("child_process");
const core = require("@actions/core");

const exec = (cmd, args = [], options = {}) => {
    return new Promise((resolve, reject) => {
        let outputData = "";
        const optionsToCLI = {
            ...options,
        };
        if (!optionsToCLI.stdio) {
            Object.assign(optionsToCLI, { stdio: ["inherit", "inherit", "inherit"] });
        }
        const app = spawn(cmd, args, optionsToCLI);
        if (app.stdout) {
            // Only needed for pipes
            app.stdout.on("data", function (data) {
                outputData += data.toString();
            });
        }

        app.on("close", code => {
            if (code !== 0) {
                return reject({ code, outputData });
            }
            return resolve({ code, outputData });
        });
        app.on("error", () => reject({ code: 1, outputData }));
    });
};

function isGitDirty() {
    const command = `git status --porcelain`;
    const diffOutput = execSync(command).toString();
    return diffOutput !== "";
}

async function commitAllChanges(githubToken) {
    // Getting config

    // const { COMMITTER_USERNAME, COMMITTER_EMAIL, COMMIT_MESSAGE, GH_REPOSITORY, BRANCH } = process.env;
    const COMMITTER_USERNAME = core.getInput("COMMITTER_USERNAME");
    const COMMITTER_EMAIL = core.getInput("COMMITTER_EMAIL");
    const COMMIT_MESSAGE = core.getInput("COMMIT_MESSAGE");
    const GH_REPOSITORY = core.getInput("GH_REPOSITORY");
    const BRANCH = core.getInput("BRANCH");

    // Doing commit and push
    if (COMMITTER_EMAIL) {
        await exec("git", ["config", "--global", "user.email", COMMITTER_EMAIL]);
    }
    if (githubToken) {
        // git remote set-url origin
        await exec("git", ["remote", "set-url", "origin", `https://${githubToken}@github.com/${GH_REPOSITORY}.git`]);
    }
    await exec("git", ["config", "--global", "user.name", COMMITTER_USERNAME]);
    await exec("git", ["add", "."]);
    await exec("git", ["commit", "-m", COMMIT_MESSAGE]);
    await exec("git", ["push"]);
    core.info("Changes updated successfully in the upstream repository");
}

async function commitAllChangesIfDirty(githubToken) {
    if (isGitDirty()) {
        await commitAllChanges(githubToken);
    } else {
        core.info("No changes to commit");
    }
}

module.exports = {
    commitAllChangesIfDirty,
};

