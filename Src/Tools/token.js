const jwt = require("jsonwebtoken");

/** @function
 * @name generateAccessToken
 * @param {object} userData - user's data
 * @returns {undefined|*}
 */
function generateAccessToken(userData) {
    if (userData["success"]!==null && userData["success"]!==undefined) {
        return userData["token"] = jwt.sign(userData, process.env.TOKEN_SECRET, {expiresIn: '3600s'});
    }
}

module.exports  = {generateAccessToken}