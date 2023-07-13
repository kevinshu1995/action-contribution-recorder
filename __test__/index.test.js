const core = require("@actions/core");
const { injectInputs } = require("./../local-run");

describe("Environment variable", () => {
    const ORIGINAL_ENV = process.env;

    beforeEach(() => {
        jest.resetModules(); // Most important - it clears the cache
        process.env = { ...ORIGINAL_ENV }; // Make a copy
    });

    afterAll(() => {
        process.env = ORIGINAL_ENV; // Restore old environment
    });

    describe("GH_TOKEN", () => {
        it("should be exist", () => {
            injectInputs();
            expect(core.getInput("GH_TOKEN")).toMatch(
                /^(gh[pousr]_[A-Za-z0-9_]{36,251}|github_pat_[a-zA-Z0-9]{22}_[a-zA-Z0-9]{59}|v[0-9]\.[0-9a-f]{40})$/
            );
        });
    });

    describe("GH_REPOSITORY", () => {
        it("should be exist", () => {
            injectInputs();
            expect(core.getInput("GH_REPOSITORY")).not.toBeUndefined();
        });
    });

    describe("COMMITTER_USERNAME", () => {
        it("should be exist", () => {
            injectInputs();
            expect(core.getInput("COMMITTER_USERNAME")).not.toBeUndefined();
        });
    });

    describe("COMMITTER_EMAIL", () => {
        it("should be exist", () => {
            injectInputs();
            expect(core.getInput("COMMITTER_EMAIL")).not.toBeUndefined();
        });
    });

    describe("COMMIT_MESSAGE", () => {
        it("should be exist", () => {
            injectInputs();
            expect(core.getInput("COMMIT_MESSAGE")).not.toBeUndefined();
        });
    });

    describe("RANK_JSON_PATH", () => {
        it("should be exist", () => {
            injectInputs();
            expect(core.getInput("RANK_JSON_PATH")).not.toBeUndefined();
        });
    });

    describe("MARKDOWN_PATH", () => {
        it("should be exist", () => {
            injectInputs();
            expect(core.getInput("MARKDOWN_PATH")).not.toBeUndefined();
        });
    });

    describe("DISPLAY_CONTRIBUTOR_COUNTS", () => {
        it("should be exist", () => {
            injectInputs();
            expect(core.getInput("DISPLAY_CONTRIBUTOR_COUNTS")).not.toBeUndefined();
        });
    });

    describe("MARKDOWN_INSERT_KEY", () => {
        it("should be exist", () => {
            injectInputs();
            expect(core.getInput("MARKDOWN_INSERT_KEY")).not.toBeUndefined();
        });
    });

    describe("IS_SKIPPING_COMMITTING", () => {
        it("should be exist", () => {
            injectInputs();
            expect(core.getInput("IS_SKIPPING_COMMITTING")).not.toBeUndefined();
        });
    });

    describe("IS_SKIPPING_WRITING_FILES", () => {
        it("should be exist", () => {
            injectInputs();
            expect(core.getInput("IS_SKIPPING_WRITING_FILES")).not.toBeUndefined();
        });
    });
});

