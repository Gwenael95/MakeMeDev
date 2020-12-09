const {signUp} = require("../DB/userRepository");

async function addUser(user) {
    const isAdded = await signUp(user);
    if (isAdded["error"]) {
        let error = {error: {}}
        Object.values(isAdded["error"]).map((test, index) => {
            error.error = {...error.error, [test.path]: test.kind}
        });
        return {code: 404, body: error}
    } else if (isAdded["success"]) {
        return {code: 200, body: isAdded}
    } else {
        return {code: 404, body: {error: "erreur en base de donnée"}}
    }
}

module.exports = {addUser};
