const Stats = require("./stats/pulls/index.js");
const Utils = require("./../utils/index.js");

class LeaderBoard {
    hasInitStats = false;
    constructor(rankJsonPath = "./rank.json") {
        this.list = {};
        this.Rank = new RankJson(rankJsonPath);
    }

    async init() {
        const stats = new Stats();
        this.list = await stats.getScoreList();
        this.hasInitStats = true;

        // set last rank according record
        if (this.Rank.lastRank) {
            this.Rank.lastRank.forEach((id, i) => {
                this.#setUserLastRank(id, i + 1);
            });
        } else {
            // TODO if rank.json is not exist means this is the first time to run this action, so we should make every ones Last Rank field display "-"
        }

        return this;
    }

    #setUserLastRank(userId, lastRank) {
        if (this.hasInitStats === false) {
            throw new Error("LeaderBoard has not been initialized");
        }
        this.list[userId].lastRank = lastRank;
        return this;
    }

    #getWholeListSortedByScore() {
        if (this.hasInitStats === false) {
            throw new Error("LeaderBoard has not been initialized");
        }
        const wholeList = Object.values(this.list).sort((a, b) => b.totalScore - a.totalScore);
        this.Rank.updateRecord(wholeList.map(user => user.info.id));
        return wholeList;
    }

    getLeaders(leaderCounts) {
        if (this.hasInitStats === false) {
            throw new Error("LeaderBoard has not been initialized");
        }
        return this.#getWholeListSortedByScore().slice(0, leaderCounts);
    }
}

class RankJson {
    jsonKeys = {
        rank: "r",
        updateTime: "updateTime",
    };
    constructor(rankJsonPath) {
        this.rankJsonPath = rankJsonPath;

        this.lastRank = null;
        this.lastUpdateTime = null;

        this.#initWithLastRecord();
    }

    #initWithLastRecord() {
        const rank = Utils.json.read(this.rankJsonPath);
        if (rank === null) return this;

        this.lastRank = rank[this.jsonKeys.rank];
        this.lastUpdateTime = rank[this.jsonKeys.updateTime];
        return this;
    }

    updateRecord(rankArrayWithUserIdAsElement = []) {
        const isUserIdArray = rankArrayWithUserIdAsElement.every(item => typeof item === "number");
        if (isUserIdArray === false) {
            throw new Error("updateRecord param must be an array of user id");
        }
        const newRecord = {
            [this.jsonKeys.rank]: rankArrayWithUserIdAsElement,
            [this.jsonKeys.updateTime]: new Date().getTime(),
        };
        Utils.json.write(this.rankJsonPath, newRecord);
    }
}

module.exports = LeaderBoard;

