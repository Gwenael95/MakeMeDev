const Connect = require("./ConnectClass");

/*
post model
"post": {
    "_id": "",
    "bookMarked": 0,
    "shared": 0,
    "name": "",
    "author": {
        "pseudo": "",
        "avatar": "",
        "creationDate": ""
    },
    "params": [
        {
            "name": "",
            "type": "",
            "description": "",
            "defaultValue": ""
        }
    ],
    "return":
        {
            "name": "",
            "type": "",
            "description": "",
            "defaultValue": ""
        },
    "tag": [""],
    "post": [
        {
            "id": "",
            "description": "",
            "author": {
                "pseudo": "",
                "avatar": "",
                "creationDate": ""
            },
            "function": "",
            "like": 0,
            "dislike": 0,
            "commentary": [
                {
                    "pseudo": "",
                    "commentary": "",
                    "date": ""
                }
            ]
        }
    ]
}
* */

class PostClass {
    constructor() {
        this.db = new Connect().getDb();
    }

    #getDb() {
        return this.db;
    }

    //voir si on peut se passer de cette fonction sans empecher la requête, ce qui n'est pas si sûr
    async #getCollectionPosts() {
        const db = await this.#getDb();
        return db.collection("posts");
    }

    async getPostByName(postName) {
        const collection = await this.#getCollectionPosts();
        const func = await collection
            .findOne({ name: postName });
        return func;
    }

    async getPostById(postId) {
        const collection = await this.#getCollectionPosts();
        const func = await collection
            .findOne({ _id: postId });
        return func;
    }

    async getPostByAuthor(postAuthor) {
        const collection = await this.#getCollectionPosts();
        const func = await collection
            .findOne({ author: postAuthor }); //faudra faire par authorPseudo, voir en mongo comment on faisait
        return func;
    }

    async addPost(postName) {
        const collection = await this.#getCollectionPosts();
        const post = await collection
            .insertOne({ name: postName });
        return !(post == null || !post);
    }
}

module.exports = PostClass;
