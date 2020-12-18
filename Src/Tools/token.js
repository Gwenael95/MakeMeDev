/**
 * @namespace Tools
 */
const jwt = require("jsonwebtoken");

/**
 * Generate an access token with user's data.
 * @function
 * @memberOf Tools
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
