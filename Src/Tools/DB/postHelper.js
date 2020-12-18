/**
 * @namespace Tools
 */
/**
 * Get last commentary id for a post matching with id in params.
 * @function
 * @memberOf Tools
 * @name getLastCommentaryId
 * @param {object} result - a result from DB
 * @param {string} postId - post'id
 * @returns {null|*}
 */
function getLastCommentaryId(result, postId) {
    try {
        let commentaryId;
        for (let el of result.post) {
            if (JSON.stringify(el._id) === JSON.stringify(postId)) {
                commentaryId = el.commentary[el.commentary.length - 1]._id
                break
            }
        }
        return commentaryId;
    }catch (e) {
        return null
    }
}

/**
 * get last response id from a result post object.
 * @function
 * @memberOf Tools
 * @name getLastResponseId
 * @param {object} result - a result from DB
 * @returns {*}
 */
function getLastResponseId(result) {
    return result.post[result.post.length - 1]._id;
}

module.exports = {getLastCommentaryId, getLastResponseId}
