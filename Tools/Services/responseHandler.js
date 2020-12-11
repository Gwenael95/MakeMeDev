/** @function
 * @name getHandler
 * Handle HTTP status code and body content to return in a response to Front team
 * For GET request
 * @param {{success: string, object}|{error: string}} data - object with success or error data
 * @param {string} notFoundMsg - message displayed if we got a success without data
 * @returns {{code: number, body: {error: string}}|{code: number, body: {error: *}}|{code: number, body: *}}
 */
function getHandler(data, notFoundMsg){
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
 * @name addHandler
 * Handle HTTP status code and body content to return in a response to Front team
 * For POST request
 * @param {{success: string, object}|{error: string}} data - object with success or error data
 * @returns {{code: number, body: {error: string}}|{code: number, body: {error: *}}|{code: number, body: *}}
 */
function addHandler(data){
    if (data["error"]) {
        let errors = {error: {}}
        Object.values(data["error"]).map((errorMessage, index) => {
            errors.error = {...errors.error, [errorMessage.path]: errorMessage.kind}
        });
        return {code: 404, body: errors}
    } else if (data["success"]) {
        return {code: 200, body: data}
    } else {
        return {code: 404, body: {error: "erreur en base de donnée"}}
    }
}

module.exports = {getHandler, addHandler}
