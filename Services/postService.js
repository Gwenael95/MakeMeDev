const {getHandler, addHandler} = require("./responseHandler");
const {addPost, getPost} = require("../DB/postRepository")

/*exports.create = async (req, res) => {
    const {post} = req.body;
    if (post == null || post == undefined) {
        return res.status(404).send({ error: "Champs manquants" });
    }

    const isAdded = await addPost(post);
    if (isAdded){
        return res.status(200).send({ success : "post ajouté avec succès" });
    }
    else {
        return res.status(404).send({ error: "erreur en base de donnée" });
    }
};
*/
async function create(post) {
    const result = await addPost(post);
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

async function get(post) {
    const postData = await getPost(post);
    return getHandler(postData, "ce post n'existe pas");
}

module.exports = {create, get};
