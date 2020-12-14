const { request, url} = require("./config/launcher")
const { post, responsePost, commentaryPost, user} = require("./models");
const { expectedResponseOnUserUpsert, expectExcept, getBodyRes, expectedStatus,
        getPostAt, getUserActivities, getAllPostReq, requestPostVote} = require("./config/expectedFunctions")
const post0 = post.post.post[0]


describe('Post', () => {
    let newUser;
    let newPost;

    beforeEach(async () => {
        newUser = await request.post(url + "users").send(user)
        newPost = await request.post(url + "post")
            .set('Authorization', 'Bearer ' + newUser.body.token)
            .send(post)
    })

    it('should be able to create a post', async () => {
        const response = newPost;
        expect(Object.values(response.body).length).toEqual(2) //token & success
        expectedResponseOnUserUpsert(response)
        expectExcept(Object.keys(getBodyRes(response).user), Object.keys(user.user), ["password"])
        expectExcept(Object.keys(getBodyRes(response).post), Object.keys(post.post), [])
    });

    it('should be able to search a post', async () => {
        const response = await request.get(url + 'post?search=[test](int){int, ?} "function to multiply" #test#')
        expect(typeof getBodyRes(response)).toBe("object")
        expect(getBodyRes(response)[0].name).toBe("test")
        expectedStatus(response)
    });

    //region vote (like or dislike)
    it('should be able to like a post if NEVER vote', async () => {
        const response = await requestPostVote( newUser, newPost, 1)
        const postCheck = await getAllPostReq()
        expectedStatus(response)

        expect(getPostAt(postCheck).like).toBe(post0.like+1)
        expect(getUserActivities(response).like).toContain(getBodyRes(newPost).post.post[0]._id)
    });

    it('should be able to dislike a post if NEVER vote', async () => {
        const response = await requestPostVote( newUser, newPost, -1)
        const postCheck = await getAllPostReq()
        expectedStatus(response)
        expect(getPostAt(postCheck).dislike).toBe(post0.dislike+1)
        expect(getUserActivities(response).dislike).toContain(getBodyRes(newPost).post.post[0]._id)
    });


    it('should be able to update a vote into post if ALREADY vote same vote', async () => {
        const response1 = await requestPostVote( newUser, newPost, 1)
        const postCheck1 = await getAllPostReq()
        const response2 = await requestPostVote( response1, newPost, 1)
        const postCheck2 = await getAllPostReq()

        expect(response1.status).toBe(200);
        expect(response2.status).toBe(404);
        expect(getPostAt(postCheck1).like).toBe(post0.like+1)
        expect(getPostAt(postCheck2).like).toBe(post0.like+1)
        expect(getUserActivities(response1).like).toContain(getBodyRes(newPost).post.post[0]._id)
        expect(response2.body.error).toBe("update vote failed")
    });



    it('should be able to dislike a post', async () => {
        const response1 = await requestPostVote( newUser, newPost, 1)
        const postCheck1 = await getAllPostReq()
        const response2 = await requestPostVote( response1, newPost, -1)
        const postCheck2 = await getAllPostReq()


        expect(response1.status).toBe(200);
        expect(response2.status).toBe(200);
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


    it('should be able to send response to a post', async () => {
        const response = await request.post(url + 'post-add-response')
            .set('Authorization', 'Bearer ' + newUser.body.token)
            .send({responsePost: responsePost, idPost:getBodyRes(newPost).post._id })
        const postCheck = await getAllPostReq()
        expect(getPostAt(postCheck, 3).description).toBe("better solution");
        expect(response.status).toBe(200);
        expect(getUserActivities(response).response).toContain(getPostAt(postCheck, 3)._id)
    });


    it('should be able to send a commentary to a post', async () => {
        const response = await request.post(url + 'post-add-commentary')
            .set('Authorization', 'Bearer ' + newUser.body.token)
            .send({commentaryPost: commentaryPost, idPost:getBodyRes(newPost).post.post[0]._id })
        const postCheck = await getAllPostReq()
        expect(response.status).toBe(200);
        expect(getPostAt(postCheck).commentary[1].commentary).toBe("first");
        expect(getUserActivities(response).commentary).toContain(getPostAt(postCheck).commentary[1]._id)
    });
});
