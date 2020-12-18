/**
 * @namespace Tools
 */
/**
 * This file requires {@link module:../Common/regex}.
 * @requires module:../Common/regex
 */
const {searchRegex} = require("../Common/regex")

/**
 * Used to return an object with function name, params and returns types, description and tag extracted
 * from a string thanks to regex.
 * @function
 * @memberOf Tools
 * @name getSearchPost
 * @param {string} search - string containing criteria we want to search in DB, delimited by characters like () or []
 * @returns {{functionName: (string|null), paramsTypes: (string|null), description: (string|null), returnsTypes: (string|null), tag: (string|null)}}
 */
function getSearchPost(search) {
    return {
        functionName: returnFieldByRegex(search, searchRegex.functionName, true),
        paramsTypes: returnFieldByRegex(search, searchRegex.params),
        returnsTypes: returnFieldByRegex(search, searchRegex.returns),
        description: returnFieldByRegex(search, searchRegex.description),
        tag: returnFieldByRegex(search, searchRegex.tags)
    };
}

/**
 * Return the first occurrence matching with regex in a string or null if any found
 * @function
 * @memberOf Tools
 * @name returnFieldByRegex
 * @param {string} text - string to slice with regex
 * @param {RegExp} regex - regex we used to extract a part of a string
 * @param {boolean} [shouldReturnStr=false] - if true, we return a void string "", else null
 * @returns {*}
 */
function returnFieldByRegex(text, regex, shouldReturnStr= false) {
    const res = text.match(regex)
    return res===null || res===undefined ? (shouldReturnStr ? "" : null ) : res[0]
}

module.exports = {getSearchPost}
