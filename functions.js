exports.isUndefinedOrNull = (field) =>{
    return field === null || field === undefined;
}
exports.areAllUndefinedOrNull = (dataObject) =>{
    let boolArray = [];
    for (let field in dataObject){
        boolArray.push(field === null || field === undefined)
    }
    return !boolArray.includes(false)
}


