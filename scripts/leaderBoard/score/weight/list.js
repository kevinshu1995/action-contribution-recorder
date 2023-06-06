module.exports = {
    createPullRequest: {
        value: 1,
        getCurrentCounts: () => 1, // 只要有 pull request 就是 1 次
    },
    // merged pullRequest is extra score, user still got create pull request score.
    createdPullRequestBeenMerged: {
        value: 1,
        getCurrentCounts: pull => (pull.merged_at !== null && pull.state === "closed" ? 1 : 0),
    },
};

