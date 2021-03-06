const mongoose = require('mongoose');

/**
 * Our User Model used for mongoDB {@link '../DB/userRepository.js'}.
 * @type {module:mongoose.Schema<any>}
 */
exports.userSchema = new mongoose.Schema({
    mail: {type: String, required: true, unique: true},
    pseudo: {type: String, unique: true, required:true},
    password: {type: String, required: true},
    avatar: {type: String, default: "https://discord.com/channels/690896147404816434/785427941127225354/786182169679757314"},
    creationDate: {type: String, default: new Date().getTime() / 1000},
    activities: {
        like: [{type: mongoose.Types.ObjectId}],
        dislike: [{type: mongoose.Types.ObjectId}],
        response: [{type: mongoose.Types.ObjectId}],
        commentary: [{type: mongoose.Types.ObjectId}],
    },
    post: [{type: mongoose.Types.ObjectId}],
    bookMark: [{type: mongoose.Types.ObjectId}]
});
