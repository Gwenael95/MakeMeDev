const {request, url} = require("./config/launcher")

describe('User', () => {

    let newUser;

    beforeEach(async () => {
        newUser = await request.post(url + "users").send({
            user: {
                pseudo: 'userName',
                mail: 'useremail@email.com',
                password: '123123',
            }
        })
    })

    it('should be able to create user', async () => {
        const response = newUser;
        expect(response.status).toBe(200);
        expect(Object.values(response.body).length).toEqual(2)
    });

    it('should be able to get user', async () => {
        const response = await request.get(url + "users?login=userName&password=123123")
        expect(response.status).toBe(200);
        expect(response.body.success.pseudo).toBe('userName')
    });

    it('should be able to update user', async () => {
        const user = await request.get(url + "users?login=userName&password=123123")
        const response = await request.post(url + "update-users")
            .set('Authorization', 'Bearer ' + user.body.token)
            .send({
            user: {
                id: user.body.success._id,
                pseudo: 'test',
                mail: 'test@test.com',
                avatar: 'test'
            }
        });
        expect(response.status).toBe(200)
        expect(response.body.success.pseudo).toBe('test')
        expect(response.body.success.mail).toBe('test@test.com')
        expect(response.body.success.avatar).toBe('test')
    });

});
