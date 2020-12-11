const {getHandler, addHandler} = require("../Tools/Services/responseHandler");
const {addPost, getPost} = require("../DB/postRepository")
const {countOccurrencesFromArray} = require("../Tools/Common/countOccurence")
const {getSearchValue, getStringDelimitedArea} = require("../Tools/Common/stringOperation")

/** @function
 * @name create
 * Create a new post, that will be add in database.
 * We had one more field : paramsTypes to have an object with a number of occurrence of each params
 * It will make it simpler to search if a post contains an amount of params
 * @param {object} post - post to add, should be really similar to postModels {@link '../Models/postModels'}.
 * @returns {Promise<{code: number, body: {error: {}}}|{code: number, body: *}|{code: number, body: {error: string}}>}
 */
async function create(post) {
    let arr = []
    for(let param of post.params){
        arr.push(param.type)
    }
    post["paramsTypes"]= countOccurrencesFromArray(arr)
    const result = await addPost(post);
    return addHandler(result);
}

/** @function
 * @name get
 * Get posts depending on a request get thanks to a string with strict typography to demarcate
 * each field we have to check, and if not exist it will not be searched at all
 * Structure : [functionName](param1, param2, ?){returnedVar}"functionDescription"#tag1, tag2, tag3#
 * @param {string} post - post's field to find in database
 * @returns {Promise<{code: number, body: {error: *}}|{code: number, body: *}|{code: number, body: *}|{code: number, body: {error: string}}>}
 */
async function get(post) {
    const objectSearchPost = {
        functionName: getStringDelimitedArea(post, "[", "]"),
        paramsTypes: getStringDelimitedArea(post, "(", ")"),
        returnType: getStringDelimitedArea(post, "{", "}"),
        description: getSearchValue(post, '"'),
        tag: getSearchValue(post, '#')
    }
    console.log(objectSearchPost)
    return getHandler(await getPost(objectSearchPost), "ce post n'existe pas");
}

module.exports = {create, get};
