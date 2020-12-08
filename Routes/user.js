const {signIn, signUp} = require("../Controllers/usersController");
const {url} = require("./const");

module.exports = (app) => {
    app.get(url + "users", signIn);
    app.post(url + "users", signUp);
};
