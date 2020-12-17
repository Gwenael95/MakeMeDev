/**
 * This Service file requires {@link module:../Tools/Services/responseHandler }, {@link module:../Tools/token},
 * {@link module:../Tools/DB/requestOperator} and {@link module:../DB/userRepository}
 * @requires module:../Tools/Services/responseHandler
 * @requires module:../Tools/token
 * @requires module:../Tools/DB/requestOperator
 * @requires module:../DB/userRepository
 */
const {getHandler, updateDbHandler} = require("../Tools/Services/responseHandler");
const {generateAccessToken} = require("../Tools/token")
const {setUpdateValue} = require('../Tools/Services/requestOperator')
const {signUp, signIn, updateUserById} = require("../DB/userRepository");


//region exported functions
//region get
/** @function
 * @name getUser
 * Get user's data if a user with corresponding pseudo/mail and password exist.
 * @param {object} user - user's data needed to signIn
 * @returns {Promise<{code: number, body: {error: string}}|{code: number, body: {error: *}}|{code: number, body: *}>}
 */
async function getUser(user) {
    const userData = await signIn(user);
    return closeUserAction(userData,"Any account found with this login/password" ,false)
}
//endregion

//region post
/** @function
 * @name addUser
 * Create a new user, that will be add in database
 * @param {object} user - user to add, should be really similar to UserModel {@link '../Models/userModel'}.
 * @returns {Promise<{code: number, body: {error: string}}|{code: number, body: {error: *}}|{code: number, body: *}>}
 */
async function addUser(user) {
    const result = await signUp(user);
    return closeUserAction(result)
}
//endregion

//region patch
async function updateUser(user) {
    const keysToUpdate = Object.keys(user).filter(word => ["pseudo", "mail", "avatar"].includes(word));
    const userData = await updateUserById(user, setUpdateValue(user, keysToUpdate));
    return closeUserAction(userData, "Can't update this user: any corresponding account found")
}
//endregion
//endregion

//region not exported function
function closeUserAction(userData,  msg="DB error", isSetDb=true){
    generateAccessToken(userData);
    return ( isSetDb ? updateDbHandler(userData , msg, 500) : getHandler(userData , msg, 404)  )
}
//endregion

module.exports = {addUser, getUser, updateUser};
