module.exports = {
    createReviewComment: {
        value: 1,
        getCurrentCounts: () => 1, // 只要有就是 1 分
    },
    reactionPlusOne: {
        value: 1,
        getCurrentCounts: comment => comment?.reactions?.["+1"] ?? 0,
    },
    reactionMinusOne: {
        value: -1,
        getCurrentCounts: comment => comment?.reactions?.["-1"] ?? 0,
    },
    reactionLaugh: {
        value: 1,
        getCurrentCounts: comment => comment?.reactions?.laugh ?? 0,
    },
    reactionHooray: {
        value: 1,
        getCurrentCounts: comment => comment?.reactions?.hooray ?? 0,
    },
    reactionConfused: {
        value: 0,
        getCurrentCounts: comment => comment?.reactions?.confused ?? 0,
    },
    reactionHeart: {
        value: 1,
        getCurrentCounts: comment => comment?.reactions?.heart ?? 0,
    },
    reactionRocket: {
        value: 1,
        getCurrentCounts: comment => comment?.reactions?.rocket ?? 0,
    },
    reactionEyes: {
        value: 1,
        getCurrentCounts: comment => comment?.reactions?.eyes ?? 0,
    },
};

