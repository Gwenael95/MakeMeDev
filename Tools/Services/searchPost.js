const {searchRegex} = require("../Common/regex")

function getSearchPost(search) {
    return {
        functionName: returnFieldByRegex(search, searchRegex.functionName, true),
        paramsTypes: returnFieldByRegex(search, searchRegex.params),
        returnsTypes: returnFieldByRegex(search, searchRegex.returns),
        description: returnFieldByRegex(search, searchRegex.description),
        tag: returnFieldByRegex(search, searchRegex.tags)
    };
}
function returnFieldByRegex(text, regex, shouldReturnStr= false) {
    const res = text.match(regex)
    return res===null || res===undefined ? (shouldReturnStr ? "" : null ) : res[0]
}

module.exports = {getSearchPost}
