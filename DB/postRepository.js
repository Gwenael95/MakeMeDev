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
    console.log(JSON.stringify(getNameQuery(data)
        .concat(getParamTypeQuery(data), getReturnTypeQuery(data), getDescriptionQuery(data), getTagQuery(data))))
    return getNameQuery(data)
        .concat(getParamTypeQuery(data), getReturnTypeQuery(data), getDescriptionQuery(data), getTagQuery(data));
}


function getTagQuery(data) {
    if (data.tag !== null) {
        let dataTag = (data.tag.replace(/\s/g, '').split(","))
        if (dataTag.length === 0) {
            return [{$match: {$exists: true, $not: {$size: 0}}}];
        } else {
            return [{$match: {tag: {$all: dataTag}}}]
        }
    }
    return []
}


function getParamTypeQuery(data) {
    let unknownParams = 0
    let params = 0

    let paramTypeQuery = []
    if (data.paramsTypes !== null) {
        let dataParams = (data.paramsTypes.replace(/\s/g, '').split(","))
        if (dataParams.length > 0) {
            return dataParams.map(param => {
                if (param === "?") {
                    unknownParams++
                    return {$match: {params: {$elemMatch: {type: {$regex: ""}}}}}
                } else {
                    params++
                    return {$match: {params: {$elemMatch: {type: param}}}}
                }
            })
        } else if (dataParams.length === 0) {
            return [{$match: {params: {$size: dataParams.length}}}]
        }
    }
    return paramTypeQuery;
}

function getReturnTypeQuery(data) {
    let returnTypeQuery = []
    if (data.returnType !== null) {
        if (Object.keys(data.returnType).length > 0) {
            returnTypeQuery.push({$match: {"return.type": data.returnType}})
        } else if (Object.keys(data.returnType).length === 0) {
            returnTypeQuery.push({$match: {"return.type": {$size: Object.keys(data.returnType).length}}})
        }
    }
    return returnTypeQuery;
}

function getDescriptionQuery(data) {
    if (data.description !== null) {
        return [{$match: {"post.function": {$regex: data.description}}}]
    }
    return []
}

function getNameQuery(data) {
    if (data.functionName !== null) {
        return [{$match: {name: {$regex: data.functionName}}}];
    }
    return []
}


module.exports = {addPost, getPost};
