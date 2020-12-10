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
    return await PostModel
        .aggregate(getPipeline(data))
        .exec()
        .then(result => {
            return {success: result}
        })
        .catch(err => {
            return {error: err.errors}
        });
}

function getPipeline(data) {
    return getMainQuery(data).concat(getParamTypeQuery(data), getReturnTypeQuery(data));
}


function getTagQuery(data) {
    if (data.tag.length === 0) {
        return {$exists: true, $not: {$size: 0}};
    } else {
        return {$all: data.tag}
    }
}

function getParamTypeQuery(data) {
    let paramTypeQuery = []
    if (data.params.length > 0) {
        paramTypeQuery = data.params.map(param => {
            return {$match: {params: {$elemMatch: {type: param.type}}}}
        })
    }
    return paramTypeQuery;
}

function getReturnTypeQuery(data) {
    let returnTypeQuery = []
    if (Object.keys(data.return).length > 0) {
        returnTypeQuery.push({$match: {"return.type": data["return"].type}})
    }
    return returnTypeQuery;
}

function getDescriptionQuery(data) {
    return data.return.description ? data.return.description : "";
}

function getMainQuery(data) {
    return [
        {
            $match:
                {
                    name: {$regex: data.name},
                    tag: getTagQuery(data),
                    params: {$size: data.params.length},
                    "post.description": {
                        $regex: getDescriptionQuery(data)
                    }
                }
        },
    ];
}



module.exports = {addPost, getPost};
