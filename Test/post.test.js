/**
 * This test file requires {@link module:./config/launcher}, {@link module:./config/testHelper }  and
 * {@link module:./models}.
 * @requires module:./config/launcher
 * @requires module:./config/testHelper
 * @requires module:./models
 */
const { request, url} = require("./config/launcher")
const { post, responsePost, commentaryPost, user} = require("./models");
const { expectedResponseOnUserUpsert, expectExcept, getBodyRes, expectedStatus,
        getPostAt, getUserActivities, getAllPostReq, requestPostVote,
        prepareReqWithToken} = require("./config/testHelper")

/**
 * post object at position 0 from post model
 * @type {object} post0
 */
const post0 = post.post.post[0]

/**
 * @todo Make lot of tests, to test each possible situation.
 * It will be sufficient for MVP.
 */
describe('Post', () => {
    let newUser;
    let newPost;

    beforeEach(async () => {
        newUser = await request.post(url + "users").send(user)
        newPost = await prepareReqWithToken(newUser, url + "post").send(post)
    })

    //region create post and search posts
    /**
     * @test {sendPost}
     * Try to insert a new post document in mongoDB with good post object
     */
    it('should be able to create a post', async () => {
        const response = newPost;
        expect(Object.values(response.body).length).toEqual(2) //token & success
        expectedResponseOnUserUpsert(response)
        expectExcept(Object.keys(getBodyRes(response).user), Object.keys(user.user), ["password"])
        expectExcept(Object.keys(getBodyRes(response).post), Object.keys(post.post))
    });

    /**
     * @test {sendPost}
     * Try to insert a new post document in mongoDB with incomplete post object
     */
    it('should not be able to create a post because bad post', async () => {
        const response = await prepareReqWithToken(newUser, url + "post").send({post:{name:"testBadPost"}});
        expectedStatus(response, 400)
    });

    /**
     * @test {getPost}
     * Try to search a post document in mongoDB with a correct request with search param
     */
    it('should be able to search a post', async () => {
        const response = await request.get(url + 'post?search=test(int){int, ?} "function to multiply" [test]')
        expect(typeof getBodyRes(response)).toBe("object")
        expect(getBodyRes(response)[0].name).toBe("test")
        expectedStatus(response)
    });

    /**
     * @test {getPost}
     * Try to search a post document in mongoDB with a correct request with postId param
     */
    it('should be able to search a post by id', async () => {
        const response = await request.get(url + 'post?postId=' + getBodyRes(newPost).post._id)
        expect(typeof getBodyRes(response)).toBe("object")
        expect(getBodyRes(response).name).toBe("test")
        expectedStatus(response)
    });

    /**
     * @test {getPost}
     * Try to search a post document in mongoDB with a correct request with postId from post array
     */
    it('should be able to search a post by id', async () => {
        const response = await request.get(url + 'post?postId=' + getBodyRes(newPost).post.post[0]._id)

        console.log(getBodyRes(response))
        expect(typeof getBodyRes(response)).toBe("object")
        expect(getBodyRes(response).name).toBe("test")
        expect(getBodyRes(response).post[2]._id).toBe(getBodyRes(newPost).post.post[0]._id)
        expectedStatus(response)
    });
    //endregion

    //region vote (like or dislike)
    /**
     * @test {sendVote}
     * Try to like a post in mongoDB with a correct request if the user
     * never have vote for the post
     */
    it('should be able to like a post if NEVER vote', async () => {
        const response = await requestPostVote( newUser, newPost, 1)
        const postCheck = await getAllPostReq()
        expectedStatus(response, 201)

        expect(getPostAt(postCheck).like).toBe(post0.like+1)
        expect(getUserActivities(response).like).toContain(getBodyRes(newPost).post.post[0]._id)
    });

    /**
     * @test {sendVote}
     * Try to dislike a post in mongoDB with a correct request if the user
     * never have vote for the post
     */
    it('should be able to dislike a post if NEVER vote', async () => {
        const response = await requestPostVote( newUser, newPost, -1)
        const postCheck = await getAllPostReq()
        expectedStatus(response, 201)
        expect(getPostAt(postCheck).dislike).toBe(post0.dislike+1)
        expect(getUserActivities(response).dislike).toContain(getBodyRes(newPost).post.post[0]._id)
    });

    /**
     * @test {sendVote}
     * Try to like a post in mongoDB with corrects requests if the user
     * already add a like for the post
     */
    it('should be able to update a vote into post if ALREADY vote same vote', async () => {
        const response1 = await requestPostVote( newUser, newPost, 1)
        const postCheck1 = await getAllPostReq()
        const response2 = await requestPostVote( response1, newPost, 1)
        const postCheck2 = await getAllPostReq()

        expectedStatus(response1, 201)
        expectedStatus(response2, 500)
        expect(getPostAt(postCheck1).like).toBe(post0.like+1)
        expect(getPostAt(postCheck2).like).toBe(post0.like+1)
        expect(getUserActivities(response1).like).toContain(getBodyRes(newPost).post.post[0]._id)
        expect(response2.body.error).toBe("Update vote failed")
    });

    /**
     * @test {sendVote}
     * Try to dislike a post in mongoDB with corrects requests if the user
     * already add a like for the post
     */
    it('should be able to dislike a post', async () => {
        const response1 = await requestPostVote( newUser, newPost, 1)
        const postCheck1 = await getAllPostReq()
        const response2 = await requestPostVote( response1, newPost, -1)
        const postCheck2 = await getAllPostReq()

        expectedStatus(response1, 201)
        expectedStatus(response2, 201)

        expect(getPostAt(postCheck1).like).toBe(post0.like+1)
        expect(getPostAt(postCheck1).dislike).toBe(post0.dislike)
        expect(getPostAt(postCheck2).like).toBe(post0.like)
        expect(getPostAt(postCheck2).dislike).toBe(post0.dislike+1)
        expect(getUserActivities(response1).like).toContain(getBodyRes(newPost).post.post[0]._id)
        expect(getUserActivities(response1).dislike.length).toBe(0)
        expect(getUserActivities(response2).dislike).toContain(getBodyRes(newPost).post.post[0]._id)
        expect(getUserActivities(response2).like.length).toBe(0)
    });
    //endregion

    //region add a post (answer) in a created post
    /**
     * @test {addResponse}
     * Try to send a response to a post in mongoDB with corrects requests
     */
    it('should be able to send response to a post', async () => {
        const response = await prepareReqWithToken(newUser, url + "post-add-response")
            .send({responsePost: responsePost, idPost:getBodyRes(newPost).post._id })
        const postCheck = await getAllPostReq()
        expectedStatus(response, 201)
        expect(getPostAt(postCheck, 3).description).toBe("better solution");
        expect(getUserActivities(response).response).toContain(getPostAt(postCheck, 3)._id)
    });
    //endregion

    //region add commentary to a post
    /**
     * @test {addCommentary}
     * Try to send a commentary to a post in mongoDB with corrects requests
     */
    it('should be able to send a commentary to a post', async () => {
        const response = await prepareReqWithToken(newUser, url + "post-add-commentary")
            .send({commentaryPost: commentaryPost, idPost:getBodyRes(newPost).post.post[0]._id })
        const postCheck = await getAllPostReq()
        expectedStatus(response, 201)

        expect(getPostAt(postCheck).commentary[1].commentary).toBe("first");
        expect(getUserActivities(response).commentary).toContain(getPostAt(postCheck)._id)
    });

    /**
     * @test {addCommentary}
     * Try to send commentaries to a post in mongoDB with corrects requests,
     * each commentary date should be different.
     */
    it('should be able to send 2 commentary with 2 different timestamp', async () => {
        const response1 = await prepareReqWithToken(newUser, url + "post-add-commentary")
            .send({commentaryPost: commentaryPost, idPost:getBodyRes(newPost).post.post[0]._id })
        const postCheck = await getAllPostReq()
        const response2 = await prepareReqWithToken(response1, url + "post-add-commentary")
            .send({commentaryPost: commentaryPost, idPost:getBodyRes(newPost).post.post[0]._id })
        const postCheck2 = await getAllPostReq()
        let comment = getPostAt(postCheck).commentary
        let comment2 = getPostAt(postCheck2).commentary

        expectedStatus(response1, 201)
        expect(getPostAt(postCheck).commentary[1].commentary).toBe("first");
        expect(getUserActivities(response1).commentary).toContain(getPostAt(postCheck)._id)
        expect(comment[comment.length-1].date< comment2[comment2.length-1].date).toBe(true)
    });
    //endregion

});
