const mongoose = require('mongoose');
const {postSchema} = require("./postModel");

exports.userSchema = new mongoose.Schema({
    userName: {type: String, required: true, unique: true},
    mail: {type: String, required: true, unique: true},
    pseudo: {type: String, unique: true},
    password: {type: String, required: true},
    avatar: {type: String, default: "https://discord.com/channels/690896147404816434/785427941127225354/786182169679757314"},
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
