const {request, url} = require("./config/launcher")
const { user } = require("./models");
const { prepareReqWithToken, expectedStatus} = require("./config/testHelper")

const userPseudo= user.user.pseudo
const userPassword= user.user.password

const userSignIn = {
    user:{
        login: userPseudo,
        password: userPassword,
    }
}
describe('User', () => {
    let newUser;
    beforeEach(async () => {
        newUser = await request.post(url + "users").send(user)
    })

    it('should be able to create user', async () => {
        const response = newUser;
        expectedStatus(response, 201)
        expect(Object.values(response.body).length).toEqual(2)
    });

    it('should be able to get user', async () => {
        const response = await request.post(url + "user-signin").send(userSignIn)
        expectedStatus(response, 200)
        expect(response.body.success.pseudo).toBe(userPseudo)
    });

    it('should not be able to get user', async () => {
        const response = await request.post(url + "user-signin").send({
            user:{
                login: userPseudo,
                password: "testpassword",
            }
        })
        expectedStatus(response, 404)
    });

    it('should be able to update user', async () => {
        const user = await request.post(url + "user-signin").send(userSignIn)
        const userData = {
            user: {
                id: user.body.success._id,
                pseudo: 'test',
                mail: 'test@test.com',
                avatar: 'test'
            }
        }
        const response = await prepareReqWithToken(user,url + "update-users" )
            .send(userData);
        expectedStatus(response, 201)
        expect(response.body.success.pseudo).toBe(userData.user.pseudo)
        expect(response.body.success.mail).toBe(userData.user.mail)
        expect(response.body.success.avatar).toBe(userData.user.avatar)
    });


    it('should not be able to update user without crash', async () => {
        const user = await request.post(url + "user-signin").send(userSignIn)
        const userData = {
            user: {
                id: "1",
                pseudo: 'test',
                mail: 'test@test.com',
                avatar: 'test'
            }
        }
        const response = await prepareReqWithToken(user,url + "update-users" )
            .send(userData);
        expectedStatus(response, 500)
    });

});
