const Weight = require("./../score/weight/index.js");

class User {
    constructor(info = null) {
        if (!info) {
            throw new Error("User info is required");
        }
        this.info = info;
        this.score = {};
        this.totalScore = 0;

        this.score = this.#generateInitScore();
    }

    #generateInitScore() {
        // init score
        const score = {};
        Object.keys(Weight).forEach(dataName => {
            score[dataName] = {};
            Object.keys(Weight[dataName]).forEach(scoreName => {
                score[dataName][scoreName] = 0;
            });
        });
        return score;
    }

    updateScoreByDataAndType(dataName, singleData = {}) {
        Object.keys(Weight[dataName]).forEach(scoreName => {
            const counts = Weight[dataName][scoreName].getCurrentCounts(singleData);
            this.updateScoreByType(dataName, scoreName, counts);
        });
        // just making sure score is right
        this.updateTotalScore();
    }

    updateScoreByType(dataName = "", scoreTypeName = "", counts = 0) {
        const currentScore = this.score[dataName][scoreTypeName];
        const { value: weight } = Weight[dataName][scoreTypeName];
        const newScore = weight * counts;
        this.score[dataName][scoreTypeName] = currentScore + newScore;
        // update total score
        this.totalScore += newScore;
        return this;
    }

    updateTotalScore() {
        function getObjScore(obj) {
            return Object.values(obj).reduce((total, score) => {
                if (score && typeof score === "object") {
                    return total + getObjScore(score);
                }
                return total + score;
            }, 0);
        }
        this.totalScore = getObjScore(this.score);
        return this;
    }
}

module.exports = User;

