
/** @function
 * @name getHandler
 * Handle HTTP status code and body content to return in a response to Front team
 * For GET request
 * @param {{success: object}|{error: string}} data - object with success or error data
 * @param {string} [notFoundMsg="error"] - message displayed if we got a success without data
 * @returns {{code: number, body: {error: string}}|{code: number, body: *}}
 */
function getHandler(data, notFoundMsg="error"){
    if (data["success"]===null) {
        return {code: 404, body: {error: notFoundMsg}}
    } else if (data["success"]) {
        return {code: 200, body: data}
    } else if (data["error"]) {
        return {code: 404, body: data}
    } else {
        return {code: 404, body: {error: "erreur en base de donnée"}}
    }
}


/** @function
 * @name getHandlerForUserPost
 * Handle HTTP status code and body content to return in a response to Front team
 * For GET request
 * @param {{success: object}|{error: string}} user - user's data
 * @param {{success: object}|{error: string}} post - post's data
 * @param {string} [notFoundMsg="error"] - message displayed if we got a success without data
 * @returns {{code: number, body: {success: {post: string | boolean | SrvPoller.success | Event, user: string | boolean | SrvPoller.success | Event}, token: *}}|{code: number, body: {error: string}}|{code: number, body: (*)}}
 */
function getHandlerForUserPost(user, post, notFoundMsg="error"){
    if (user["success"] && post["success"]){
        return {code: 200, body: {success:{ user:user.success, post:post.success}, token:user.token}}
    }
    else if (user["success"]===null || user["success"]===null) {
        return {code: 404, body: {error: notFoundMsg}}
    }
    else if (user["error"] || post["error"]) {
        return {code: 404, body: user["error"] ? user : post }
    } else {
        return {code: 404, body: {error: "erreur en base de donnée"}}
    }
}


module.exports = {getHandler, getHandlerForUserPost}
