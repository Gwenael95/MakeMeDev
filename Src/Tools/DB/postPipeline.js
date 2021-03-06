/**
 * @namespace Tools
 */
/**
 * @memberOf Tools
 * This file requires {@link module:../Common/countOccurrence}, {@link module:../Common/stringOperation}.
 * @requires module:../Common/countOccurrence
 * @requires module:../Common/stringOperation
 */
const {countOccurrencesFromArray} = require("../Common/countOccurrence");
const {filterDelSpaces} = require("../Common/stringOperation");

//region exported

/**
 * Get a complex Pipeline to search all function depending on data search criteria.
 * @function
 * @memberOf Tools
 * @name getPipeline
 * @param {object} data - post's data
 * @returns {[]}
 */
function getPipeline(data) {
    return getNameQuery(data)
        .concat(getParamTypeQuery(data), getReturnTypeQuery(data), getDescriptionQuery(data), getTagQuery(data));
}
//endregion

//region pipeline back

//region query for string's array

/**

 * Create a $match for a defined field from database containing an array.
 * Check if another array contains some or all elements of this DB field.
 * @function
 * @memberOf Tools
 * @name getMatchFromStringArray
 * @param {string|null} data - an array containing strings, or null (then return empty array)
 * @param {string} dbField - field name from DB
 * @returns {[]|[{$match: {field:{$all:data}}}]}
 */
function getMatchFromStringArray(data, dbField) {

    if (data !== null) {
        let array = (filterDelSpaces(data).split(","))
        let regex = [];
        for (let i = 0; i < array.length; i++) {
            regex[i] = new RegExp(array[i], "i");
        }
        if (array.length > 0 && data!=="") {
            return [{$match: {[dbField]: {$all: regex}}}]
        }
        else if (data==="") {
            return [{$match: {[dbField]:{$size: 0}}}]
        }
    }
    return []
}

/**
 * Get a query to search all post's tags in DB.
 * @function
 * @memberOf Tools
 * @name getTagQuery
 * @param {object} data - post's data
 * @returns {*[]|{$match: {field: {$all: data}}}[]}
 */
function getTagQuery(data) {
    return getMatchFromStringArray(data.tag, "tag")
}

//endregion

//region query for returns/params array
/**
 * A complex function, used to prepare a mongo filter for returns or params types.
 * @function
 * @memberOf Tools
 * @name getTabParamOrReturn
 * @param {object} data - post's data
 * @param {string} dbFieldNameCount - field name that contain the count of each types
 * @param {string} paramsOrResults - array field name from DB that contains type (returns or params)
 * @returns {unknown[]|[]|{$match: {}}[]}
 */
function getTabParamOrReturn(data, dbFieldNameCount, paramsOrResults) {
    let paramOrResultTypeQuery = []
    if (data[dbFieldNameCount] !== null) {
        let dataSearch = (filterDelSpaces(data[dbFieldNameCount]).split(","))
        let occurrences = countOccurrencesFromArray(dataSearch)
        if (dataSearch.length > 0) {
            return dataSearch.map(result => {
                //search the number of ? indicated in request
                if (result === "?") {
                    return {
                        $match: {
                            [paramsOrResults]: {$elemMatch: {type: {$regex: "", $options: 'i'}}, $size: dataSearch.length}
                        }
                    }
                } else if (dataSearch.length === 1 && result === "") {
                    return {$match: {[paramsOrResults]: {$size: 0}}}
                } //else search all param by params type and numbers of these types
                else if (dataSearch.length >= 1) {
                    return {
                        $match: {
                            [paramsOrResults]: {$elemMatch: {type: {$regex: result , $options: 'i'}}, $size: dataSearch.length},
                            [dbFieldNameCount + "." + result.toLowerCase()]: {
                                $lte: (occurrences["?"] ? occurrences["?"] : 0) + occurrences[result],
                                $gte: occurrences[result]
                            }
                        }
                    }
                }
                // else, there isn't any params in request, we search by other criteria
                else {
                    return {$match: {[paramsOrResults]: {$elemMatch: {type: {$regex: "", $options: 'i'}}}}}
                }
            })
        } else if (dataSearch.length === 0) {
            return [{$match: {[paramsOrResults]: {$size: dataSearch.length}}}]
        }
    }
    return paramOrResultTypeQuery;
}

/**
 * Get a query to search function param's types in DB.
 * @function
 * @memberOf Tools
 * @name getParamTypeQuery
 * @param {object} data - post's data
 * @returns {{$match: {params: {$size: number}}}[]|unknown[]|[]}
 */
function getParamTypeQuery(data) {
    return getTabParamOrReturn(data, "paramsTypes", "params");
}

/**
 * Get a query to search function return's types in DB.
 * @function
 * @memberOf Tools
 * @name getReturnTypeQuery
 * @param {object} data - post's data
 * @returns {*[]|{$match: {field: {$regex: data}}}[]}
 */
function getReturnTypeQuery(data) {
    return getTabParamOrReturn(data, "returnsTypes", "returns");
}
//endregion

//region query for string
/**
 * Get a query to search function's description in DB.
 * @function
 * @memberOf Tools
 * @name getDescriptionQuery
 * @param {object} data - post's data
 * @returns {*[]|{$match: {field: {$regex: data}}}[]}
 */
function getDescriptionQuery(data) {
    return getMatchStringRegex (data.description, "post.description")
}

/**
 * Get a query to search function's name in DB.
 * @function
 * @memberOf Tools
 * @name getNameQuery
 * @param {object} data - post's data
 * @returns {*[]|{$match: {field: {$regex: data}}}[]}
 */
function getNameQuery(data) {
    return getMatchStringRegex (data.functionName, "name")
}

/**
 * Return a $match filter for a defined DB field.
 * @function
 * @memberOf Tools
 * @name getMatchStringRegex
 * @param {string|null} data - a string that will be used in regex, if null return an empty array
 * @param {string} dbField - DB field from where to match a value
 * @returns {*[]|{$match: {field: {$regex:data}}}[]}
 */
function getMatchStringRegex(data, dbField){
    if (data !== null) {
        return [{$match: {[dbField]: {$regex: data, $options: 'i'}}}];
    }
    return []
}
//endregion

//endregion


module.exports = {getPipeline}
