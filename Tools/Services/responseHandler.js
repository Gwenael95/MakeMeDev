
/** @function
 * @name getHandler
 * Handle HTTP status code and body content to return in a response to Front team
 * For GET request
 * @param {{success: string, object}|{error: string}} data - object with success or error data
 * @param {string} notFoundMsg - message displayed if we got a success without data
 * @returns {{code: number, body: {error: string}}|{code: number, body: {error: *}}|{code: number, body: *}}
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

module.exports = {getHandler}
