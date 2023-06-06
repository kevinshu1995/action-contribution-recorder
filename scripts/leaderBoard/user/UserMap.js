const User = require("./User");

const validateUserId = userId => {
    if (userId && typeof userId !== "number") {
        throw new Error("[UserMap error] User id must be number");
    }
};

class UserMap {
    constructor() {
        this.userMap = new Map();
    }

    set(userInfo) {
        const userId = userInfo.id;
        validateUserId(userId);

        if (this.has(userId) === true) {
            return this;
        }

        this.userMap.set(userId, new User(userInfo));
        return this;
    }

    has(userId) {
        validateUserId(userId);
        return this.userMap.has(userId);
    }

    get(userId) {
        validateUserId(userId);
        return this.userMap.get(userId);
    }

    getMapConvertedToObj() {
        return Array.from(this.userMap.entries()).reduce((all, [userId, userInstance]) => {
            all[userId] = { ...userInstance };
            return all;
        }, {});
    }
}

module.exports = UserMap;

