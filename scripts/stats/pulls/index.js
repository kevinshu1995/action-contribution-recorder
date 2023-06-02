const ReviewComments = require("./review-comments.js");
const List = require("./list.js");
const UserMap = require("./../../user/UserMap.js");

class Stats {
    constructor() {
        this.list = {
            data: null,
        };
        this.reviewComments = {
            data: null,
        };
        this.userMap = new UserMap();
    }

    async getScoreList() {
        await this.fetchAll();
        this.calculateScore();

        // score
        return this.userMap.getMapConvertedToObj();
    }

    calculateScore() {
        const vm = this;
        ["list", "reviewComments"].forEach(dataType => {
            calculateTargetScore(dataType);
        });

        // @param target {'list' | 'reviewComments'}
        function calculateTargetScore(dataType) {
            if (vm[dataType] === undefined) throw new Error("[calculateScore] dataType is not defined dataType: ", dataType);
            vm[dataType].data.forEach(data => {
                const userId = data.user.id;
                const userInstance = vm.userMap.set(data.user).get(userId);
                userInstance.updateScoreByDataAndType(dataType, data);
            });
        }
    }

    async fetchAll() {
        await Promise.all([this.fetchReviewComments(), this.fetchList()]);

        // console.log(`reviewComments: \n`, this.reviewComments.data);
        // console.log(`list: \n`, this.list.data);
        return this;
    }

    async fetchReviewComments() {
        const reviewComments = new ReviewComments();
        this.reviewComments.data = await reviewComments.fetch();
        return this;
    }

    async fetchList() {
        const list = new List();
        this.list.data = await list.fetch();
        return this;
    }
}

module.exports = Stats;

