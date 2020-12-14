const mongoose = require('mongoose');
const {postSchema} = require("../Models/postModel");
const PostModel = mongoose.model('posts', postSchema)
const {countOccurrencesFromArray} = require("../Tools/Common/countOccurence")
const {filterDelSpaces} = require("../Tools/Common/stringOperation")
const ObjectId = mongoose.Types.ObjectId;

/** @function
 * @name addPost
 * Insert a new post in database, and return the result of this try
 * --Should update Current user information, push a new post--
 * @param {object} postData - post to add, should correspond to postModels {@link '../Models/postModels'}.
 * @returns {Promise<{success: {success: T}}|{error: Error.ValidationError | {[p: string]: ValidatorError | CastError} | number}>}
 */
async function addPost(postData, user) {
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
        .aggregate(getPipeline(searchedData))//.sort({"post.totalLike":1})
        .exec()
        .then(result => {return {success: result}})
        .catch(err => {
            return {error: err.errors}
        });
}


function getCommentaryId(result, id) {
    try {
        let commentaryId;
        for (let el of result.post) {
            if (JSON.stringify(el._id) === JSON.stringify(id)) {
                commentaryId = el.commentary[el.commentary.length - 1]._id
                break
            }
        }
        return commentaryId;
    }catch (e) {
        return null
    }
}

function getResponseId(result) {
    return result.post[result.post.length - 1]._id;
}

async function updatePost(filter, update, id) {
    return await PostModel
        .findOneAndUpdate(
            filter,
            update,
            {new: true, context: "query"})
        .lean()
        .exec()
        .then((result ) => {
            console.log(result)
            return {success: result, postId: id , responseId: getResponseId(result), commentaryId: getCommentaryId(result, id)}
        })
        .catch(err => {
            console.log(err)
            return {error: err.errors}
        });
}

async function updatePostFunction(functionPost, idPost) {
    return await updatePost({"post._id": ObjectId(idPost)}, {$set : {"post.$.function": functionPost}}, idPost)
}

async function updatePostResponse(responsePost, idPost) {
    return await updatePost({"_id": ObjectId(idPost)}, {$push : {post: responsePost}}, idPost)
}

async function updatePostResponseCommentary(commentaryResponse, idPost) {
    return await updatePost({"post._id": ObjectId(idPost)}, {$push : {"post.$.commentary": commentaryResponse}}, idPost)
}

async function updateLikeOrDislike(likeOrDislike, idPost, user) {
    let opposite = {like:"dislike", dislike:"like"}[likeOrDislike]
    //check if user already vote for this post;
    // if no : increment like or dislike field
    // if yes : if it have added a like, and now send a like : DO NOTHING  (same for dislike)
    //          if it have added a like and change is mind : $inc : -1 for like and $inc +1 for dislike (& vice versa)
    //update user activities
    let setPost

    if (!(user.activities[likeOrDislike].includes(idPost) || user.activities[opposite].includes( idPost))) {
        setPost = {$inc: {["post.$." + likeOrDislike]:1}}
    }
    else if(user.activities[opposite].includes( idPost)) {
        setPost = {$inc: {["post.$." + likeOrDislike]:1, ["post.$." + opposite]:-1}}
    }
    else{
        return {error:"cet utilisateur à déjà mis un " + likeOrDislike}
    }
    //need to update user ACTIVITIES
    return await updatePost({"post._id": ObjectId(idPost)}, setPost, idPost)
}

//region not exported function
/** @function
 * @name getPipeline
 * Get a complex Pipeline to search all function depending on data search field
 * @param {object} data - post's data
 * @returns {[]}
 */
function getPipeline(data) {
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
        if (array.length > 0 && data!=="") {
            return [{$match: {[dbField]: {$all: array}}}]
        }
        else if (data==="") {
            return [{$match: {[dbField]:{$size: 0}}}]
        }
    }
    return []
}
//endregion

function getTabParamOrReturn(data, types, paramsOrResults) {
    let paramOrResultTypeQuery = []
    if (data[types] !== null) {
        let dataSearch = (filterDelSpaces(data[types]).split(","))
        let occurrences = countOccurrencesFromArray(dataSearch)
        if (dataSearch.length > 0) {
            return dataSearch.map(result => {
                //search the number of ? indicated in request
                if (result === "?") {
                    return {
                        $match: {
                            [paramsOrResults]: {$elemMatch: {type: {$regex: ""}}, $size: dataSearch.length}
                        }
                    }
                } else if (dataSearch.length === 1 && result === "") {
                    return {$match: {[paramsOrResults]: {$size: 0}}}
                } //else search all param by params type and numbers of these types
                else if (dataSearch.length >= 1) {
                    return {
                        $match: {
                            [paramsOrResults]: {$elemMatch: {type: result}, $size: dataSearch.length},
                            [types + "." + result]: {
                                $lte: (occurrences["?"] ? occurrences["?"] : 0) + occurrences[result],
                                $gte: occurrences[result]
                            }
                        }
                    }
                }
                // else, there isn't any params in request, we search by other criteria
                else {
                    return {$match: {[paramsOrResults]: {$elemMatch: {type: {$regex: ""}}}}}
                }
            })
        } else if (dataSearch.length === 0) {
            return [{$match: {[paramsOrResults]: {$size: dataSearch.length}}}]
        }
    }
    return paramOrResultTypeQuery;
}

//region query for params
/** @function
 * @name getParamTypeQuery
 * Get a query to search function param's type in DB
 * $match work to search the appropriate number of params to search and types
 * @param {object} data - post's data
 * @returns {{$match: {params: {$size: number}}}[]|unknown[]|[]}
 */
function getParamTypeQuery(data) {
    return getTabParamOrReturn(data, "paramsTypes", "params");
}

/** @function
 * @name getReturnTypeQuery
 * Get a query to search function return's type in DB
 * @param {object} data - post's data
 * @returns {*[]|{$match: {field: {$regex: data}}}[]}
 */
function getReturnTypeQuery(data) {
    return getTabParamOrReturn(data, "returnsTypes", "returns");
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
    return getMatchStringRegex (data.description, "post.description")
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


module.exports = {addPost, getPost, updateLikeOrDislike, updatePostResponse, updatePostResponseCommentary, updatePostFunction};
