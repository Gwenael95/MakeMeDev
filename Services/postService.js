const {getHandler} = require("./responseHandler");
const {addPost, getPost} = require("../DB/postRepository")


async function create(post) {
    const result = await addPost(post);
    return getHandler(result);
}

async function get(post) {
    const postData = await getPost(post);
    return getHandler(postData, "ce post n'existe pas");
}

module.exports = {create, get};
