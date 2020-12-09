const { create, get } = require("../Services/postService");

exports.sendPost = async (req, res, next) => {
    const {post} = req.body;
    if (Object.keys(post).length === 0 && post.constructor === Object) {
        return res.status(404).send({error: "Requete vide"});
    }
    const response = await create(post)
    return res.status(response.code).send(response.body)
};

exports.getPost = async (req, res, next)  => {
    const post = req.query;
    if (Object.keys(post).length === 0 && post.constructor === Object) {
        return res.status(404).send({error: "Requete vide"});
    }
    const response = await get(post)
    return res.status(response.code).send(response.body)
};




