const jwt = require("jsonwebtoken");

/** @function
 * @name authenticateToken
 * Check User's token before authorized some community features
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

module.exports = {authenticateToken}
