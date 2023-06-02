const API = require("../../github/api.js");

class ReviewComments {
    constructor() {
        this.reviewComments = [];
    }

    async fetch() {
        const { data, error } = await API.pulls.listReviewCommentsForRepo();

        if (error) {
            this.reviewComments = [];
            return [];
        }

        this.reviewComments = data;

        // console.log("review comments", data);

        return this.#filterValidData().#mapNeededData().reviewComments;
    }

    #mapNeededData() {
        this.reviewComments = this.reviewComments.map(review => {
            return {
                id: review.id,
                user: review.user,
                body: review.body,
                created_at: review.created_at,
                updated_at: review.updated_at,
                reactions: review.reactions,
                html_url: review.html_url,
            };
        });
        return this;
    }

    #filterValidData() {
        function filters(review) {
            const filterUserOnly = review.user.type === "User";
            return filterUserOnly;
        }

        // User only
        this.reviewComments = this.reviewComments.filter(review => filters(review));

        return this;
    }
}

module.exports = ReviewComments;

