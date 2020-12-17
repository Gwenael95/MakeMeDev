/**
 * A list of regex we can use to extract search criteria from a simple string
 * like function name, params, returns, description or tags
 * @type {{functionName: RegExp, description: RegExp, returns: RegExp, params: RegExp, tags: RegExp}}
 */
const searchRegex = {
    functionName: /^[a-zA-Z]+[a-zA-Z0-9]?/,
    params: /(?<=\()(.*)(?=\))/g,
    returns : /(?<=\{)(.*)(?=\})/g,
    description : /(?<=\")(.*)(?=\")/g,
    tags : /(?<=\[)(.*)(?=\])/g,
}

module.exports = {searchRegex}
