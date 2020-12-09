const {addUser, getUser} = require("../Services/usersService");

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

function emptyRequest (req){
    if (req === undefined || Object.keys(req).length === 0 && req.constructor === Object) {
        return {code: 404, body: {error: "Requete vide"}}
    }
}





