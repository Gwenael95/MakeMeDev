const db = require("../db/mongo");

exports.sendPost = async function (req, res, next)  {
    //const post = await db.posts.getPostByName("test");

    return res(200).json("test")
}
