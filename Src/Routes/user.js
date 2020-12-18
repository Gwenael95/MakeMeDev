/**
 * This file requires {@link module:../Controllers/usersController}, {@link module:../Middlewares/middleware }  and
 * {@link module:./const}.
 * @requires module:../Controllers/usersController
 * @requires module:../Middlewares/middleware
 * @requires module:./const
 */
const {signIn, signUp, updateUser} = require("../Controllers/usersController");
const {authenticateToken} = require("../Middlewares/middleware")
const {url} = require("./const");

module.exports = (app) => {
    app.post(url + "user-signin", signIn);
    app.post(url + "users", signUp);
    app.post(url + "update-users", authenticateToken, updateUser);
};
