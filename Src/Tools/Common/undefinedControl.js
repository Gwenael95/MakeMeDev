/**
 * @namespace Tools
 */
/**
 * isDefinedAndNotNull
 * @function
 * @memberOf Tools
 * @name isDefinedAndNotNull -
 * Check if our value data is defined and not null
 * @param {*} value - a value to check
 * @returns {boolean}
 */
function isDefinedAndNotNull(value){
    return value !==null && value !==undefined
}

/**
 * isUndefinedOrNull
 * @function
 * @memberOf Tools
 * @name isUndefinedOrNull -
 * Check if a value is undefined or null
 * @param {*} value - a value to check
 * @returns {boolean}
 */
function isUndefinedOrNull(value){
    return value ===null || value ===undefined
}

module.exports = {isDefinedAndNotNull, isUndefinedOrNull}
