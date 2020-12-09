const mongoose = require('mongoose');
const {postSchema} = require("../Models/postModel");
const PostModel = mongoose.model('posts', postSchema)

async function addPost(data) {
    const doc = new PostModel(data);
    return await doc.save().then(result => {return {success: result}}).catch(err => {return {error: err.errors}})
}

async function getPost(data) {
    return await PostModel.findOne({name: data.name })
        .exec()
        .then(result => {return {success: result}})
        .catch(err => {return {error: err.errors}});
}

module.exports = {addPost, getPost};
