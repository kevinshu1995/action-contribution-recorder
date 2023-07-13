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
});

