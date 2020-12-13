const {getHandler, getHandlerForUserPost} = require("../Tools/Services/responseHandler");
const {addPost, getPost, updateLikeOrDislike} = require("../DB/postRepository")
const {countOccurrencesFromArray} = require("../Tools/Common/countOccurence")
const { updateUserVotesById} = require("../DB/userRepository");
const {generateAccessToken} = require("../Tools/token")
let test = ""

//region exported methods
/** @function
 * @name create
 * Create a new post, that will be add in database.
 * We had one more field : paramsTypes to have an object with a number of occurrence of each params
 * It will make it simpler to search if a post contains an amount of params
 * @param {object} post - post to add, should be really similar to postModels {@link '../Models/postModels'}.
 * @returns {Promise<{code: number, body: {error: {}}}|{code: number, body: *}|{code: number, body: {error: string}}>}
 */
async function create(post) {
    setTypes(post, "params");
    setTypes(post, "returns");
    const result = await addPost(post);
    return getHandler(result);
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
    const objectSearchPost = getSearchPost(post)
    return getHandler(sortAllPostByLike(await getPost(objectSearchPost)), "ce post n'existe pas");
}

async function updateVote(vote, idPost, user) {
    const likeOrDislike = vote === 1 ? "like" : "dislike"
    const opposite = vote === 1 ? "dislike" : "like"

    //check if updated , then update user
    let result = await updateLikeOrDislike(likeOrDislike, idPost, user)
    if (result.success!== null && result.success!== undefined){
        const userRes = await updateUserVotesById({id:user._id}, {pull:{["activities." + likeOrDislike]:result.postId}, push:{["activities." + opposite]:result.postId}})
        generateAccessToken(userRes)
        const getUser = getHandlerForUserPost(userRes,result, "mise à jour des votes utilisateur impossible");
        //console.log(getUser);
        return getUser;
    }
    return getHandler({error:"update vote failed"}, "mise à jour des votes du post impossible");
}
//endregion


//region not exported functions
function setTypes(post, paramsOrResults) {
    if (post[paramsOrResults] === undefined || post[paramsOrResults] === null) {
        post[paramsOrResults] = []
    }
    let arr = []
    for (let element of post[paramsOrResults]) {
        arr.push(element.type)
    }
    post[paramsOrResults + "Types"] = countOccurrencesFromArray(arr)
}

function getSearchPost(post) {
    test = post
    return {
        functionName: getStringDelimitedArea( "[", "]"),
        paramsTypes: getStringDelimitedArea( "(", ")"),
        returnsTypes: getStringDelimitedArea( "{", "}"),
        description: getSearchValue( '"'),
        tag: getSearchValue( '#')
    };
}

/** @function
 * @name getStringDelimitedArea
 * Get a string in a delimited area defined by first and last delimiter
 * If the second delimiter isn't found in string, return a string from first delimiter to end
 * @param {string} test - string to analyse
 * @param {string} firstDelimiter - first delimiter used  to get the result
 * @param {string} lastDelimiter - last delimiter used to get the result
 * @returns {string|null}
 */
function getStringDelimitedArea( firstDelimiter, lastDelimiter) {
    if(test.includes(firstDelimiter) && test.includes(lastDelimiter)){
        let str = test.substring(test.lastIndexOf(firstDelimiter) + 1, test.lastIndexOf(lastDelimiter))
        test = test.substring( test.lastIndexOf(lastDelimiter)+1, test.length)
        return str
    }
    else {
        return null;
    }
}

/** @function
 * @name getSearchValue
 * Get a string in a delimited area defined by a delimiter
 * If there is only one delimiter, return null
 * @param {string} test - string to analyse
 * @param {string} delimiter - delimiter used to get the result
 * @returns {string|null}
 */
function getSearchValue( delimiter){
    let value = []
    let countCharacter = 0;
    test.split("").map((searchCharacter, index) => {
        if (searchCharacter === delimiter) {
            countCharacter ++
            value.push(index)
        }
    })

    if(countCharacter >= 2 ){
        let str = test.substring(value[0] + 1, value[1])
        test = test.substring( value[1] +1, test.length)
        return str
    }
    else {
        return null;
    }
}

function sortAllPostByLike(data){
    if (data.success!==null && data.success!==undefined) {
        for (let func of data.success) {
            func = sortPostByLikes(func)
        }
    }
    return data
}

function sortPostByLikes(data){
    data.post.sort(function (a, b) {
        return (b.like-b.dislike)-(a.like-a.dislike)  ;
    })
    return data
}
//endregion

module.exports = {create, get, updateVote};
