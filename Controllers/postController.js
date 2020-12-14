const { create, get, updateVote } = require("../Services/postService");
const {emptyRequest} = require("../Tools/Controller/controllerHelper");

/** @function
 * @name sendPost
 * Send a post to add in database if our post data isn't empty
 * @param {Request<{user:object, body:object, params:object}>} req - request received
 * @param {Response<{status:int}>} res - response to dispatched
 * @param {Function} next - get control to the next middleware function
 * @returns {Promise<*|boolean|void>}
 */
exports.sendPost = async (req, res, next) => {
    const {post} = req.body;
    const response = emptyRequest(post) ? emptyRequest(post) : await create(post, req.user)
    return res.status(response.code).send(response.body)
};

exports.sendVote = async (req, res, next)  => {
    const {vote, idPost} =  req.body
    const response = emptyRequest(vote) ? emptyRequest(vote) : await updateVote(vote, idPost, req.user)
    return res.status(response.code).send(response.body)
};

/** @function
 * @name getPost
 * Get a post from database if our query isn't empty
 * @param {Request} req - request received
 * @param {Response} res - response to dispatched
 * @param {Function} next - get control to the next middleware function
 * @returns {Promise<*|boolean|void>}
 */
exports.getPost = async (req, res, next)  => {
    const {search} =  req.query
    const response = emptyRequest(search) ? emptyRequest(search) : await get(search)
    return res.status(response.code).send(response.body)
};






