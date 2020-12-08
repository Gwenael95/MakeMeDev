const {addPost} = require("../DB/PostClass")

exports.create = async (req, res) => {
    const {post} = req.body;
    if (
        post == null ||
        post == undefined
    ) {
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

// exports.get = async (req, res) => {
//     const { postId, postName, postAuthor } = req.query;
//     if (!areAllUndefinedOrNull([postId, postName, postAuthor])) {
//         return res.status(404).send({ error: "aucun champ n'a été saisi" });
//     }
//     try {
//         let post
//         if (!isUndefinedOrNull(postId)) {
//             post = await db.posts.getPostById(postId);
//         }
//         else if (!isUndefinedOrNull(postName)) {
//             post = await db.posts.getPostByName(postName);
//         }
//         else {
//             post = await db.posts.getPostByAuthor(postAuthor);
//         }
//
//         if (!isUndefinedOrNull(post)){
//             return res.status(200).send({ success: "post trouvé", post: post });
//         }
//         else{
//             return res.status(404).send({ error: "aucun post ne semble correspondre au critère de recherche" });
//         }
//
//     } catch (e) {
//         console.log(e);
//         return res.status(500).send({ error: "error serveur" });
//     }
// };
