const { create, get } = require("../Services/postService");
const {emptyRequest} = require("./helper");

exports.sendPost = async (req, res, next) => {
    const {post} = req;
    const response = emptyRequest(post) ? emptyRequest(post) : await create(post)
    return res.status(response.code).send(response.body)
};


exports.getPost = async (req, res, next)  => {
    const {search} =  req.query

    const response = emptyRequest(search) ? emptyRequest(search) : await get(search)
    return res.status(response.code).send(response.body)
};





