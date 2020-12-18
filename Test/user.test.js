/**
 * This test file requires {@link module:./config/launcher}, {@link module:./config/testHelper }  and
 * {@link module:./models}.
 * @requires module:./config/launcher
 * @requires module:./config/testHelper
 * @requires module:./models
 */
const {request, url} = require("./config/launcher")
const { prepareReqWithToken, expectedStatus, getBodyRes, expectExcept} = require("./config/testHelper")
const { user } = require("./models");

/**
 * user pseudo from the model
 * @type {string} userPseudo
 */
const userPseudo= user.user.pseudo

/**
 * user password from the model
 * @type {string} userPassword
 */
const userPassword= user.user.password

/**
 * user object containing pseudo and password from the model
 * to test login
 * @type {string} userPseudo
 */
const userSignIn = {
    user:{
        login: userPseudo,
        password: userPassword,
    }
}

/**
 * @todo Make lot of tests, to test each possible situation.
 * It will be sufficient for MVP.
 */
describe('User', () => {
    let newUser;
    beforeEach(async () => {
        newUser = await request.post(url + "users").send(user)
    })

    //region sign up and login user
    /**
     * @test {signUp}
     * Try to insert a new user document in mongoDB with correct user object.
     */
    it('should be able to create user', async () => {
        const response = newUser;
        expectedStatus(response, 201)
        expect(Object.values(response.body).length).toEqual(2)
    });

    /**
     * @test {signIn}
     * Try to login a user with correct object {password, pseudo}.
     */
    it('should be able to get user', async () => {
        const response = await request.post(url + "user-signin").send(userSignIn)
        expectedStatus(response, 200)
        expect(getBodyRes(response).pseudo).toBe(userPseudo)
    });

    /**
     * @test {signIn}
     * Try to login a user with bad object {password, pseudo}.
     */
    it('should not be able to get user', async () => {
        const response = await request.post(url + "user-signin").send({
            user:{
                login: userPseudo,
                password: "testpassword",
            }
        })
        expectedStatus(response, 404)
    });
    //endregion


    //region update user
    /**
     * @test {updateUser}
     * Try to update a user with new pseudo, mail and avatar object
     * thanks to its id.
     */
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
        expect(getBodyRes(response).pseudo).toBe(userData.user.pseudo)
        expect(getBodyRes(response).mail).toBe(userData.user.mail)
        expect(getBodyRes(response).avatar).toBe(userData.user.avatar)
        expectExcept(  Object.keys(getBodyRes(response)), Object.keys(userData.user), ["id"] )

    });

    /**
     * @test {updateUser}
     * Try to update a user with new pseudo, mail and avatar object
     * thanks to a bad user id.
     */
    it('should be able to update user because use id from token', async () => {
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
        expectedStatus(response, 201)
        expect(getBodyRes(response).pseudo).toBe(userData.user.pseudo)
        expect(getBodyRes(response).mail).toBe(userData.user.mail)
        expect(getBodyRes(response).avatar).toBe(userData.user.avatar)
        expectExcept(  Object.keys(getBodyRes(response)), Object.keys(userData.user), ["id"] )

    });


    /**
     * @test {updateUser}
     * Try to update a user with new mail and avatar object
     */
    it('should not be able to update user without crash', async () => {
        const user = await request.post(url + "user-signin").send(userSignIn)
        const userData = {
            user: {
                mail: 'test@test.com',
                avatar: 'test'
            }
        }
        const response = await prepareReqWithToken(user,url + "update-users" )
            .send(userData);
        expectedStatus(response, 201)
        expect(getBodyRes(response).pseudo).toBe(userPseudo)
        expect(getBodyRes(response).mail).toBe(userData.user.mail)
        expect(getBodyRes(response).avatar).toBe(userData.user.avatar)
        expectExcept(  Object.keys(getBodyRes(response)), Object.keys(userData.user), ["id"] )

    });
    //endregion

});
