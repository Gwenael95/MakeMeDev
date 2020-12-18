/**
 * @namespace Controllers
 */
/**
 * This Controller file requires {@link module:../Services/usersService }  and
 * {@link module:../Tools/Controller/controllerHelper}.
 * @requires module:../Services/usersService
 * @requires module:../Tools/Controller/controllerHelper
 */
const {addUser, getUser, updateUser} = require("../Services/usersService");
const {emptyRequest} = require("../Tools/Controller/controllerHelper");

//region post
/**
 * Create a new account on our app, saved in mongoDb
 * @function
 * @memberOf Controllers
 * @name signUp
 * @param {Object.<Request>} req - request received
 * @param {Object.<Response>} res - response to dispatched
 * @param {Function} next - get control to the next middleware function
 * @returns {Promise<*|boolean|void>}
 */
exports.signUp = async (req, res, next) => {
    const {user} = req.body;
    const response = emptyRequest(user) ? emptyRequest(user) : await addUser(user)
    return res.status(response.code).send(response.body)
};

/**
 * Try to login a user if the mail/pseudo and password match in DB.
 * @function
 * @memberOf Controllers
 * @name signIn
 * @param {Object.<Request>} req - request received
 * @param {Object.<Response>} res - response to dispatched
 * @param {Function} next - get control to the next middleware function
 * @returns {Promise<*|boolean|void>}
 */
exports.signIn = async (req, res, next)  => {
    const {user} = req.body;
    const response = emptyRequest(user) ? emptyRequest(user) : await getUser(user)
    return res.status(response.code).send(response.body)
};
//endregion


//region patch
/**
 * Update a user depending on request data.
 * @function
 * @memberOf Controllers
 * @name updateUser
 * @param {Object.<Request>} req - request received
 * @param {Object.<Response>} res - response to dispatched
 * @param {Function} next - get control to the next middleware function
 * @returns {Promise<*|boolean|void>}
 */
exports.updateUser = async (req, res, next) => {
    const {user} = req.body;
    user.id = req.user._id
    const response = emptyRequest(user) ? emptyRequest(user) : await updateUser(user)
    return res.status(response.code).send(response.body)
};

//endregion

