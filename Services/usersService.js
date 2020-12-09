const {getHandler, addHandler} = require("./responseHandler")
const {signUp, signIn} = require("../DB/userRepository");

async function addUser(user) {
    const result = await signUp(user);
    return addHandler(result);
}

async function getUser(user) {
    const userData = await signIn(user);
    return getHandler(userData, "ce compte n'existe pas")
}

module.exports = {addUser, getUser};
