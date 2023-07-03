const core = require("@actions/core");
const Utils = require("./scripts/utils/index.js");
const jsonToMdTable = require("json-to-markdown-table");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const LeaderBoard = require("./scripts/leaderBoard/index.js");

dayjs.extend(utc);

// TODO make it configurable
const rankJsonPath = "./rank.json";
// leader board table readme path
const markdownPath = "./test.md";
const leaderBoardCounts = 10;

// most @actions toolkit packages have async methods
async function run() {
    try {
        const leaderBoard = new LeaderBoard(rankJsonPath);
        await leaderBoard.init();
        const lastUpdateTime = leaderBoard.Rank.lastUpdateTime;
        // get top X
        const topLeaderBoard = leaderBoard.getLeaders(leaderBoardCounts);

        if (lastUpdateTime === null) {
            core.info(`Because the ${rankJsonPath} file does not exist, it is not possible to compare past rankings, so everyone's last rank is displayed as '-'`);
        }

        // TODO refactor
        // generate markdown string
        const leaderBoardMd = jsonToMdTable(
            topLeaderBoard.map((data, index) => {
                const rank = index + 1;
                const lastRank = (() => {
                    if (lastUpdateTime === null) return "-";

                    if (data?.lastRank) {
                        const change = data.lastRank - rank;
                        if (change === 0) {
                            return "-";
                        }
                        if (change > 0) {
                            return `<font color="green">⇧</font> ${change}`;
                        }
                        return `<font color="red">⇩</font> ${change * -1}`;
                    }

                    return "New Contributor!";
                })();
                return {
                    Rank: rank,
                    Name: `<img width="30px" src="${data.info.avatar_url}" alt="${data.info.login}"/> [${data.info.login}](${data.info.html_url})`,
                    Score: data.totalScore,
                    "Last Rank": lastRank,
                };
            }),
            ["Rank", "Name", "Score", "Last Rank"]
        );

        // write markdown
        const currentReadme = Utils.markdown.read(markdownPath);
        const newReadme = Utils.markdown.insert(currentReadme, leaderBoardMd + `\nUpdate Time: ${dayjs().utc().format("YYYY/MM/DD HH:mm:ss ZZ")}`, "CONTRIBUTION-LEADER-BOARD-TABLE");
        if (newReadme !== currentReadme) {
            core.info("Writing to " + markdownPath);
            Utils.markdown.write(markdownPath, newReadme);
        } else {
            core.info("No need to update readme");
        }
    } catch (error) {
        core.setFailed("[run] " + error.message);
        console.error(error);
    }
}

run();

