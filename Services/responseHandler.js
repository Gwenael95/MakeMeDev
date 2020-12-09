function getHandler(data, notFoundMsg){
    if (data["success"]===null) {
        return {code: 404, body: {error: notFoundMsg}}
    } else if (data["success"]) {
        return {code: 200, body: data}
    } else if (data["error"]) {
        return {code: 404, body: data}
    } else {
        return {code: 404, body: {error: "erreur en base de donnée"}}
    }
}

function addHandler(data){
    if (data["error"]) {
        let errors = {error: {}}
        Object.values(data["error"]).map((errorMessage, index) => {
            errors.error = {...errors.error, [errorMessage.path]: errorMessage.kind}
        });
        return {code: 404, body: errors}
    } else if (data["success"]) {
        return {code: 200, body: data}
    } else {
        return {code: 404, body: {error: "erreur en base de donnée"}}
    }
}

module.exports = {getHandler, addHandler}
