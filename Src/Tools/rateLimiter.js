const rateLimit = require('express-rate-limit');

/**
 * Config of our request limit, with 100 request per minute
 * @type {{headers: boolean, windowMs: number, max: number, message: string}}
 */
const rateLimiterConfig = {
    windowMs:   60 * 1000, // 1 mn in milliseconds
    max: 100,
    message: 'You have exceeded the 100 requests in 1 mn limit!',
    headers: true,
}
const rateLimiterUsingThirdParty = rateLimit(rateLimiterConfig);

module.exports = {rateLimiterUsingThirdParty, rateLimiterConfig}
