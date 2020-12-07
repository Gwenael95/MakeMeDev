const Connect = require("./ConnectClass");

class FunctionClass {
    constructor() {
        this.db = new Connect().getDb();
    }

    getDb() {
        return this.db;
    }

    //voir si on peut se passer de cette fonction sans empecher la requête, ce qui n'est pas si sûr
    async getCollectionFunctions() {
        const db = await this.getDb();
        return db.collection("functions");
    }

    async getFunctionByName(functionName) {
        const collection = await this.getCollectionFunctions();
        const func = await collection
            .findOne({ name: functionName });
        return func;
    }

}

module.exports = FunctionClass;
