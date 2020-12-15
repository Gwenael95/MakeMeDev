const {addUser, getUser, updateUser} = require("../Services/usersService");
const {emptyRequest} = require("../Tools/Controller/controllerHelper");

/** @function
 * @name signUp
 * @param {Request} req - request received
 * @param {Response} res - response to dispatched
 * @param {Function} next - get control to the next middleware function
 * @returns {Promise<*|boolean|void>}
 */
exports.signUp = async (req, res, next) => {
    const {user} = req.body;
    const response = emptyRequest(user) ? emptyRequest(user) : await addUser(user)
    return res.status(response.code).send(response.body)
};

/** @function
 * @name updateUser
 * @param {Request} req - request received
 * @param {Response} res - response to dispatched
 * @param {Function} next - get control to the next middleware function
 * @returns {Promise<*|boolean|void>}
 */
exports.updateUser = async (req, res, next) => {
    const {user} = req.body;
    const response = emptyRequest(user) ? emptyRequest(user) : await updateUser(user)
    return res.status(response.code).send(response.body)
};

/** @function
 * @name signIn
 * @param {Request} req - request received
 * @param {Response} res - response to dispatched
 * @param {Function} next - get control to the next middleware function
 * @returns {Promise<*|boolean|void>}
 */
exports.signIn = async (req, res, next)  => {
    const {user} = req.body;
    const response = emptyRequest(user) ? emptyRequest(user) : await getUser(user)
    return res.status(response.code).send(response.body)
};






