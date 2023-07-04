const mockResponseData = require("./githubMockResponse.js");

const printLog = true;
const printData = []; // eg: ["rest.pulls.listReviewCommentsForRepo"];

const doRequest = (params, method, responseData) =>
    new Promise(resolve => {
        setTimeout(() => {
            if (printLog) {
                const msgHead = "****** Mock github request ******";
                const msgMethod = `Method: ${method}`;
                const msgParams = [`params: \n`, JSON.parse(JSON.stringify(params))];
                const msgData = printData.includes(method) ? ("data: \n", responseData) : "";
                const msgFoot = "*********************************";

                console.log(
                    ...[msgHead, msgMethod, ...msgParams, msgData, msgFoot].reduce((all, curr) => {
                        all.push(curr, "\n");
                        return all;
                    }, [])
                );
            }
            resolve({
                data: responseData,
            });
        }, 100);
    });

class Octokit {
    constructor(token, option) {}

    hook = {
        after: jest.fn(() => {}),
        before: jest.fn(() => {}),
        wrap: jest.fn(() => {}),
    };

    rest = {
        pulls: {
            get: jest.fn(params => doRequest(params, "rest.pulls.get", mockResponseData.rest.pulls.get)),
            list: jest.fn(params => doRequest(params, "rest.pulls.list", mockResponseData.rest.pulls.get)),
            getReview: jest.fn(params => doRequest(params, "rest.pulls.getReview", mockResponseData.rest.pulls.getReview)),
            getReviewComment: jest.fn(params => doRequest(params, "rest.pulls.getReviewComment", mockResponseData.rest.pulls.getReviewComment)),
            listCommentsForReview: jest.fn(params => doRequest(params, "rest.pulls.listCommentsForReview", mockResponseData.rest.pulls.listCommentsForReview)),
            listReviewComments: jest.fn(params => doRequest(params, "rest.pulls.listReviewComments", mockResponseData.rest.pulls.listReviewComments)),
            listReviewCommentsForRepo: jest.fn(params => doRequest(params, "rest.pulls.listReviewCommentsForRepo", mockResponseData.rest.pulls.listReviewCommentsForRepo)),
            listReviews: jest.fn(params => doRequest(params, "rest.pulls.listReviews", mockResponseData.rest.pulls.listReviews)),
        },
    };

    async paginate(api, query) {
        const { data } = await api(query);
        return data;
    }
}

const github = {
    getOctokit: jest.fn((token, option) => new Octokit(token, option)),
};

module.exports = github;

