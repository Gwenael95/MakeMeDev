const db = require("../db/mongo");

exports.sendPost = async function (req, res, next)  {
    //const post = await db.posts.addPost(post);
    console.log(req.body)
    return res.status(200).json("test post a post")
}

exports.getPost = async function (req, res, next)  {
    //const post = await db.posts.getPostByName("test");
    console.log(req.body)
    return res.status(200).json("test get some post")
}
