/**
 * @namespace Services
 */
/**
 * This Service file requires {@link module:../DB/postRepository }, {@link module:../DB/userRepository},
 * {@link module:../Tools/token}, {@link module:../Tools/Services/searchPost },
 * {@link module:../Tools/Common/undefinedControl }, {@link module:../Tools/Services/addField}
 * {@link module:../Tools/Services/sortPost} and {@link module:../Tools/Services/responseHandler}

 * @requires module:../DB/postRepository
 * @requires module:../DB/userRepository
 * @requires module:../Tools/token
 * @requires module:../Tools/Services/searchPost
 * @requires module:../Tools/Common/undefinedControl
 * @requires module:../Tools/Services/addField
 * @requires module:../Tools/Services/sortPost
 * @requires module:../Tools/Services/responseHandler
 */
const { addPost, getPostByFunction, getPostById, updateLikeOrDislike, pushPostResponse,
        pushPostResponseCommentary, updatePostFunction} = require("../DB/postRepository");
const { updateUserById} = require("../DB/userRepository");

//region Tools
const { generateAccessToken} = require("../Tools/token");
const { getSearchPost} = require("../Tools/Services/searchPost");
const { isDefinedAndNotNull} = require("../Tools/Common/undefinedControl");
const { addDate, addAuthor, setTypes} = require("../Tools/Services/addField");
const { sortPostByLikes, sortAllPostByLike} = require("../Tools/Services/sortPost");
const { getHandler, getHandlerForUserPost, updateDbHandler} = require("../Tools/Services/responseHandler");
//endregion

//region exported methods
//region get
/**
 * get
 * @function
 * @memberOf Services
 * @name get -
 * Get posts depending on a request get thanks to a string with strict typography to demarcate
 * each field, and if not exist it will not be a criteria to search at all.
 * Structure : functionName(param1, param2, ?){returned1, returned2}"functionDescription"[tag1, tag2, tag3]
 * OR use a post id to get the corresponding post.
 * @param {object} search - search field to find in database
 * @returns {Promise<{code: number, body: {error: *}}|{code: number, body: *}|{code: number, body: *}|{code: number, body: {error: string}}>}
 */
async function get(search) {
    if (isDefinedAndNotNull(search.search)) {
        const objectSearchPost = getSearchPost(search.search)
        let queryRes = await getPostByFunction(objectSearchPost);
        return getHandler(sortAllPostByLike(queryRes), "No post exists with these details");
    }
    else {
        let queryRes = await getPostById(search.postId);
        queryRes.success = sortPostByLikes(queryRes.success)
        return getHandler(queryRes, "No post exists with this id");
    }
}
//endregion

//region post
/**
 * create
 * @function
 * @memberOf Services
 * @name create -
 * Create a new post, that will be add in database.
 * We add some field : paramsTypes and returnsTypes to have an object with a number of occurrence of each params.
 * Also creation date for post
 * It will make it simpler to search post depending on the amount of params or returns with getPost function.
 * @param {object} post - post to add, should be really similar to postModels {@link '../Models/postModels'}.
 * @param {object} user - user to update, should be really similar to userModels {@link '../Models/userModels'}.
 * @returns {Promise<{code: number, body: {success: {post: (string|boolean|SrvPoller.success|Event), user: (string|boolean|SrvPoller.success|Event)}, token: *}}|{code: number, body: {error: string}}|{code: number, body: *}>}
 */
async function create(post, user) {
    try {
        setTypes(post, "params");
        setTypes(post, "returns");
        addAuthor(user ,post)
        addAuthor(user ,post.post[0])
        addDate(post.post[0])
        addDate(post)

        const result = await addPost(post, user);
        if (result.success) {
            const userRes = await updateUserById({id: user._id}, {$push: {post: result.success._id}});
            return closeUserUpdateAction(userRes, result, "Post created, but can't update user's data")
        }
        return updateDbHandler(result, "Error when creating post", 500);
    }
    catch (e) {
        return updateDbHandler({error: "Can't create this post: bad request"})
    }
}
//endregion

//region patch
/**
 * updateFunction
 * @function
 * @memberOf Services
 * @name updateFunction -
 * Update a function from a post or post response thanks to its id.
 * @param {string} functionPost - the complete function, real code that could be run.
 * @param {string} idPost - post's or response post's id to update
 * @param {object} user - current user's data
 * @todo Check if current user if post or post response author
 * @returns {Promise<{code: number, body: {error: string}}|{code: number, body: *}>}
 */
async function updateFunction(functionPost, idPost, user) {
    if (functionPost) {
        return updateDbHandler(await updatePostFunction(functionPost, idPost), "Error when updating post function", 500)
    }
    return updateDbHandler({error: "Update function failed"}, "can't update post function: no functionPost found");
}

/**
 * updateVote
 * @function
 * @memberOf Services
 * @name updateVote -
 * Used to add or update a vote in DB for a post. Then we update user to know if it already have
 * like or dislike a function.
 * @param {int|string} vote - vote value. If it's an int, 1="like" & -1="dislike"
 * @param {string} idPost - post's id
 * @param {object} user - user's data
 * @returns {Promise<{code: number, body: {success: {post: (string|boolean|SrvPoller.success|Event), user: (string|boolean|SrvPoller.success|Event)}, token: *}}|{code: number, body: {error: string}}|{code: number, body: *}>}
 */
async function updateVote(vote, idPost, user) {
    const likeOrDislike = vote === 1 || vote === "like" ? "like" : "dislike"
    const opposite = vote === 1 || vote === "like" ? "dislike" : "like"
    let result = await updateLikeOrDislike(likeOrDislike, idPost, user)

    //check if updated , then update user
    if (isDefinedAndNotNull(result.success)) {
        const userRes = await updateUserById({id: user._id}, {
            $push: {["activities." + likeOrDislike]: result.postId},
            $pull: {["activities." + opposite]: result.postId}
        })
        result.success = sortPostByLikes(result.success)
        return closeUserUpdateAction(userRes, result, "Adding " + likeOrDislike + " on post with id= " + idPost + " is impossible")
    }
    return updateDbHandler({error: "Update vote failed"}, "Can't update vote post", 500);
}

/**
 * addPostResponse
 * @function
 * @memberOf Services
 * @name addPostResponse -
 * Add a response to a post (with a new function proposal) after adding author and date.
 * Then we update user to save in his activities he post a response.
 * @param {object} responsePost - a response to a post
 * @param {string} idPost - post's id
 * @param {object} user - user's data
 * @returns {Promise<{code: number, body: {success: {post: (string|boolean|SrvPoller.success|Event), user: (string|boolean|SrvPoller.success|Event)}, token: *}}|{code: number, body: {error: string}}|{code: number, body: *}>}
 */
async function addPostResponse(responsePost, idPost, user) {
    addAuthor(user, responsePost)
    addDate(responsePost)
    if (responsePost['function'] && responsePost['description']) {
        const result = await pushPostResponse(responsePost, idPost)
        if (result.success !== null && result.success !== undefined) {
            const userRes = await updateUserById({id: user._id}, {$push: {["activities.response"]: result.responseId}})
            result.success = sortPostByLikes(result.success)
            return closeUserUpdateAction(userRes, result, "Add a new response,but can't update user's data")
        }
    }
    return updateDbHandler({error: "Adding response failed"}, "Can't add response to post");
}

/**
 * addCommentary
 * @function
 * @memberOf Services
 * @name addCommentary -
 * Add a commentary to a post after adding author and date. Then we update user to save in his
 * activities he add a commentary to a post.
 * @param {object} commentaryPost - a commentary post
 * @param {string} idPost - post's id
 * @param {object} user - user's data
 * @returns {Promise<{code: number, body: {success: {post: (string|boolean|SrvPoller.success|Event), user: (string|boolean|SrvPoller.success|Event)}, token: *}}|{code: number, body: {error: string}}|{code: number, body: *}>}
 */
async function addCommentary(commentaryPost, idPost, user) {
    addAuthor(user, commentaryPost)
    addDate(commentaryPost, "date")
    if (commentaryPost['commentary']) {
        const result = await pushPostResponseCommentary(commentaryPost, idPost)
        if (result.success !== null && result.success !== undefined) {
            const userRes = await updateUserById({id: user._id}, {$push: {["activities.commentary"]: result.postId}})
            result.success = sortPostByLikes(result.success)
            return closeUserUpdateAction(userRes, result, "Add a new commentary, but can't update user's data")
        }
    }
    return updateDbHandler({error: "Adding commentary failed"}, "Can't add a commentary");
}
//endregion
//endregion


//region not exported functions
/**
 * closeUserUpdateAction
 * @function
 * @memberOf Services
 * @name closeUserUpdateAction -
 * This function is used to close action. We generate a new token
 * and return a http code status and body
 * @param {object} userData - user's data from a response
 * @param {object} postData - post's data from a response
 * @param {string } [msg= "DB error"] - message to send in body if there is an issue
 * @returns {{code: number, body: {success: {post: (string|boolean|SrvPoller.success|Event), user: (string|boolean|SrvPoller.success|Event)}, token: *}}|{code: number, body: {error: string}}|{code: number, body: *}}
 */
function closeUserUpdateAction(userData, postData, msg="DB error"){
    generateAccessToken(userData)
    return getHandlerForUserPost(userData, postData, msg);
}

//endregion

module.exports = {create, get, updateVote, addPostResponse, addCommentary, updateFunction};
