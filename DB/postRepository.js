const mongoose = require('mongoose');
const {postSchema} = require("../Models/postModel");
const PostModel = mongoose.model('posts', postSchema)
const {countOccurrencesFromArray} = require("../Tools/Common/countOccurence")
const {filterDelSpaces} = require("../Tools/Common/stringOperation")

/** @function
 * @name addPost
 * Insert a new post in database, and return the result of this try
 * --Should update Current user information, push a new post--
 * @param {object} postData - post to add, should correspond to postModels {@link '../Models/postModels'}.
 * @returns {Promise<{success: {success: T}}|{error: Error.ValidationError | {[p: string]: ValidatorError | CastError} | number}>}
 */
async function addPost(postData) {
    const doc = new PostModel(postData);
    return await doc.save().then(result => {
        return {success: result}
    }).catch(err => {
        return {error: err.errors}
    })
}


/** @function
 * @name getPost
 * Get post in database depending on a many fields, and return the result of this try
 * @param {object} searchedData - data to search in database
 * @returns {Promise<{success: {success: T}}|{error: Error.ValidationError | {[p: string]: ValidatorError | CastError} | number}>}
 */
async function getPost(searchedData) {
    return await PostModel
        .aggregate(getPipeline(searchedData))
        .exec()
        .then(result => {
            return {success: result}
        })
        .catch(err => {
            return {error: err.errors}
        });
}


//region not exported function
/** @function
 * @name getPipeline
 * Get a complex Pipeline to search all function depending on data search field
 * @param {object} data - post's data
 * @returns {T[]}
 */
function getPipeline(data) {
    //console.log(getParamTypeQuery(data))
    console.log(JSON.stringify(getNameQuery(data)
        .concat(getParamTypeQuery(data), getReturnTypeQuery(data), getDescriptionQuery(data), getTagQuery(data))))
    return getNameQuery(data)
        .concat(getParamTypeQuery(data), getReturnTypeQuery(data), getDescriptionQuery(data), getTagQuery(data));
}

//region query for string's array
/** @function
 * @name getTagQuery
 * Get a query to search function's tag in DB
 * @param {object} data - post's data
 * @returns {*[]|{$match: {field: {$all: data}}}[]}
 */
function getTagQuery(data) {
    return getMatchFromStringArray(data.tag, "tag")
}

/** @function
 * @name getMatchFromStringArray
 * Create a $match for a defined field from database containing an array
 * Check if another array contains some or all elements of this DB field
 * @param {string} data - an array containing strings
 * @param {string} dbField - field name from DB
 * @returns {[]|[{$match: {field:{$all:data}}}]}
 */
function getMatchFromStringArray(data, dbField) {
    if (data !== null) {
        let array = (filterDelSpaces(data).split(","))
        if (array.length > 0) {
            return [{$match: {[dbField]: {$all: array}}}]
        }
    }
    return []
}
//endregion

//region query for params
/** @function
 * @name getParamTypeQuery
 * Get a query to search function param's type in DB
 * $match work to search the appropriate number of params to search and types
 * @param {object} data - post's data
 * @returns {{$match: {params: {$size: number}}}[]|unknown[]|[]}
 */
function getParamTypeQuery(data) {
    let paramTypeQuery = []
    if (data.paramsTypes !== null) {
        let dataParams = (filterDelSpaces(data.paramsTypes).split(","))
        let occurrences = countOccurrencesFromArray(dataParams)
        if (dataParams.length > 0) {
            return dataParams.map(param => {
                //search the number of ? indicated in request
                if (param === "?") {
                    return {$match: {params: {$elemMatch: {type: {$regex: ""}}, $size:dataParams.length}
                    }}
                } //else search all param by params type and numbers of these types
                else if(dataParams.length >1 ){
                    return {
                        $match: {params: {$elemMatch: {type: param}},
                            ["paramsTypes."+param]:{
                            $lte:(occurrences["?"] ? occurrences["?"] : 0)+occurrences[param], $gte:occurrences[param]}
                        }}
                } // else, there isn't any params in request, we search by other criteria
                else{
                    return {$match: {params: {$elemMatch: {type: {$regex: ""}}}}}
                }
            })
        } else if (dataParams.length === 0) {
            return [{$match: {params: {$size: dataParams.length}}}]
        }
    }

    return paramTypeQuery;
}

/** @function
 * @name getReturnTypeQuery
 * Get a query to search function return's type in DB
 * @param {object} data - post's data
 * @returns {*[]|{$match: {field: {$regex: data}}}[]}
 */
function getReturnTypeQuery(data) {
    let returnTypeQuery = []
    if (data.returnType !== null) {
        if (Object.keys(data.returnType).length > 0) {
            returnTypeQuery.push({$match: {"return.type": data.returnType}})
        } else if (Object.keys(data.returnType).length === 0) {
            returnTypeQuery.push({$match: {"return.type": {$size: Object.keys(data.returnType).length}}})
        }
    }
    return returnTypeQuery;
}
//endregion

//region query for string
/** @function
 * @name getDescriptionQuery
 * Get a query to search function's description in DB
 * @param {object} data - post's data
 * @returns {*[]|{$match: {field: {$regex: data}}}[]}
 */
function getDescriptionQuery(data) {
    return getMatchStringRegex (data.description, "post.function")
}

/** @function
 * @name getNameQuery
 * Get a query to search function's name in DB
 * @param {object} data - post's data
 * @returns {*[]|{$match: {field: {$regex: data}}}[]}
 */
function getNameQuery(data) {
    return getMatchStringRegex (data.functionName, "name")
}

/** @function
 * @name getMatchStringRegex
 * Return an array with a $match for a defined DB field
 * @param {string} data - a string that will be used in regex
 * @param {string} dbField -
 * @returns {*[]|{$match: {field: {$regex:data}}}[]}
 */
function getMatchStringRegex(data, dbField){
    if (data !== null) {
        return [{$match: {[dbField]: {$regex: data}}}];
    }
    return []
}
//endregion

//endregion

module.exports = {addPost, getPost};
