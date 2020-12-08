const mongoose = require('mongoose');
const {postSchema} = require("./postModel");

exports.userSchema = new mongoose.Schema({
    userName: {type: String, required: true},
    mail: {type: String, required: true},
    pseudo: {type: String, required: true},
    password: {type: String, required: true},
    avatar: {type: String, required: true},
    creationDate: {type: String, required: true},
    activities: {
        like: [{type: mongoose.Types.ObjectId}],
        dislike: [{type: mongoose.Types.ObjectId}],
        commentary: [
            {
                post_id: {type: mongoose.Types.ObjectId},
                commentary: {type: String},
                creationDate: {type: String}
            }
        ],
    },
    post: [{type: postSchema}],
    bookMark: [{type: postSchema}]
});
