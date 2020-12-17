/** @function
 * @name getLastCommentaryId
 * Get last commentary id for a post matching with id in params
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

/** @function
 * @name getLastResponseId
 * get last response id from a result post object
 * @param {object} result - a result from DB
 * @returns {*}
 */
function getLastResponseId(result) {
    return result.post[result.post.length - 1]._id;
}

module.exports = {getLastCommentaryId, getLastResponseId}
