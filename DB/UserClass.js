
/*
user model
"users":
    {
        '_id': "",
        "userName": "",
        "mail": "",
        "pseudo": "",
        "password": "",
        "avatar": "",
        "creationDate": "",
        "activties": {
            "like": [],
            "dislike": [],
            "commentary": [
                {
                    "post_id": "",
                    "commentary": "",
                    "creationDate": ""
                }
            ],
        },
        "post": [],
        "bookMark": []
    }
* */

class UserClass {

    //voir si on peut se passer de cette fonction sans empecher la requête, ce qui n'est pas si sûr

    async getUserByName(userName) {

    }

}

module.exports = UserClass;
