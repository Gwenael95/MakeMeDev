const {getHandler, updateDbHandler} = require("../Tools/Services/responseHandler");
const {signUp, signIn, updateUserById} = require("../DB/userRepository");
const {generateAccessToken} = require("../Tools/token")
const {setUpdateValue} = require('../Tools/DB/requestOperator')

//region exported functions
/** @function
 * @name getUser
 * Get users depending on field we want to found
 * @param {object} user - user's data needed to signIn
 * @returns {Promise<{code: number, body: {error: string}}|{code: number, body: {error: *}}|{code: number, body: *}>}
 */
async function getUser(user) {
    const userData = await signIn(user);
    return closeUserAction(userData,"aucun compte ne correspond à cette recherche" ,false)
}

/** @function
 * @name addUser
 * Create a new user, that will be add in database
 * @param {object} user - user to add, should be really similar to UserModel {@link '../Models/userModel'}.
 * @returns {Promise<{code: number, body: {error: string}}|{code: number, body: {error: *}}|{code: number, body: *}>}
 */
async function addUser(user) {
    const result = await signUp(user);
    return closeUserAction(result )
}

async function updateUser(user) {
    const userData = await updateUserById(user, setUpdateValue(user, ["pseudo", "mail", "avatar"]));
    return closeUserAction(userData, "ce compte n'existe pas, impossible de mettre à jour")
}
//endregion

//region not exported function
function closeUserAction(userData,  msg="erreur en base de données", isSetDb=true){
    generateAccessToken(userData);
    return ( isSetDb ? updateDbHandler(userData , msg, 500) : getHandler(userData , msg, 404)  )
}
//endregion

module.exports = {addUser, getUser, updateUser};
