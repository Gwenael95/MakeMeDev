require("dotenv").config();
const { MongoClient } = require("mongodb");
const passwordHash = require("password-hash");
const ObjectId = require("mongoose").Types.ObjectId;


class Connect {
    constructor() {
        this.db = this.dbConnect();
    }

    // pourrait surement etre ameliorer, pour ne pas avoir a faire un await sur chaque getDb()
    async dbConnect(dbName = "bv9h1dk3wxrjako") {
        const client = new MongoClient(
            "mongodb://ujrosah0spdjrzvsreq3:wHmS3T4pjF0gcYJIYGA7@bv9h1dk3wxrjako-mongodb.services.clever-cloud.com:27017/bv9h1dk3wxrjako"
        );
        await client.connect(); //  connexion au serveur mongo
        return client.db(dbName); // use our database
    }

    getDb() {
        return this.db;
    }

}

module.exports = Connect;
