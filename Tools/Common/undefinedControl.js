function isDefinedAndNotNull(value){
    return value !==null && value !==undefined
}

function isUndefinedOrNull(value){
    return value ===null || value ===undefined
}

module.exports = {isDefinedAndNotNull, isUndefinedOrNull}
