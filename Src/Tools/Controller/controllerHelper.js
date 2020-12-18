/**
 * @namespace Tools
 */
/**
 * Check if our request data isn't empty before continuing other actions.
 * @function
 * @memberOf Tools
 * @name emptyRequest
 * @param {object} reqData - data from our request to check
 * @returns {{code: number, body: {error: string}}}
 */
function emptyRequest (reqData){
    if (reqData === undefined || Object.keys(reqData).length === 0 && reqData.constructor === Object) {
        return {code: 400, body: {error: "Requete vide"}}
    }
}

module.exports = {emptyRequest}
