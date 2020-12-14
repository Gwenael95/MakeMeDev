const supertest = require('supertest');
const express = require('express');
const {url} = require("../Routes/const");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Cors
app.use(cors({ origin: true, credentials: true }));

const router = require("../router");
const {post, responsePost, commentaryPost} = require("./postModel");
router(app);

const request = supertest(app);

describe('Post', () => {

    let newUser;
    let newPost;

    beforeEach(async () => {
        newUser = await request.post(url + "users").send({
            user: {
                pseudo: 'userName',
                mail: 'useremail@email.com',
                password: '123123',
            }
        })
        newPost = await request.post(url + "post")
            .set('Authorization', 'Bearer ' + newUser.body.token)
            .send(post)
    })

    it('should be able to create a post', async () => {
        const response = newPost;
        expect(response.status).toBe(200);
        expect(Object.values(response.body).length).toEqual(1)
    });

    it('should be able to search a post', async () => {
        const response = await request.get(url + 'post?search=[test](int){int, ?} "function to multiply" #test#')
        expect(response.status).toBe(200);
        expect(response.body.success[0].name).toBe("test")
    });

    it('should be able to like a post if NEVER vote', async () => {
        const response = await request.post(url + 'post-vote')
            .set('Authorization', 'Bearer ' + newUser.body.token)
            .send({vote:1, idPost:newPost.body.success.post.post[0]._id})
        const postCheck = await request.get(url + 'post?search=[]')
        expect(response.status).toBe(200);
        expect(postCheck.body.success[0].post[2].like).toBe(3)
        expect(response.body.success.user.activities.like).toContain(newPost.body.success.post.post[0]._id)
    });

    it('should be able to dislike a post if NEVER vote', async () => {
        const response = await request.post(url + 'post-vote')
            .set('Authorization', 'Bearer ' + newUser.body.token)
            .send({vote: -1, idPost:newPost.body.success.post.post[0]._id})
        const postCheck = await request.get(url + 'post?search=[]')
        expect(response.status).toBe(200);
        expect(postCheck.body.success[0].post[2].dislike).toBe(3)
        expect(response.body.success.user.activities.dislike).toContain(newPost.body.success.post.post[0]._id)
    });


    it('should be able to update a vote into post if ALREADY vote same vote', async () => {
        const response1 = await request.post(url + 'post-vote')
            .set('Authorization', 'Bearer ' + newUser.body.token)
            .send({vote:1, idPost:newPost.body.success.post.post[0]._id})
        const postCheck1 = await request.get(url + 'post?search=[]')

        const response2 = await request.post(url + 'post-vote')
            .set('Authorization', 'Bearer ' + response1.body.success.token)
            .send({vote:1, idPost:newPost.body.success.post.post[0]._id})
        const postCheck2 = await request.get(url + 'post?search=[]')

        expect(response1.status).toBe(200);
        expect(response2.status).toBe(404);
        expect(postCheck1.body.success[0].post[2].like).toBe(3)
        expect(postCheck2.body.success[0].post[2].like).toBe(3)
        expect(response1.body.success.user.activities.like).toContain(newPost.body.success.post.post[0]._id)
        expect(response2.body.error).toBe("update vote failed")
    });


    it('should be able to dislike a post', async () => {
        const response1 = await request.post(url + 'post-vote')
            .set('Authorization', 'Bearer ' + newUser.body.token)
            .send({vote:1, idPost:newPost.body.success.post.post[0]._id})
        const postCheck1 = await request.get(url + 'post?search=[]')
        const response2 = await request.post(url + 'post-vote')
            .set('Authorization', 'Bearer ' + response1.body.success.token)
            .send({vote:-1, idPost:newPost.body.success.post.post[0]._id})
        const postCheck2 = await request.get(url + 'post?search=[]')

        expect(response1.status).toBe(200);
        expect(response2.status).toBe(200);
        expect(postCheck1.body.success[0].post[2].like).toBe(3)
        expect(postCheck1.body.success[0].post[2].dislike).toBe(2)
        expect(postCheck2.body.success[0].post[2].like).toBe(2)
        expect(postCheck2.body.success[0].post[2].dislike).toBe(3)
        expect(response1.body.success.user.activities.like).toContain(newPost.body.success.post.post[0]._id)
        expect(response1.body.success.user.activities.dislike.length).toBe(0)
        expect(response2.body.success.user.activities.dislike).toContain(newPost.body.success.post.post[0]._id)
        expect(response2.body.success.user.activities.like.length).toBe(0)
    });


    it('should be able to send response to a post', async () => {
        const response = await request.post(url + 'post-add-response')
            .set('Authorization', 'Bearer ' + newUser.body.token)
            .send({responsePost: responsePost, idPost:newPost.body.success.post._id })
        const postCheck = await request.get(url + 'post?search=[]')
        console.log(response.body.success.post.post)
        expect(postCheck.body.success[0].post[3].description).toBe("better solution");
        expect(response.status).toBe(200);
        expect(response.body.success.user.activities.response).toContain(postCheck.body.success[0].post[3]._id)
    });


    it('should be able to send a commentary to a post', async () => {
        const response = await request.post(url + 'post-add-commentary')
            .set('Authorization', 'Bearer ' + newUser.body.token)
            .send({commentaryPost: commentaryPost, idPost:newPost.body.success.post.post[0]._id })
        const postCheck = await request.get(url + 'post?search=[]')
        expect(response.status).toBe(200);
        expect(postCheck.body.success[0].post[2].commentary[1].commentary).toBe("first");
        expect(response.body.success.user.activities.commentary).toContain(newPost.body.success.post.post[2]._id)
    });
});
