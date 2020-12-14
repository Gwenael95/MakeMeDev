const { request, url} = require("./launcher")


function expectExcept(expectedKeys, keys, exceptKeys){
    for (let key of keys){
        //console.log(key)
        if (!exceptKeys.includes(key)) {
            //console.log(exceptKeys)
            expect(expectedKeys).toContain(key)
        }
    }
}

function expectedResponseOnUserUpsert(response){
    expectedStatus(response)
    //expect().toStrictEqual(["user", "post"])
    expectExcept(  Object.keys(getBodyRes(response)), [ "user", "post"] , [])
}

function expectedStatus(response){
    expect(response.status).toBe(200);
}

/**
 * Return the body from a response, use if a day we change response body structure.
 * This way, it will be easy to set the body content
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

function getPostAt(res, index=2){
    return getBodyRes(res)[0].post[index]
}

function getUserActivities(res){
    return getBodyRes(res).user.activities
}

async function getAllPostReq(){
    return await request.get(url + 'post?search=[]')
}

async function requestPostVote(user, post, voteValue ){
    //console.log(user.body)
    return await request.post(url + 'post-vote')
        .set('Authorization', 'Bearer ' + ( user.body.token /*getBodyRes(user).token */))
        .send({vote:voteValue, idPost:getBodyRes(post).post.post[0]._id})
}

module.exports =
    {expectExcept, expectedResponseOnUserUpsert, getBodyRes, expectedStatus, getPostAt, getUserActivities,
     getAllPostReq, requestPostVote }
