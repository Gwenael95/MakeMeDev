const Connect = require("./ConnectClass");

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
    constructor() {
        this.db = new Connect().getDb();
    }

    #getDb() {
        return this.db;
    }

    //voir si on peut se passer de cette fonction sans empecher la requête, ce qui n'est pas si sûr
    async #getCollectionUsers() {
        const db = await this.#getDb();
        return db.collection("users");
    }

    async getUserByName(userName) {
        const collection = await this.#getCollectionUsers();
        const user = await collection
            .findOne({ userName: userName });
        return user;
    }

}

module.exports = UserClass;
