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
 * Add an author field in an object with id, pseudo and avatar.
 * @function
 * @memberOf Tools
 * @name addAuthor
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
 * Add a Date field in an object.
 * @function
 * @memberOf Tools
 * @name addDate
 * @param {object} object - The object from where we will add date
 * @param {string} [fieldName="creationDate"] - name of field that will be created
 */
function addDate(object, fieldName="creationDate"){
    object[fieldName] = new Date().getTime() / 1000
}

/**
 * Add a Date field in an object.
 * @function
 * @memberOf Tools
 * @name setTypes
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
            arr.push(element.type.toLowerCase())
        }
    }
    post[fieldName.toLowerCase() + "Types"] = countOccurrencesFromArray(arr)
}


module.exports = {addAuthor, addDate, setTypes}
