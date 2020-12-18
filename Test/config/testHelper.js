/**
 * @namespace Test_helper
 */
/**
 * This test file requires {@link module:./config/launcher}.
 * @requires module:./config/launcher
 */
const { request, url} = require("./launcher")

//region functions adding expects
/**
 * Add Expects where response object has a key containing field defined by expectedKeys array.
 * If there should be some keys to avoid, we describe the exceptKeys, like for user's password.
 * @function
 * @memberOf Test_helper
 * @name expectExcept
 * @param {array} resKeys - an array containing keys from the response
 * @param {array} expectedKeys - an array containing expected keys (if adding username, we should find this field)
 * @param {array} [exceptKeys=[]]  - an array with exception keys, that we don't wan't to check
 */
function expectExcept(resKeys, expectedKeys, exceptKeys=[]){
    for (let key of expectedKeys){
        if (!exceptKeys.includes(key)) {
            expect(resKeys).toContain(key)
        }
    }
}

/**
 * Add an Expect status 201, and check if the response body.success contains user & post keys
 * When updating a document.
 * @function
 * @memberOf Test_helper
 * @name expectedResponseOnUserUpsert
 * @param {object} response - an object containing response's data
 */
function expectedResponseOnUserUpsert(response){
    expectedStatus(response, 201)
    expectExcept(  Object.keys(getBodyRes(response)), [ "user", "post"] )
}

/**
 * Add an Expect status defined by codeErr.
 * @function
 * @memberOf Test_helper
 * @name expectedStatus
 * @param {object} response - an object containing response's data
 * @param {int} [status=200] - expected status code
 */
function expectedStatus(response, status= 200){
    expect(response.status).toBe(status);
}

//endregion

//region other functions
//region getter of object path (defined by our postModel architecture)
/**

 * Return the body from a response, use if a day we change response body structure.
 * This way, it will be easy to set the body content.
 * @function
 * @memberOf Test_helper
 * @name getBodyRes
 * @param {object} response - response from api
 * @returns {SrvPoller.success|{post, user, token}|string|boolean|Event|null}
 */
function getBodyRes(response){
    try {
        return response.body.success
    }catch (e) {
        return null
    }
}

/**
 * Get a post from a response at a defined position thanks to index.
 * We supposed that the searched post is at index 0 from the response body, because
 * getPost request with search params return an array.
 * @function
 * @memberOf Test_helper
 * @name getPostAt
 * @param {object} res - response from api
 * @param {object} [index=2] - index of a post we want in the array of posts (answers)
 * @returns {object}
 */
function getPostAt(res, index=2){
    return getBodyRes(res)[0].post[index]
}

/**
 * Get user activities from a response.
 * @function
 * @memberOf Test_helper
 * @name getUserActivities
 * @param {object} res - response from api
 * @returns {object}
 */
function getUserActivities(res){
    return getBodyRes(res).user.activities
}
//endregion

//region DB requests
/**
 * Get a response from DB that get all post.
 * @function
 * @memberOf Test_helper
 * @name getAllPostReq
 * @returns {object}
 */
async function getAllPostReq(){
    return await request.get(url + 'post?search=')
}

/**
 * Post a request to DB to add a like or a dislike to a post. Need a token.
 * @function
 * @memberOf Test_helper
 * @name requestPostVote
 * @param {object} user - user that add a like
 * @param {object} post - post receiving the like
 * @param {object} voteValue - value of the vote; 1 to like, -1 to dislike
 * @returns {object}
 */
async function requestPostVote(user, post, voteValue ){
    return await prepareReqWithToken(user, url + 'post-vote')
        .send({vote:voteValue, idPost:getBodyRes(post).post.post[0]._id})
}
//endregion


/**
 * Prepare a request on a defined url that need a token authorization.
 * @function
 * @memberOf Test_helper
 * @name prepareReqWithToken
 * @param {object} user - user's data from a response
 * @param {object} completeUrl - the target url
 * @returns {*}
 */
function prepareReqWithToken(user, completeUrl){
    return request.post(completeUrl)
        .set('Authorization', 'Bearer ' + user.body.token)
}
//endregion

module.exports =
    {expectExcept, expectedResponseOnUserUpsert, getBodyRes, expectedStatus, getPostAt, getUserActivities,
     getAllPostReq, requestPostVote ,prepareReqWithToken}
