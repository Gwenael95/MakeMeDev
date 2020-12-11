const { create, get } = require("../Services/postService");
const {emptyRequest} = require("./helper");

exports.sendPost = async (req, res, next) => {
    const {post} = req.body;
    console.log(post)
    const response = emptyRequest(post) ? emptyRequest(post) : await create(post)
    return res.status(response.code).send(response.body)
};

exports.getPost = async (req, res, next)  => {
    const post = {
        name: req.query.name ? req.query.name : "",
        tag: req.query.tag ? JSON.parse(req.query.tag) : [],
        params: req.query["params"] ? JSON.parse(req.query["params"]) : [],
        return: req.query["return"] ? JSON.parse(req.query["return"]) : {}
    }
    const response = emptyRequest(post) ? emptyRequest(post) : await get(post)
    return res.status(response.code).send(response.body)
};




