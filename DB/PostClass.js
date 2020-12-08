const Connect = require("./ConnectClass");

class PostClass {
    constructor() {
        this.db = new Connect().getDb();
    }

    getDb() {
        return this.db;
    }

    //voir si on peut se passer de cette fonction sans empecher la requête, ce qui n'est pas si sûr
    async getCollectionPosts() {
        const db = await this.getDb();
        return db.collection("posts");
    }

    async getPostByName(postName) {
        const collection = await this.getCollectionPosts();
        const func = await collection
            .findOne({ name: postName });
        return func;
    }

}

module.exports = PostClass;
