const {getHandler} = require("../Tools/Services/responseHandler");
const {signUp, signIn, updateUserById} = require("../DB/userRepository");
const {generateAccessToken} = require("../Tools/token")
const {setUpdateValue} = require('../Tools/DB/requestOperator')

/** @function
 * @name addUser
 * Create a new user, that will be add in database
 * @param {object} user - user to add, should be really similar to UserModel {@link '../Models/userModel'}.
 * @returns {Promise<{code: number, body: {error: string}}|{code: number, body: {error: *}}|{code: number, body: *}>}
 */
async function addUser(user) {
    const result = await signUp(user);
    generateAccessToken(result)
    return getHandler(result);
}

/** @function
 * @name getUser
 * Get users depending on field we want to found
 * @param {object} user - user's data needed to signIn
 * @returns {Promise<{code: number, body: {error: string}}|{code: number, body: {error: *}}|{code: number, body: *}>}
 */
async function getUser(user) {
    const userData = await signIn(user);
    generateAccessToken(userData)
    return getHandler(userData , "ce compte n'existe pas")
}

async function updateUser(user) {
    const userData = await updateUserById(user, setUpdateValue(user, ["pseudo", "mail", "avatar"]) );
    generateAccessToken(userData);
    return getHandler(userData , "ce compte n'existe pas")
}




module.exports = {addUser, getUser, updateUser};
