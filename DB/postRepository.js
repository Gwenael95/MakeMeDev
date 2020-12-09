const mongoose = require('mongoose');
const {postSchema} = require("../Models/postModel");


async function getPostByName(postName) {

}

async function getPostById(postId) {

}

async function getPostByAuthor(postAuthor) {

}

async function addPost(data) {
    const PostModel = mongoose.model('posts', postSchema);
    const doc = new PostModel(data);
    await doc.save(
        (err) => {
        if (err) {
            console.log(err)
        }
    });
    return !doc.getChanges().$set;
    return {code: 400, bodyReturn: {success: "user ajouté avec succès"}}
}


module.exports = {addPost};
