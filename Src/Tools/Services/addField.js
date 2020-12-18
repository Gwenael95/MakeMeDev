/**
 * @namespace Tools
 */
/**
 * This file requires {@link module:../Common/undefinedControl},  {@link module:../Common/countOccurrence}.
 * @requires module:../Common/undefinedControl
 * @requires module:../Common/countOccurrence
 */
const {isUndefinedOrNull} = require("../Common/undefinedControl")
const {countOccurrencesFromArray} = require("../Common/countOccurrence")

/**
 * addAuthor
 * @function
 * @memberOf Tools
 * @name addAuthor -
 * Add an author field in an object with id, pseudo and avatar.
 * @param {object} author - Typically a user object
 * @param {object} object - The object from where we will add author
 */
function addAuthor(author, object){
    object.author =  {
        "userId": author._id,
        "pseudo": author.pseudo,
        "avatar": author.avatar
    }
}

/**
 * addDate
 * @function
 * @memberOf Tools
 * @name addDate -
 * Add a Date field in an object.
 * @param {object} object - The object from where we will add date
 * @param {string} [fieldName="creationDate"] - name of field that will be created
 */
function addDate(object, fieldName="creationDate"){
    object[fieldName] = new Date().getTime() / 1000
}

/**
 * setTypes
 * @function
 * @memberOf Tools
 * @name setTypes -
 * Add a Date field in an object.
 * @param {object} post - Typically a post object
 * @param {string} fieldName - name of field that will be created
 */
function setTypes(post, fieldName) {
    let arr = []
    if (isUndefinedOrNull(post[fieldName])) {
        post[fieldName] = arr
    }
    else {
        for (let element of post[fieldName]) {
            arr.push(element.type)
        }
    }
    post[fieldName.toLowerCase() + "Types"] = countOccurrencesFromArray(arr)
}


module.exports = {addAuthor, addDate, setTypes}
