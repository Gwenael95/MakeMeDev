const {addUser, getUser} = require("../Services/usersService");

exports.signUp = async (req, res, next) => {
    const {user} = req.body;
    if (Object.keys(user).length === 0 && user.constructor === Object) {
        return res.status(404).send({error: "Requete vide"});
    }
    const response = await addUser(user)
    return res.status(response.code).send(response.body)
};

exports.signIn = async (req, res, next)  => {
    const user = req.query;
    if (Object.keys(user).length === 0 && user.constructor === Object) {
        return res.status(404).send({error: "Requete vide"});
    }
    const response = await getUser(user)
    return res.status(response.code).send(response.body)
};





