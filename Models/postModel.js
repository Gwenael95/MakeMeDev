const mongoose = require('mongoose');

/**
 * Our Post Model used for mongoDB {@link '../DB/postRepository.js'}.
 * @type {module:mongoose.Schema<any>}
 */
exports.postSchema = new mongoose.Schema({
        bookMarked: {type: Number, default: 0},
        shared: {type: Number, default: 0},
        name: {type: String, required: true},
        author: {
            userId: {type: mongoose.Types.ObjectId, required: true},
            pseudo: {type: String, required: true},
            avatar: {type: String, required: true},
            creationDate: {type: String, default:  new Date().getTime() / 1000}
        },
        params: [
            {
                name: {type: String, required: true},
                type: {type: String, required: true},
                description: {type: String, required: true},
                defaultValue: {type: String}
            }
        ],
        paramsTypes:{},
        returnsTypes:{},
        returns:[
            {
                name: {type: String},
                type: {type: String},
                description: {type: String},
                defaultValue: {type: String}
            }],
        tag: [{type: String, required: true}],
        post: [
            {
                author: {
                    userId: {type: mongoose.Types.ObjectId, required: true},
                    pseudo: {type: String, required: true},
                    avatar: {type: String, required: true},
                    creationDate: {type: String, default:  new Date().getTime() / 1000}
                },
                function: {type: String, required: true},
                description: {type: String, required: true},
                like: {type: Number, default: 0},
                dislike: {type: Number, default: 0},
                totalLike: {type: Number, default: 0},
                commentary: [
                    {
                        author: {
                            userId: {type: mongoose.Types.ObjectId, required: true},
                            pseudo: {type: String, required: true},
                            avatar: {type: String, required: true}
                        },
                        commentary: {type: String, required: true},
                        date: {type: String, default:  new Date().getTime() / 1000}
                    }
                ]
            }
        ]
});
