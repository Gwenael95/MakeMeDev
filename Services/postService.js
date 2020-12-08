const db = require("../db/mongo");
const {isUndefinedOrNull, areAllUndefinedOrNull} = require("../functions");

exports.create = async (req, res) => {
    const {post} = req.body;
    console.log(req.body);
    if (
        post == null ||
        post == undefined
    ) {
        return res.status(404).send({ error: "Champs manquant" });
    }

    const newPost = {
        post_name: post.name,
    };
    const isAdded = await db.posts.addPost(newPost);
    if (isAdded){
        return res.status(200).send({ success : "post ajouté avec succés" });
    }
    else {
        return res.status(404).send({ error: "erreur en base de donnéz" });
    }
};

exports.get = async (req, res) => {
    const { postId, postName, postAuthor } = req.query;
    if (!areAllUndefinedOrNull([postId, postName, postAuthor])) {
        return res.status(404).send({ error: "aucun champ n'a été saisi" });
    }
    try {
        let post
        if (!isUndefinedOrNull(postId)) {
            post = await db.posts.getPostById(postId);
        }
        else if (!isUndefinedOrNull(postName)) {
            post = await db.posts.getPostByName(postName);
        }
        else {
            post = await db.posts.getPostByAuthor(postAuthor);
        }

        if (!isUndefinedOrNull(post)){
            return res.status(200).send({ success: "post trouvé", post: post });
        }
        else{
            return res.status(404).send({ error: "aucun post ne semble correspondre au critère de recherche" });
        }

    } catch (e) {
        console.log(e);
        return res.status(500).send({ error: "error serveur" });
    }
};
