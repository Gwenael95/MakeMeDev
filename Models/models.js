const mongoose = require('mongoose');
const postSchema = require("./postModel");
const userSchema = require("./userModel");

const models = {
    UserModel: mongoose.model('users', userSchema),
    PostModel: mongoose.model('posts', postSchema),
};
module.exports = models;
