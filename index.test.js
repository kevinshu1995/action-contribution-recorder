require("dotenv").config();

// shows how the runner will run a javascript action with env / stdout protocol
describe("Environment variable", () => {
    describe("GITHUB_TOKEN", () => {
        it("should be exist", () => {
            expect(process.env.GITHUB_TOKEN).not.toBeUndefined();
        });
    });

    describe("GITHUB_REPOSITORY", () => {
        it("should be exist", () => {
            expect(process.env.GITHUB_REPOSITORY).not.toBeUndefined();
        });

        it('should contain a "/" in the middle', () => {
            expect(process.env.GITHUB_REPOSITORY).toMatch(/.+\/.+/);
        });
    });

    describe("RECORD_DAY_RANGE", () => {
        it("should be exist", () => {
            expect(process.env.RECORD_DAY_RANGE).not.toBeUndefined();
        });
    });
});

