const {getHandler, addHandler} = require("./responseHandler");
const {addPost, getPost} = require("../DB/postRepository")


async function create(post) {
    const result = await addPost(post);
    return addHandler(result);
}

async function get(post) {
    const objectSearchPost = {
        functionName: getFunctionSearchValue(post, "[", "]"),
        paramsTypes: getFunctionSearchValue(post, "(", ")"),
        returnType: getFunctionSearchValue(post, "{", "}"),
        description: getSearchValue(post, '"'),
        tag: getSearchValue(post, '#')
    }
    console.log(objectSearchPost)
    return getHandler(await getPost(objectSearchPost), "ce post n'existe pas");
}

function getFunctionSearchValue(search, firstCharacter, lastCharacter) {
    return (search.includes(firstCharacter) && search.includes(lastCharacter)) ?
        search.substring(search.lastIndexOf(firstCharacter) + 1, search.lastIndexOf(lastCharacter)) : null;
}

function getSearchValue(search, character){
    let value = []
    let countCharacter = 0;
    search.split("").map((searchCharacter, index) => {
        if (searchCharacter === character) {
            countCharacter ++
            value.push(index)
        }
    })
    return countCharacter === 2 ? search.substring(value[0] + 1, value[1]) : null
}

module.exports = {create, get};
