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
const {post} = require("./postModel");
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
        console.log(JSON.stringify(response.body))
        expect(response.status).toBe(200);
        expect(Object.values(response.body).length).toEqual(1)
    });

    it('should be able to search a post', async () => {
        const response = await request.get(url + 'post?search=[test](int){int, ?} "function to multiply" #test#')
        expect(response.status).toBe(200);
        expect(response.body.success[0].name).toBe("test")
    });

});
