function getHandler(data, notFoundMsg){
    if (data["success"]===null) {
        return {code: 404, body: {error: notFoundMsg}}
    } else if (data["success"]) {
        return {code: 200, body: data}
    } else {
        return {code: 404, body: {error: "erreur en base de donnée"}}
    }
}

function addHandler(data){
    if (data["error"]) {
        let error = {error: {}}
        Object.values(data["error"]).map((test, index) => {
            error.error = {...error.error, [test.path]: test.kind}
        });
        return {code: 404, body: error}
    } else if (data["success"]) {
        return {code: 200, body: data}
    } else {
        return {code: 404, body: {error: "erreur en base de donnée"}}
    }
}

module.exports = {getHandler, addHandler}
