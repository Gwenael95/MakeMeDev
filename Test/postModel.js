exports.post = {
    "post": {"author" : {
            "creationDate" : "2020-10-10",
            "pseudo" : "test",
            "avatar" : "test"
        },
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
                        "date" : "2020-10-12",
                        "pseudo" : "test",
                        "commentary" : "i really needed this, thx"
                    }
                ]
            },
            {
                "author" : {
                    "creationDate" : "2020-10-10",
                    "pseudo" : "gwen",
                    "avatar" : "gwen"
                },
                "description" : "simplify your function",
                "like" : 4,
                "dislike" : 0,
                "totalLike" : 4,
                "function" : "multiply2x(num){return num+num}",
                "commentary" : [
                    {
                        "date" : "2020-10-12",
                        "pseudo" : "Jo",
                        "commentary" : "i really needed this, thx"
                    }
                ]
            },
            {
                "author" : {
                    "creationDate" : "2020-10-10",
                    "pseudo" : "anto",
                    "avatar" : "anto"
                },
                "description" : "other function",
                "like" : 4,
                "dislike" : 1,
                "totalLike" : 4,
                "function" : "multiplyPow2(num){return num**2}",
                "commentary" : [
                    {
                        "date" : "2020-10-12",
                        "pseudo" : "Jo",
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
