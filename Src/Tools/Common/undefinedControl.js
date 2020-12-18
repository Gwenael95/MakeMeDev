/**
 * @namespace Tools
 */
/**
 * Check if our value data is defined and not null
 * @function
 * @memberOf Tools
 * @name isDefinedAndNotNull
 * @param {*} value - a value to check
 * @returns {boolean}
 */
function isDefinedAndNotNull(value){
    return value !==null && value !==undefined
}

/**
 * Check if a value is undefined or null.
 * @function
 * @memberOf Tools
 * @name isUndefinedOrNull
 * @param {*} value - a value to check
 * @returns {boolean}
 */
function isUndefinedOrNull(value){
    return value ===null || value ===undefined
}

module.exports = {isDefinedAndNotNull, isUndefinedOrNull}
