const {getHandler} = require("../Tools/Services/responseHandler");
const {signUp, signIn, updateUserById} = require("../DB/userRepository");
const {generateAccessToken} = require("../Tools/token")

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


/** @function
 * @name setUpdateValue
 * Define all keys to set
 * @param {object} data - data that will be set
 * @param {array} keysArray - all keys to update
 * @returns {{$set: {}}}
 */
function setUpdateValue(data, keysArray) {
    let updateValue = {}
    /*for (let key of Object.keys(data)){
        updateValue[key] = data[key]
    }*/
    for (let key of keysArray){
        updateValue[key] = data[key]
    }
    return {$set: updateValue}
}


module.exports = {addUser, getUser, updateUser};
