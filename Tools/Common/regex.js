
const searchRegex = {
    functionName: /^[a-z]+[a-zA-Z0-9]+/,
    params: /(?<=\()(.*)(?=\))/g,
    returns : /(?<=\{)(.*)(?=\})/g,
    description : /(?<=\")(.*)(?=\")/g,
    tags : /(?<=\[)(.*)(?=\])/g,
}

module.exports = {searchRegex}
