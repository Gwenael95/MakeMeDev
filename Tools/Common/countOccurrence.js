/** @function
 * @name countOccurrencesFromArray
 * Count occurrence of string in an array and return an object
 * with each string as key and occurrence as value
 * @param {array} arr - The array to analyse
 * @returns {object} - an object containing strings occurrences
 */
const countOccurrencesFromArray = arr => arr.reduce((prev, curr) => (prev[curr] = ++prev[curr] || 1, prev), {});

module.exports = {countOccurrencesFromArray}
