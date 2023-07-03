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
const displayContributorCounts = 10;

const stringTag = options => {
    const attrs = options.attrs ?? {};
    const attrsString = Object.keys(attrs)
        .map(key => {
            return `${key}="${attrs[key]}"`;
        })
        .join(" ");

    if (options.content !== undefined) {
        return `<${options.tag} ${attrsString}>${options.content}</${options.tag}>`;
    }
    return `<${options.tag} ${attrsString} />`;
};

// most @actions toolkit packages have async methods
async function run() {
    try {
        // Get leaderBoard
        const leaderBoard = new LeaderBoard(rankJsonPath);
        await leaderBoard.init();
        const lastUpdateTime = leaderBoard.Rank.lastUpdateTime;
        if (lastUpdateTime === null) {
            core.info(`Because the ${rankJsonPath} file does not exist, it is not possible to compare past rankings, so everyone's last rank is displayed as '-'`);
        }

        // Generate markdown string
        const leaderBoardMd = jsonToMdTable(
            // get top X contributors
            leaderBoard.getLeaders(displayContributorCounts).map((data, index) => {
                const rank = index + 1;
                const lastRank = (() => {
                    if (lastUpdateTime === null) return "-";

                    if (data?.lastRank) {
                        const rankChange = data.lastRank - rank;
                        if (rankChange < 0) {
                            return `${stringTag({ tag: "font", attrs: { color: "red" }, content: "⇩" })} ${rankChange * -1}`;
                        }
                        if (rankChange > 0) {
                            return `${stringTag({ tag: "font", attrs: { color: "green" }, content: "⇧" })} ${rankChange}`;
                        }
                        return "-";
                    }

                    return "New Contributor!";
                })();
                const name = `${stringTag({ tag: "img", attrs: { width: "30px", src: data.info.avatar_url, alt: data.info.login } })} [${data.info.login}](${data.info.html_url})`;
                return {
                    Rank: rank,
                    Name: name,
                    Score: data.totalScore,
                    "Last Rank": lastRank,
                };
            }),
            ["Rank", "Name", "Score", "Last Rank"]
        );

        // Write markdown
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

