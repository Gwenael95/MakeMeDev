const {getHandler, addHandler} = require("./responseHandler")
const {signUp, signIn} = require("../DB/userRepository");
const jwt = require("jsonwebtoken");

async function addUser(user) {
    const result = await signUp(user);
    generateAccessToken(result)
    return addHandler(result);
}

async function getUser(user) {
    const userData = await signIn(user);
    generateAccessToken(userData)
    return getHandler(userData , "ce compte n'existe pas")
}

function generateAccessToken(userData) {
    if (userData["success"]!==null && userData["success"]!==undefined) {
        return userData["token"] = jwt.sign(userData, process.env.TOKEN_SECRET, {expiresIn: '3600s'});
    }
}

module.exports = {addUser, getUser};
