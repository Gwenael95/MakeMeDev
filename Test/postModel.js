exports.post = {
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
        "returns" : [{
            "name" : "result",
            "type" : "int",
            "description" : "result value"
        },
            {
                "name" : "result",
                "type" : "array",
                "description" : "result value"
            }],
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

exports.responsePost = {
    "description": "better solution",
    "function": "multiply2x2x2x2x2(num){return num*2}"
}

exports.commentaryPost = {
    "commentary" : "first"
}
