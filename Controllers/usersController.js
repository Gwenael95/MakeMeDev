const {addUser, getUser} = require("../Services/usersService");

exports.signUp = async (req, res, next) => {
    const {user} = req.body;
    if (
        user == null ||
        user == undefined
    ) {
        return res.status(404).send({error: "Requete vide"});
    }
    const response = await addUser(user)
    return res.status(response.code).send(response.body)
};

exports.signIn = async (req, res, next)  => {
    const user = req.query;
    if (
        user == null ||
        user == undefined
    ) {
        return res.status(404).send({error: "Requete vide"});
    }

    const response = await getUser(user)
    return res.status(response.code).send(response.body)
};





