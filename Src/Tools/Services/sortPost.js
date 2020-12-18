/**
 * @namespace Tools
 */
/**
 * This file requires {@link module:../Common/undefinedControl}.
 * @requires module:../Common/undefinedControl
 */
const {isDefinedAndNotNull} = require("../Common/undefinedControl")

/**
 * sortAllPostByLike
 * @function
 * @memberOf Tools
 * @name sortAllPostByLike -
 * Sort post array by like - dislike in descending order for all post from a response.
 * @param {object} data - typically a response with success field containing an array of posts
 * @returns {*}
 */
function sortAllPostByLike(data) {
    if (isDefinedAndNotNull(data.success)) {
        for (let func of data.success) {
            func = sortPostByLikes(func)
        }
    }
    return data
}

/**
 * sortPostByLikes
 * @function
 * @memberOf Tools
 * @name sortPostByLikes -
 * Sort post array of an object by like - dislike in descending order.
 * @param {object} data - typically a post object from a response
 * @returns {*}
 */
function sortPostByLikes(data) {
    data.post.sort(function (a, b) {
        return (b.like - b.dislike) - (a.like - a.dislike);
    })
    return data
}

module.exports = {sortPostByLikes, sortAllPostByLike}
