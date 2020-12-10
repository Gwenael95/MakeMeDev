const {addUser, getUser} = require("../Services/usersService");
const {emptyRequest} = require("./helper");
exports.signUp = async (req, res, next) => {
    const {user} = req.body;
    const response = emptyRequest(user) ? emptyRequest(user) : await addUser(user)
    return res.status(response.code).send(response.body)
};

exports.signIn = async (req, res, next)  => {
    const user = req.query;
    const response = emptyRequest(user) ? emptyRequest(user) : await getUser(user)
    return res.status(response.code).send(response.body)
};






