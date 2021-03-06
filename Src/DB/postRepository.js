/**
 * @namespace DB
 */
/**
 * This file requires {@link module:../Models/postModel}, {@link module:../Tools/DB/postPipeline},
 * {@link module:../Tools/DB/postHelper}.
 * @requires module:../Models/postModel"
 * @requires module:../Tools/DB/postPipeline
 * @requires module:../Tools/DB/postHelper
 */
const mongoose = require('mongoose');
const {postSchema} = require("../Models/postModel");
const {getPipeline} = require("../Tools/DB/postPipeline")
const {getLastResponseId, getLastCommentaryId} = require("../Tools/DB/postHelper")

/**
 * A mongoose post model
 * @type {Model<Document>}
 */
const PostModel = mongoose.model('posts', postSchema)
const ObjectId = mongoose.Types.ObjectId;


//region get
/**
 * Get post in database depending on many criteria, and return the result of this try
 * @function
 * @memberOf DB
 * @name getPostByFunction
 * @param {object} searchedData - data to search in database
 * @returns {Promise<{success: {success: T}}|{error: Error.ValidationError | {[p: string]: ValidatorError | CastError} | number}>}
 */
async function getPostByFunction(searchedData) {
    return await PostModel
        .aggregate(getPipeline(searchedData))//.sort({"post.totalLike":1})
        .exec()
        .then(result => {return {success: result}})
        .catch(err => {
            return {error: err.errors}
        });
}

/**
 * Get post in database depending on post's Id, and return the result of this try
 * @function
 * @memberOf DB
 * @name getPostById
 * @param {object} postId - post's Id to search in database
 * @returns {Promise<{success: {success: T}}|{error: Error.ValidationError | {[p: string]: ValidatorError | CastError} | number}>}
 */
async function getPostById(postId) {
    return await PostModel
        .findOne({$or : [ {_id: ObjectId(postId)}, {"post._id":ObjectId(postId)}]})
        .exec()
        .then(result => {return {success: result}})
        .catch(err => {
            return {error: err.errors}
        });
}
//endregion

//region post
/**
 * Insert a new post in database, and return the result of this try
 * @function
 * @memberOf DB
 * @name addPost
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
//endregion

//region patch

/**
 * A generic function used to update a post.
 * @function
 * @memberOf DB
 * @name updatePost
 * @param {object} filter - object used by mongoDB to select corresponding documents in DB.
 * @param {object} update - object containing fields to set (ex: $set, or $push).
 * @param {string} id - a post's id
 * @returns {Promise<{commentaryId: (null|undefined), success: {commentaryId: (null|undefined), success: T, postId: *, responseId: *}, postId: *, responseId: *}|{error}>}
 */
async function updatePost(filter, update, id) {
    return await PostModel
        .findOneAndUpdate(
            filter,
            update,
            {new: true, context: "query"})
        .lean()
        .exec()
        .then((result ) => {
            return {success: result, postId: id , responseId: getLastResponseId(result), commentaryId: getLastCommentaryId(result, id)}
        })
        .catch(err => {
            return {error: err.errors}
        });
}

/**
 * Update a post function.
 * @function
 * @memberOf DB
 * @name updatePostFunction
 * @param {string} functionPost - the new function
 * @param {string} idPost - a post's id
 * @returns {Promise<{commentaryId: (null|undefined), success: {commentaryId: (null|undefined), success: T, postId: *, responseId: *}, postId: *, responseId: *}|{error}>}
 */
async function updatePostFunction(functionPost, idPost) {
    return await updatePost({"post._id": ObjectId(idPost)}, {$set : {"post.$.function": functionPost}}, idPost)
}

/**
 * Add a post response.
 * @function
 * @memberOf DB
 * @name pushPostResponse
 * @param {object} responsePost - a new response post to add in an array in DB
 * @param idPost - a post's id
 * @returns {Promise<{commentaryId: (null|undefined), success: {commentaryId: (null|undefined), success: T, postId: *, responseId: *}, postId: *, responseId: *}|{error}>}
 */
async function pushPostResponse(responsePost, idPost) {
    return await updatePost({"_id": ObjectId(idPost)}, {$push : {post: responsePost}}, idPost)
}

/**
 * Add a post commentary.
 * @function
 * @memberOf DB
 * @name pushPostResponseCommentary
 * @param {object} commentaryResponse -  a new commentary to add in an array in DB
 * @param idPost - a post's id
 * @returns {Promise<{commentaryId: (null|undefined), success: {commentaryId: (null|undefined), success: T, postId: *, responseId: *}, postId: *, responseId: *}|{error}>}
 */
async function pushPostResponseCommentary(commentaryResponse, idPost) {
    return await updatePost({"post._id": ObjectId(idPost)}, {$push : {"post.$.commentary": commentaryResponse}}, idPost)
}

/**
 * Add or update like/dislike for a post.
 * start by checking if user already vote for this post.
 * if not we increment the like/dislike counter.
 * else, if it changes is mind (want to change a like by a dislike), we decrement
 * the old vote and increase the new one.
 * @function
 * @memberOf DB
 * @name updateLikeOrDislike
 * @param {string} likeOrDislike - a string equals to 'like' or 'dislike'
 * @param {string} idPost - post's id
 * @param {object} user - user's data (needed to know his activities)
 * @returns {Promise<{error: string}|*>}
 */
async function updateLikeOrDislike(likeOrDislike, idPost, user) {
    /**
     * A string, opposite to the current vote
     * @type {string}
     */
    let opposite = {like:"dislike", dislike:"like"}[likeOrDislike]
    /**
     * An object containing fields to set in DB
     * @type {object}
     */
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
    return await updatePost({"post._id": ObjectId(idPost)}, setPost, idPost)
}
//endregion


module.exports = {addPost, getPostByFunction, getPostById, updateLikeOrDislike,
    pushPostResponse, pushPostResponseCommentary, updatePostFunction};
