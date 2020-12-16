const {isDefinedAndNotNull} = require("../Common/undefinedControl")

function sortAllPostByLike(data) {
    if (isDefinedAndNotNull(data.success)) {
        for (let func of data.success) {
            func = sortPostByLikes(func)
        }
    }
    return data
}

function sortPostByLikes(data) {
    data.post.sort(function (a, b) {
        return (b.like - b.dislike) - (a.like - a.dislike);
    })
    return data
}

module.exports = {sortPostByLikes, sortAllPostByLike}
