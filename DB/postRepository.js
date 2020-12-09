const uniqueValidator = require('mongoose-unique-validator')
const {postSchema} = require("../Models/postModel");
const {PostModel} = require("../Models/models");

async function addPost(data) {
    postSchema.plugin(uniqueValidator)
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
