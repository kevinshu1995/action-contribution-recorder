const core = require("@actions/core");
const Utils = require("./scripts/utils/index.js");
const jsonToMdTable = require("json-to-markdown-table");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const LeaderBoard = require("./scripts/leaderBoard/index.js");
require("dotenv").config();

dayjs.extend(utc);

const { RANK_JSON_PATH = "./contributor-leader-board.json", MARKDOWN_PATH = "./README.md", DISPLAY_CONTRIBUTOR_COUNTS = 10, MARKDOWN_INSERT_KEY = "CONTRIBUTION-LEADER-BOARD-TABLE" } = process.env;

// utility function
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

async function getLeaderBoard() {
    const leaderBoard = new LeaderBoard(RANK_JSON_PATH);
    await leaderBoard.init();
    const lastUpdateTime = leaderBoard.Rank.lastUpdateTime;
    if (lastUpdateTime === null) {
        core.info(`Because the ${RANK_JSON_PATH} file does not exist, it is not possible to compare past rankings, so everyone's last rank is displayed as '-'`);
    }

    return {
        leaderBoard,
        lastUpdateTime,
    };
}

function generateMDTable({ leaderBoard, lastUpdateTime }) {
    const leaderBoardMd = jsonToMdTable(
        // get top X contributors
        leaderBoard.getLeaders(DISPLAY_CONTRIBUTOR_COUNTS).map((data, index) => {
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

    return { leaderBoardMd };
}

function writeMD({ leaderBoardMd }) {
    const currentReadme = Utils.markdown.read(MARKDOWN_PATH);
    const newReadme = Utils.markdown.insert(currentReadme, leaderBoardMd + `\nUpdate Time: ${dayjs().utc().format("YYYY/MM/DD HH:mm:ss ZZ")}`, MARKDOWN_INSERT_KEY);
    if (newReadme !== currentReadme) {
        core.info("Writing to " + MARKDOWN_PATH);
        Utils.markdown.write(MARKDOWN_PATH, newReadme);
    } else {
        core.info("No need to update readme");
    }
    return {};
}

// most @actions toolkit packages have async methods
async function main() {
    try {
        // Get leaderBoard
        const { leaderBoard, lastUpdateTime } = await getLeaderBoard();

        // Generate markdown string
        const { leaderBoardMd } = generateMDTable({ leaderBoard, lastUpdateTime });

        // Write markdown
        writeMD({ leaderBoardMd });
    } catch (error) {
        core.setFailed("[main] " + error.message);
        console.error(error);
    }
}

main();

