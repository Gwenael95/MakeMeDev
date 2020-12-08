const mongoose = require('mongoose');

exports.postSchema = new mongoose.Schema({
        bookMarked: {type: Number, default: 0},
        shared: {type: Number, default: 0},
        name: {type: String, required: true},
        author: {
            pseudo: {type: String, required: true},
            avatar: {type: String, required: true},
            creationDate: {type: String, required: true}
        },
        params: [
            {
                name: {type: String, required: true},
                type: {type: String, required: true},
                description: {type: String, required: true},
                defaultValue: {type: String}
            }
        ],
        return:
            {
                name: {type: String, required: true},
                type: {type: String, required: true},
                description: {type: String, required: true},
                defaultValue: {type: String}
            },
        tag: [{type: String, required: true}],
        post: [
            {
                description: {type: String, required: true},
                author: {
                    pseudo: {type: String, required: true},
                    avatar: {type: String, required: true},
                    creationDate: {type: String, required: true}
                },
                function: {type: String, required: true},
                like: {type: Number, default: 0},
                dislike: {type: Number, default: 0},
                commentary: [
                    {
                        pseudo: {type: String, required: true},
                        commentary: {type: String, required: true},
                        date: {type: String, required: true}
                    }
                ]
            }
        ]
});
