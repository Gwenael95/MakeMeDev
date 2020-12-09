const {getHandler, addHandler} = require("./responseHandler")
const {signUp, signIn} = require("../DB/userRepository");

async function addUser(user) {
    const result = await signUp(user);
    /*if (result["error"]) {
        let error = {error: {}}
        Object.values(result["error"]).map((test, index) => {
            error.error = {...error.error, [test.path]: test.kind}
        });
        return {code: 404, body: error}
    } else if (result["success"]) {
        return {code: 200, body: result}
    } else {
        return {code: 404, body: {error: "erreur en base de donnée"}}
    }*/
    return addHandler(result);
}


async function getUser(user) {
    const userData = await signIn(user);
    return getHandler(userData, "ce compte n'existe pas")
}

module.exports = {addUser, getUser};
