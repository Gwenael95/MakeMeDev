/**
 * A more than complete post.
 * @type {{post: {post: [{like: number, author: {avatar: string, creationDate: string, userId: string, pseudo: string}, dislike: number, function: string, totalLike: number, description: string, commentary: [{author: {avatar: string, creationDate: string, userId: string, pseudo: string}, commentary: string}]}, {like: number, author: {avatar: string, creationDate: string, userId: string, pseudo: string}, dislike: number, function: string, totalLike: number, description: string, commentary: [{author: {avatar: string, creationDate: string, userId: string, pseudo: string}, commentary: string}]}, {like: number, author: {avatar: string, creationDate: string, userId: string, pseudo: string}, dislike: number, function: string, totalLike: number, description: string, commentary: [{author: {avatar: string, creationDate: string, userId: string, pseudo: string}, commentary: string}]}], name: string, returns: [{name: string, description: string, type: string}, {name: string, description: string, type: string}], tag: [string], params: [{defaultValue: string, name: string, description: string, type: string}]}}}
 */
exports.post = {
    "post": {
        "name": "Test",
        "tag" : ['test'],
        "params" : [
            {
                "name" : "num",
                "type" : "int",
                "description" : "num to multiply",
                "defaultValue" : "10"
            }
        ],
        "returns" : [
            {
                "name" : "result",
                "type" : "int",
                "description" : "result value"
                },
                {
                    "name" : "result",
                    "type" : "array",
                    "description" : "result value"
                }
            ],
        "post" : [
            {
                "author" : {
                    "userId": "5fd688dec05dfb4a8eb64d1f",
                    "creationDate" : "2020-10-10",
                    "pseudo" : "test",
                    "avatar" : "test"
                },
                "description" : "a function to multiply by 2 a num and returning the result",
                "like" : 2,
                "dislike" : 2,
                "totalLike" : 0,
                "function" : "multiply2x(num){return num*2}",
                "commentary" : [
                    {
                        "author" : {
                            "userId": "5fd688dec05dfb4a8eb64d1f",
                            "creationDate" : "2020-10-10",
                            "pseudo" : "test",
                            "avatar" : "test"
                        },
                        "commentary" : "i really needed this, thx"
                    }
                ]
            },
            {
                "author" : {
                    "userId": "5fd688dec05dfb4a8eb64d1f",
                    "creationDate" : "2020-10-10",
                    "pseudo" : "test",
                    "avatar" : "test"
                },
                "description" : "simplify your function",
                "like" : 4,
                "dislike" : 0,
                "totalLike" : 4,
                "function" : "multiply2x(num){return num+num}",
                "commentary" : [
                    {
                        "author" : {
                            "userId": "5fd688dec05dfb4a8eb64d1f",
                            "creationDate" : "2020-10-10",
                            "pseudo" : "test",
                            "avatar" : "test"
                        },
                        "commentary" : "i really needed this, thx"
                    }
                ]
            },
            {
                "author" : {
                    "userId": "5fd688dec05dfb4a8eb64d1f",
                    "creationDate" : "2020-10-10",
                    "pseudo" : "test",
                    "avatar" : "test"
                },
                "description" : "other function",
                "like" : 4,
                "dislike" : 1,
                "totalLike" : 4,
                "function" : "multiplyPow2(num){return num**2}",
                "commentary" : [
                    {
                        "author" : {
                            "userId": "5fd688dec05dfb4a8eb64d1f",
                            "creationDate" : "2020-10-10",
                            "pseudo" : "test",
                            "avatar" : "test"
                        },
                        "commentary" : "i really needed this, thx"
                    }
                ]
            }
        ]
    }
}

/**
 * A minimal post object that can be added in DB when creating a post
 * @type {{post: {post: [{function: string, description: string}], name: string, returns: [{name: string, description: string, type: string}, {name: string, description: string, type: string}], tag: [string], params: [{defaultValue: string, name: string, description: string, type: string}]}}}
 */
exports.minimalPost = {
    "post": {
        "name": "test",
        "tag" : ['test'],
        "params" : [
            {
                "name" : "num",
                "type" : "int",
                "description" : "num to multiply",
                "defaultValue" : "10"
            }
        ],
        "returns" : [
            {
                "name" : "result",
                "type" : "int",
                "description" : "result value"
            },
            {
                "name" : "result",
                "type" : "array",
                "description" : "result value"
            }
        ],
        "post" : [
            {
                "description" : "a function to multiply by 2 a num and returning the result",
                "function" : "multiply2x(num){return num*2}",
            }
        ]
    }
}


/**
 * A response post, that can be add to a post
 * @type {{function: string, description: string}}
 */
exports.responsePost = {
    "description": "better solution",
    "function": "multiply2x2x2x2x2(num){return num*2}"
}

/**
 * A commentary post, that can be add to a post
 * @type {{commentary: string}}
 */
exports.commentaryPost = {
    "commentary" : "first"
}

/**
 * A user that can be inserted in database when sign up
 * @type {{user: {password: string, mail: string, pseudo: string}}}
 */
exports.user = {
    user: {
        pseudo: 'userName',
        mail: 'useremail@email.com',
        password: '123123',
    }
}
