// const core = require("@actions/core");
require("dotenv").config();

const github = require("@actions/github");
// const dayjs = require("dayjs");

const {
    GITHUB_TOKEN,
    GITHUB_REPOSITORY,
    // RECORD_DAY_RANGE,
    DEBUG_GITHUB_REST,
} = process.env;
const [owner, repo] = GITHUB_REPOSITORY.split("/");

const originOctokit = github.getOctokit(GITHUB_TOKEN);
const octokit = github.getOctokit(GITHUB_TOKEN);

if (DEBUG_GITHUB_REST && DEBUG_GITHUB_REST === "1") {
    originOctokit.hook.after("request", async (response, options) => {
        console.log({
            request: `${options.method} ${options.url}: ${response.status}`,
            "x-ratelimit-remaining": response.headers["x-ratelimit-remaining"],
            // response,
        });
    });

    octokit.hook.after("request", async (response, options) => {
        console.log({
            request: `${options.method} ${options.url}: ${response.status}`,
            "x-ratelimit-remaining": response.headers["x-ratelimit-remaining"],
            // response,
        });
    });
}

// const since = dayjs().subtract(RECORD_DAY_RANGE, "day").toISOString();

octokit.hook.wrap("request", async (request, options) => {
    try {
        const response = await request(options);
        return {
            data: response.data,
            error: null,
        };
    } catch (error) {
        return {
            data: null,
            error,
        };
    }
});

const Github = (() => {
    return {
        pulls: {
            // Get a pull request
            // INFO Lists details of a pull request by providing its number.
            get({ pull_number }) {
                return octokit.rest.pulls.get({
                    owner,
                    repo,
                    pull_number,
                });
            },
            // List pull requests
            // INFO Draft pull requests are available in public repositories with GitHub Free and GitHub Free for organizations, GitHub Pro, and legacy per-repository billing plans, and in public and private repositories with GitHub Team and GitHub Enterprise Cloud. For more information, see GitHub's products in the GitHub Help documentation.
            async list(options) {
                const { state } = { state: "all", ...options };
                const response = await originOctokit.paginate(originOctokit.rest.pulls.list, {
                    owner,
                    repo,
                    state,
                    per_page: 100,
                });

                return {
                    data: response,
                    error: null,
                };
            },
            // Get a review for a pull request
            getReview({ pull_number, comment_id }) {
                return octokit.rest.pulls.getReview({
                    owner,
                    repo,
                    pull_number,
                    comment_id,
                });
            },
            // Get a review comment for a pull request
            // INFO Provides details for a review comment.
            getReviewComment({ comment_id }) {
                return octokit.rest.pulls.getReviewComment({
                    owner,
                    repo,
                    comment_id,
                });
            },
            // List comments for a pull request review
            // INFO List comments for a specific pull request review.
            async listCommentsForReview({ pull_number, review_id }) {
                const response = await originOctokit.paginate(originOctokit.rest.pulls.listCommentsForReview, {
                    owner,
                    repo,
                    per_page: 100,
                    pull_number,
                    review_id,
                });

                return {
                    data: response,
                    error: null,
                };
            },
            // List review comments on a pull request
            // INFO Lists all review comments for a pull request. By default, review comments are in ascending order by ID.
            async listReviewComments({ pull_number }) {
                const response = await originOctokit.paginate(originOctokit.rest.pulls.listReviewComments, {
                    owner,
                    repo,
                    per_page: 100,
                    pull_number,
                });

                return {
                    data: response,
                    error: null,
                };
            },
            // List review comments in a repository
            // INFO Lists review comments for all pull requests in a repository. By default, review comments are in ascending order by ID.
            async listReviewCommentsForRepo() {
                const response = await originOctokit.paginate(originOctokit.rest.pulls.listReviewCommentsForRepo, {
                    owner,
                    repo,
                    per_page: 100,
                    // since,
                });

                return {
                    data: response,
                    error: null,
                };
            },
            // List reviews for a pull request
            // INFO The list of reviews returns in chronological order.
            async listReviews({ pull_number }) {
                const response = await originOctokit.paginate(originOctokit.rest.pulls.listReviews, {
                    owner,
                    repo,
                    per_page: 100,
                    pull_number,
                });

                return {
                    data: response,
                    error: null,
                };
            },
        },
    };
})();

module.exports = Github;

