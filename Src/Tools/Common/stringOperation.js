/**
 * @namespace Tools
 */
/**
 * Get a string in a delimited area defined by first and last delimiter.
 * If the second delimiter isn't found in string, return a string from first delimiter to end.
 * @function
 * @memberOf Tools
 * @name getStringDelimitedArea
 * @param {string} str - string to analyse
 * @param {string} firstDelimiter - first delimiter used  to get the result
 * @param {string} lastDelimiter - last delimiter used to get the result
 * @returns {string|null}
 */
function getStringDelimitedArea(str, firstDelimiter, lastDelimiter) {
    return (str.includes(firstDelimiter) && str.includes(lastDelimiter)) ?
        str.substring(str.lastIndexOf(firstDelimiter) + 1, str.lastIndexOf(lastDelimiter)) : null;
}

/**
 * Get a string in a delimited area defined by a delimiter.
 * If there is only one delimiter, return null.
 * @function
 * @memberOf Tools
 * @name getSearchValue
 * @param {string} str - string to analyse
 * @param {string} delimiter - delimiter used to get the result
 * @returns {string|null}
 */
function getSearchValue(str, delimiter){
    let value = []
    let countCharacter = 0;
    str.split("").map((searchCharacter, index) => {
        if (searchCharacter === delimiter) {
            countCharacter ++
            value.push(index)
        }
    })
    return countCharacter === 2 ? str.substring(value[0] + 1, value[1]) : null
}

/**
 * Delete all spaces in a string.
 * @function
 * @memberOf Tools
 * @name filterDelSpaces
 * @param {string} string - string that won't have spaces anymore
 * @returns {*|void}
 */
function filterDelSpaces(string){
    return string.replace(/\s/g, '')
}

/**
 * Replace all character from a string by another one.
 * @function
 * @memberOf Tools
 * @name replaceAllChar
 * @param {string} stringToUpdate - the string that will change
 * @param {string} elementToReplace - a char or string that will be replaced into the main string
 * @param {string} replaceString - char or string that will replace old char
 * @returns {null|*|void|string}
 */
function replaceAllChar(stringToUpdate, elementToReplace, replaceString){
    try {
        return stringToUpdate.replace(new RegExp(elementToReplace,"g"), replaceString)
    }
    catch (e) {
        return null
    }
}

module.exports = {getStringDelimitedArea, getSearchValue, filterDelSpaces, replaceAllChar}
