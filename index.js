const core = require("@actions/core");
const Stats = require("./scripts/stats/pulls/index.js");
const Utils = require("./scripts/utils/index.js");
const jsonToMdTable = require("json-to-markdown-table");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");

dayjs.extend(utc);

const rankJsonPath = "./rank.json";
// leader board table readme path
const markdownPath = "./test.md";

// most @actions toolkit packages have async methods
async function run() {
    try {
        const stats = new Stats();
        const scoreListObj = await stats.getScoreList();

        // get old rank
        const rank = Utils.json.read(rankJsonPath);
        if (rank !== null) {
            rank.r.forEach((id, i) => {
                if (scoreListObj[id]) {
                    scoreListObj[id].lastRank = i + 1;
                }
            });
        }

        // sort user by total score
        const sortedList = Object.values(scoreListObj).sort((a, b) => b.totalScore - a.totalScore);

        // store rank as json
        const rankArray = sortedList.reduce(
            (all, curr) => {
                all.r.push(curr.info.id);
                return all;
            },
            { r: [], updateTime: new Date().getTime() }
        );
        Utils.json.write(rankJsonPath, rankArray);

        // get top 10
        const top10 = sortedList.slice(0, 10);

        // generate markdown string
        const leaderBoardMd = jsonToMdTable(
            top10.map((data, index) => {
                const rank = index + 1;
                const LastRank = (() => {
                    if (data?.lastRank) {
                        const change = data.lastRank - rank;
                        if (change === 0) {
                            return "-";
                        }
                        if (change > 0) {
                            return `<font color="green">⇧</font> ${change}`;
                        }
                        return `<font color="red">⇩</font> ${change * -1}`;
                    } else {
                        return "New Contributor!";
                    }
                })();
                return {
                    Rank: rank,
                    Name: `<img width="30px" src="${data.info.avatar_url}" alt="${data.info.login}"/> [${data.info.login}](${data.info.html_url})`,
                    Score: data.totalScore,
                    "Last Rank": LastRank,
                };
            }),
            ["Rank", "Name", "Score", "Last Rank"]
        );

        // write markdown
        const currentReadme = Utils.markdown.read(markdownPath);
        const newReadme = Utils.markdown.insert(currentReadme, leaderBoardMd + `\nUpdate Time: ${dayjs().utc().format("YYYY.MM.DD HH:mm:ss ZZ")}`, "CONTRIBUTION-LEADER-BOARD-TABLE");
        if (newReadme !== currentReadme) {
            core.info("Writing to " + "./test.md");
            Utils.markdown.write(markdownPath, newReadme);
        } else {
            core.info("No need to update readme");
        }
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();

