const {signUp} = require("../DB/userRepository");

exports.signUp = async (req, res, next) => {
    const {user} = req.body;
    console.log(user)
    if (
        user == null ||
        user == undefined
    ) {
        return res.status(404).send({error: "Requete vide"});
    }

    const isAdded = await signUp(user);
    if (isAdded) {
        return res.status(200).send({success: "user ajouté avec succès"});
    } else {
        return res.status(404).send({error: "erreur en base de donnée"});
    }
};

exports.signIn = (req, res, next)  => {

};


/*
exports.getPost = async function (req, res, next)  {
    //const post = await db.posts.getPostByName("test");
    console.log(req.body)
    await get(req, res);
    return res.status(200).json("test get some post")
}
 */



