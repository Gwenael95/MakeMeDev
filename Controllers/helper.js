function emptyRequest (req){
    if (req === undefined || Object.keys(req).length === 0 && req.constructor === Object) {
        return {code: 404, body: {error: "Requete vide"}}
    }
}

module.exports = {emptyRequest}
