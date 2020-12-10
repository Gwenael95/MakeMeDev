const { create, get } = require("../Services/postService");

exports.sendPost = async (req, res, next) => {
    const {post} = req;
    if (Object.keys(post).length === 0 && post.constructor === Object) {
        return res.status(404).send({error: "Requete vide"});
    }
    const response = await create(post)
    return res.status(response.code).send(response.body)
};

exports.getPost = async (req, res, next)  => {
    const post = {
        name: req.query.name ? req.query.name : "",
        tag: req.query.tag ? JSON.parse(req.query.tag) : [],
        params: req.query["params"] ? JSON.parse(req.query["params"]) : [],
        return: req.query["return"] ? JSON.parse(req.query["return"]) : {}
    }
    if (Object.keys(post).length === 0 && post.constructor === Object) {
        return res.status(404).send({error: "Requete vide"});
    }
    const response = await get(post)
    return res.status(response.code).send(response.body)
};




