const { create, get } = require("../Services/postService");
exports.sendPost = (req, res, next) => create(req, res, next);

exports.getPost = (req, res, next)  => get(req, res);


/*
exports.getPost = async function (req, res, next)  {
    //const post = await db.posts.getPostByName("test");
    console.log(req.body)
    await get(req, res);
    return res.status(200).json("test get some post")
}
 */



