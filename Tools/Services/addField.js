const {isUndefinedOrNull} = require("../Common/undefinedControl")
const {countOccurrencesFromArray} = require("../Common/countOccurence")

function addAuthor(author, object){
    object.author =  {
        "userId": author._id,
        "pseudo": author.pseudo,
        "avatar": author.avatar
    }
}

function addDate(object, fieldName="creationDate"){
    object[fieldName] = new Date().getTime() / 1000
}

function setTypes(post, paramsOrResults) {
    let arr = []
    if (isUndefinedOrNull(post[paramsOrResults])) {
        post[paramsOrResults] = arr
    }
    else {
        for (let element of post[paramsOrResults]) {
            arr.push(element.type)
        }
    }
    post[paramsOrResults + "Types"] = countOccurrencesFromArray(arr)
}


module.exports = {addAuthor, addDate, setTypes}
