const jwt = require("jsonwebtoken");

/** @function
 * @name authenticateToken
 * Check User's token before authorized some community features
 * @param {Request} req - request received
 * @param {Response} res - response to dispatched
 * @param {Function} next - get control to the next middleware function
 * @returns {*}
 */
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user ) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

module.exports = {authenticateToken}
