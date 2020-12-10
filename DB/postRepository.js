const mongoose = require('mongoose');
const {postSchema} = require("../Models/postModel");
const PostModel = mongoose.model('posts', postSchema)

async function addPost(data) {
    const doc = new PostModel(data);
    return await doc.save().then(result => {
        return {success: result}
    }).catch(err => {
        return {error: err.errors}
    })
}

async function getPost(data) {
    let tagQuery
    if ( data.tag.length===0){
        tagQuery = { $exists: true, $not: {$size: 0} }
    }
    else{
        tagQuery = {$all: data.tag}
    }

    //pour params, voir comment faire car on recevra un tableau de string(1 pour chaque champs) OU un tableau d'objet
    //
    // - regexp sur l'array en bdd (antony semblait en avoir trouver un)
    // - comparé les objets en bdd et ceux envoyé {type:"", description:""}
    console.log(await PostModel.aggregate([
        {
            $match: {
                name: {
                    $regex: ""
                },
                tag: tagQuery,
            }
        },
        {
            $unwind: "$params"
        },
        {
            $match: {
                "params.description": {
                    $regex: "int"
                },
            }
        },
        {
            $project: { name:1, tag:1, 'params.description':1}
        }
    ]).exec());

    return await PostModel.aggregate([{
            $match: {
                name: {
                    $regex: ""
                },
                tag: tagQuery
            }
        }])
        .exec()
        .then(result => {
            return {success: result}
        })
        .catch(err => {
            return {error: err.errors}
        });
}

module.exports = {addPost, getPost};
