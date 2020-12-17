/** @function
 * @name getStringDelimitedArea
 * Get a string in a delimited area defined by first and last delimiter
 * If the second delimiter isn't found in string, return a string from first delimiter to end
 * @param {string} str - string to analyse
 * @param {string} firstDelimiter - first delimiter used  to get the result
 * @param {string} lastDelimiter - last delimiter used to get the result
 * @returns {string|null}
 */
function getStringDelimitedArea(str, firstDelimiter, lastDelimiter) {
    return (str.includes(firstDelimiter) && str.includes(lastDelimiter)) ?
        str.substring(str.lastIndexOf(firstDelimiter) + 1, str.lastIndexOf(lastDelimiter)) : null;
}

/** @function
 * @name getSearchValue
 * Get a string in a delimited area defined by a delimiter
 * If there is only one delimiter, return null
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

/** @function
 * @name filterDelSpaces
 * delete all spaces in a string
 * @param {string} string - string that won't have spaces anymore
 * @returns {*|void}
 */
function filterDelSpaces(string){
    return string.replace(/\s/g, '')
}

/** @function
 * @name replaceAllChar
 * Replace all character from a string by another one
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
