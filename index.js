const core = require("@actions/core");
const Stats = require("./scripts/stats/pulls/index.js");

// most @actions toolkit packages have async methods
async function run() {
    try {
        const stats = new Stats();
        const scoreList = await stats.getScoreList();
        console.log(`scoreList: \n`, scoreList);

        core.info(`hello`);
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();

