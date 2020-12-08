exports.isUndefinedOrNull = (field) =>{
    return field === null || field === undefined;
}
exports.areAllUndefinedOrNull = (array) =>{
    let boolArray = [];
    for (let field in array){
        boolArray.push(field === null || field === undefined)
    }
    return !boolArray.includes(false)
}
