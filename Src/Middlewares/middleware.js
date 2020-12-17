const jwt = require("jsonwebtoken");

/** @function
 * @name authenticateToken
 * Check User's token before authorized some community features, add user field in req.
 * @param {Object.<Request>} req - request received
 * @param {Object.<Response>} res - response to dispatched
 * @param {Function} next - get control to the next middleware function
 * @returns {*}
 */
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user ) => {
        if (err) return res.sendStatus(403)
        req.user = user.success
        next()
    })
}

/** @function
 * @name handleGetPost
 * Allow to search post by id or with several criteria extracted from a string.
 * @param {Object.<Request>} req - request received
 * @param {Object.<Response>} res - response to dispatched
 * @param {Function} next - get control to the next middleware function
 */
function handleGetPost(req, res, next) {
    const {search, postId} =  req.query
    req.search = {search:search, postId:postId}
    next()
}


module.exports = {authenticateToken, handleGetPost}
