/**
 * This Controller file requires {@link module:../Services/postService }  and
 * {@link module:../Tools/Controller/controllerHelper}.
 * @requires module:../Services/postService
 * @requires module:../Tools/Controller/controllerHelper
 */
const { create, get, updateVote, addPostResponse, addCommentary, updateFunction } = require("../Services/postService");
const {emptyRequest} = require("../Tools/Controller/controllerHelper");

//region get
/** @function
 * @name getPost
 * @async
 * Get a post from database if our query isn't empty.
 * @param {Object.<Request>} req - request received
 * @param {Object.<Response>} res - response to dispatched
 * @param {Function} next - get control to the next middleware function
 * @returns {Promise<*|boolean|void>}
 */
exports.getPost = async (req, res, next)  => {
    const response = emptyRequest(req.search) ? emptyRequest(req.search) : await get(req.search)
    return res.status(response.code).send(response.body)
};
//endregion

//region post
/** @function
 * @name sendPost
 * Send a post to add in database if our post data isn't empty.
 * @param {Object.<Request>} req - request received
 * @param {Object.<Response>} res - response to dispatched
 * @param {Function} next - get control to the next middleware function
 * @returns {Promise<*|boolean|void>}
 */
exports.sendPost = async (req, res, next) => {
    const {post} = req.body;
    const response = emptyRequest(post) ? emptyRequest(post) : await create(post, req.user)
    return res.status(response.code).send(response.body)
};
//endregion

//region patch
/** @function
 * @name sendVote
 * Send a vote to like or dislike a post in DB.
 * @param {Object.<Request>} req - request received
 * @param {Object.<Response>} res - response to dispatched
 * @param {Function} next - get control to the next middleware function
 * @returns {Promise<*|boolean|void>}
 */
exports.sendVote = async (req, res, next)  => {
    const {vote, idPost} =  req.body
    const response = emptyRequest(vote) ? emptyRequest(vote) : await updateVote(vote, idPost, req.user)
    return res.status(response.code).send(response.body)
};

/** @function
 * @name addResponse
 * Send a response to add to a post in DB.
 * @param {Object.<Request>} req - request received
 * @param {Object.<Response>} res - response to dispatched
 * @param {Function} next - get control to the next middleware function
 * @returns {Promise<*|boolean|void>}
 */
exports.addResponse = async (req, res, next)  => {
    const {responsePost, idPost} =  req.body
    const response = emptyRequest(responsePost) ? emptyRequest(responsePost) : await addPostResponse(responsePost, idPost, req.user)
    return res.status(response.code).send(response.body)
};

/** @function
 * @name addCommentary
 * Send a comment to add to a post in DB.
 * @param {Object.<Request>} req - request received
 * @param {Object.<Response>} res - response to dispatched
 * @param {Function} next - get control to the next middleware function
 * @returns {Promise<*|boolean|void>}
 */
exports.addCommentary = async (req, res, next)  => {
    const {commentaryPost, idPost} =  req.body
    const response = emptyRequest(commentaryPost) ? emptyRequest(commentaryPost) : await addCommentary(commentaryPost, idPost, req.user)
    return res.status(response.code).send(response.body)
};

/** @function
 * @name updateFunction
 * Send a function to update it in a post in DB.
 * @param {Object.<Request>} req - request received
 * @param {Object.<Response>} res - response to dispatched
 * @param {Function} next - get control to the next middleware function
 * @returns {Promise<*|boolean|void>}
 */
exports.updateFunction = async (req, res, next)  => {
    const {functionPost, idPost} =  req.body
    const response = emptyRequest(functionPost) ? emptyRequest(functionPost) : await updateFunction(functionPost, idPost, req.user)
    return res.status(response.code).send(response.body)
};
//endregion



