const { addPost, getPostByFunction, getPostById, updateLikeOrDislike, updatePostResponse,
    updatePostResponseCommentary, updatePostFunction} = require("../DB/postRepository");
const { updateUserById} = require("../DB/userRepository");

//region Tools
const { generateAccessToken} = require("../Tools/token");
const { getSearchPost} = require("../Tools/Services/searchPost");
const { isDefinedAndNotNull} = require("../Tools/Common/undefinedControl");
const { addDate, addAuthor, setTypes} = require("../Tools/Services/addField");
const { sortPostByLikes, sortAllPostByLike} = require("../Tools/Services/sortPost");
const { getHandler, getHandlerForUserPost} = require("../Tools/Services/responseHandler");
//endregion

//region exported methods

/** @function
 * @name get
 * Get posts depending on a request get thanks to a string with strict typography to demarcate
 * each field we have to check, and if not exist it will not be searched at all
 * Structure : [functionName](param1, param2, ?){returnedVar}"functionDescription"#tag1, tag2, tag3#
 * OR use a post id to get the corresponding post.
 * @param {object} search - search's field to find in database
 * @returns {Promise<{code: number, body: {error: *}}|{code: number, body: *}|{code: number, body: *}|{code: number, body: {error: string}}>}
 */
async function get(search) {
    if (isDefinedAndNotNull(search.search)) {
        const objectSearchPost = getSearchPost(search.search)
        let queryRes = await getPostByFunction(objectSearchPost);
        return getHandler(sortAllPostByLike(queryRes), "Aucun post correspondant");
    }
    else {
        let queryRes = await getPostById(search.postId);
        queryRes.success = sortPostByLikes(queryRes.success)
        return getHandler(queryRes, "ce post n'existe pas");
    }
}

async function updateFunction(functionPost, idPost, user) {
    if (functionPost) {
        return getHandler(await updatePostFunction(functionPost, idPost), "mise à jour de la fonction réussie")
    }
    return getHandler({error: "update response failed"}, "mise à jou du post impossible");
}


/** @function
 * @name create
 * Create a new post, that will be add in database.
 * We had one more field : paramsTypes to have an object with a number of occurrence of each params
 * It will make it simpler to search if a post contains an amount of params
 * @param {object} post - post to add, should be really similar to postModels {@link '../Models/postModels'}.
 * @param {object} user - user to update, should be really similar to userModels {@link '../Models/userModels'}.
 * @returns {Promise<{code: number, body: {error: {}}}|{code: number, body: *}|{code: number, body: {error: string}}>}
 */
async function create(post, user) {
    setTypes(post, "params");
    setTypes(post, "returns");
    addAuthor(user ,post)
    addAuthor(user ,post.post[0])
    const result = await addPost(post, user);
    if (result.success) {
        const userRes = await updateUserById({id: user._id}, {$push: {post: result.success._id}});
        return closeUserUpdateAction(userRes, result, "post créé, mais mise à jour des données utilisateur impossible")
    }
    return getHandler(result);
}

/*
async function updateUserIfSuccess(isSuccess, function) {
    if (isSuccess){
        const userRes = await function
        generateAccessToken(userRes)
        return getHandlerForUserPost(userRes,result, "mise à jour des votes utilisateur impossible");
    }
}*/



async function updateVote(vote, idPost, user) {
    const likeOrDislike = vote === 1 ? "like" : "dislike"
    const opposite = vote === 1 ? "dislike" : "like"
    let result = await updateLikeOrDislike(likeOrDislike, idPost, user)
    //check if updated , then update user
    if (isDefinedAndNotNull(result.success)) {
        const userRes = await updateUserById({id: user._id}, {
            $push: {["activities." + likeOrDislike]: result.postId},
            $pull: {["activities." + opposite]: result.postId}
        })
        result.success = sortPostByLikes(result.success)
        return closeUserUpdateAction(userRes, result, "ajout du " + likeOrDislike + " sur le post " + idPost + " impossible")
    }
    return getHandler({error: "update vote failed"}, "mise à jour des votes du post impossible");
}

async function addPostResponse(responsePost, idPost, user) {
    addAuthor(user, responsePost)
    addDate(responsePost, "creationDate")
    if (responsePost['function'] && responsePost['description']) {
        const result = await updatePostResponse(responsePost, idPost, user)
        if (result.success !== null && result.success !== undefined) {
            const userRes = await updateUserById({id: user._id}, {$push: {["activities.response"]: result.responseId}})
            return closeUserUpdateAction(userRes, result, "ajout d'une nouvelle reponse , mais mis à jour de l'utilisateur impossible")
        }
    }
    return getHandler({error: "update response failed"}, "ajout de reponse au post impossible");
}

async function addCommentary(commentaryPost, idPost, user) {
    addAuthor(user, commentaryPost)
    addDate(commentaryPost, "date")
    if (commentaryPost['commentary']) {
        const result = await updatePostResponseCommentary(commentaryPost, idPost, user)
        if (result.success !== null && result.success !== undefined) {
            const userRes = await updateUserById({id: user._id}, {$push: {["activities.commentary"]: result.commentaryId}})
            return closeUserUpdateAction(userRes, result, "ajout du commentaires, mais mis à jour de l'utilisateur impossible")
        }
    }
    return getHandler({error: "update response failed"}, "ajout du commentaires impossible");
}

//endregion


//region not exported functions
function closeUserUpdateAction(userData, postData, msg="erreur en base de données"){
    generateAccessToken(userData)
    return getHandlerForUserPost(userData, postData, "ajout du commentaires impossible");
}

//endregion

module.exports = {create, get, updateVote, addPostResponse, addCommentary, updateFunction};
